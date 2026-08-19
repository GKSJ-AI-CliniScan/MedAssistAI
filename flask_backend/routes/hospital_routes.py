from flask import Blueprint, request, jsonify
from db import mongo
from utils.auth import token_required, hash_password
import uuid
import datetime

hospital_bp = Blueprint('hospital', __name__)

DEFAULT_DEPARTMENTS = [
    { "id": "dept-1", "name": "General Medicine", "status": "Active" },
    { "id": "dept-2", "name": "Cardiology", "status": "Active" },
    { "id": "dept-3", "name": "Pediatrics", "status": "Active" },
    { "id": "dept-4", "name": "Orthopedics", "status": "Active" },
    { "id": "dept-5", "name": "Ophthalmology", "status": "Active" },
    { "id": "dept-6", "name": "Dermatology", "status": "Active" }
]

IN_MEMORY_DEPARTMENTS = [d.copy() for d in DEFAULT_DEPARTMENTS]
IN_MEMORY_STAFF = []

def seed_departments_if_empty():
    try:
        if mongo.db.departments.count_documents({}) == 0:
            mongo.db.departments.insert_many(DEFAULT_DEPARTMENTS)
    except Exception:
        pass

# ======================================================
# STAFF ROUTES
# ======================================================

@hospital_bp.route('/staff', methods=['GET'])
@token_required
def get_staff(current_user):
    role_mapping = {
        "doctor": "Doctor",
        "appointment": "Receptionist",
        "lab": "Lab Technician",
        "pharmacy": "Pharmacist"
    }
    
    try:
        staff_users = list(mongo.db.users.find(
            {"role": {"$in": ["doctor", "appointment", "lab", "pharmacy"]}},
            {"_id": 0, "password": 0}
        ))
        if staff_users:
            normalized = []
            for s in staff_users:
                item = s.copy()
                item["role"] = role_mapping.get(s.get("role", ""), s.get("role", ""))
                item["department"] = s.get("department") or s.get("specialization") or "Hospital Admin"
                item["status"] = "Active" if s.get("isActive", True) is not False else "Inactive"
                normalized.append(item)
            return jsonify(normalized), 200
    except Exception:
        pass
        
    return jsonify(IN_MEMORY_STAFF), 200

@hospital_bp.route('/staff', methods=['POST'])
@token_required
def add_staff(current_user):
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    role_label = data.get('role')
    department = data.get('department')
    status = data.get('status', 'Active')
    
    if not name or not email or not phone or not role_label:
        return jsonify({'success': False, 'message': 'Missing mandatory staff fields'}), 400
        
    role_mapping = {
        "Doctor": "doctor",
        "Receptionist": "appointment",
        "Lab Technician": "lab",
        "Pharmacist": "pharmacy"
    }
    role = role_mapping.get(role_label, role_label.lower())
    
    existing = None
    try:
        existing = mongo.db.users.find_one({'$or': [{'email': email}, {'phone': phone}]})
    except Exception:
        existing = next((s for s in IN_MEMORY_STAFF if s.get('email') == email or s.get('phone') == phone), None)
        
    if existing:
        return jsonify({'success': False, 'message': 'A user with this email or phone already exists'}), 400
        
    staff_id = f"staff-{str(uuid.uuid4())[:8]}"
    new_staff = {
        'id': staff_id,
        'name': name,
        'email': email,
        'phone': phone,
        'role': role,
        'password': hash_password('123456'),
        'department': department,
        'specialization': department if role == 'doctor' else '',
        'specialty': department if role == 'doctor' else '',
        'consultantType': 'doctor' if role == 'doctor' else '',
        'isActive': status == 'Active',
        'profileCompleted': True,
        'createdAt': datetime.datetime.utcnow()
    }
    
    try:
        mongo.db.users.insert_one(dict(new_staff))
    except Exception:
        pass

    ret = new_staff.copy()
    if '_id' in ret: del ret['_id']
    if 'password' in ret: del ret['password']
    ret["role"] = role_label
    ret["status"] = status
    IN_MEMORY_STAFF.append(ret)
    
    return jsonify({'success': True, 'data': ret}), 201

@hospital_bp.route('/staff/<id>', methods=['PUT'])
@token_required
def update_staff(current_user, id):
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    role_label = data.get('role')
    department = data.get('department')
    status = data.get('status')
    
    role_mapping = {
        "Doctor": "doctor",
        "Receptionist": "appointment",
        "Lab Technician": "lab",
        "Pharmacist": "pharmacy"
    }
    
    updates = {}
    if name is not None: updates['name'] = name
    if email is not None: updates['email'] = email
    if phone is not None: updates['phone'] = phone
    if role_label is not None:
        role = role_mapping.get(role_label, role_label.lower())
        updates['role'] = role
        if role == 'doctor' and department is not None:
            updates['specialization'] = department
            updates['specialty'] = department
            updates['consultantType'] = 'doctor'
    if department is not None:
        updates['department'] = department
            
    if status is not None:
        updates['isActive'] = (status == 'Active')
        
    try:
        mongo.db.users.update_one({'id': id}, {'$set': updates})
        updated_staff = mongo.db.users.find_one({'id': id}, {'_id': 0, 'password': 0})
        if updated_staff:
            ret_role = role_label or role_mapping.get(updated_staff.get('role', ''), updated_staff.get('role', ''))
            ret = updated_staff.copy()
            ret["role"] = ret_role
            ret["department"] = updated_staff.get("department") or updated_staff.get("specialization") or "Hospital Admin"
            ret["status"] = "Active" if updated_staff.get("isActive", True) is not False else "Inactive"
            return jsonify({'success': True, 'data': ret}), 200
    except Exception:
        pass

    staff_m = next((s for s in IN_MEMORY_STAFF if s.get('id') == id), None)
    if not staff_m:
        return jsonify({'success': False, 'message': 'Staff member not found'}), 404
    staff_m.update(updates)
    if role_label: staff_m['role'] = role_label
    if status: staff_m['status'] = status
    return jsonify({'success': True, 'data': staff_m}), 200

@hospital_bp.route('/staff/<id>', methods=['DELETE'])
@token_required
def delete_staff(current_user, id):
    try:
        mongo.db.users.delete_one({'id': id})
    except Exception:
        pass
    global IN_MEMORY_STAFF
    IN_MEMORY_STAFF = [s for s in IN_MEMORY_STAFF if s.get('id') != id]
    return jsonify({'success': True, 'message': 'Staff member deleted successfully'}), 200

# ======================================================
# DEPARTMENTS ROUTES
# ======================================================

@hospital_bp.route('/departments', methods=['GET'])
@token_required
def get_departments(current_user):
    seed_departments_if_empty()
    try:
        departments = list(mongo.db.departments.find({}, {'_id': 0}))
        if departments:
            enriched = []
            for d in departments:
                dept_name = d.get("name", "")
                doctors_count = 0
                staff_count = 0
                try:
                    doctors_count = mongo.db.users.count_documents({
                        "role": "doctor",
                        "$or": [{"department": dept_name}, {"specialization": dept_name}]
                    })
                    staff_count = mongo.db.users.count_documents({
                        "role": {"$in": ["doctor", "appointment", "lab", "pharmacy"]},
                        "$or": [{"department": dept_name}, {"specialization": dept_name}]
                    })
                except Exception:
                    pass
                item = d.copy()
                item["doctors"] = doctors_count
                item["staff"] = staff_count
                enriched.append(item)
            return jsonify(enriched), 200
    except Exception:
        pass

    return jsonify(IN_MEMORY_DEPARTMENTS), 200

@hospital_bp.route('/departments', methods=['POST'])
@token_required
def add_department(current_user):
    data = request.get_json() or {}
    name = data.get('name')
    status = data.get('status', 'Active')
    
    if not name:
        return jsonify({'success': False, 'message': 'Department name is required'}), 400
        
    dept_id = f"dept-{str(uuid.uuid4())[:8]}"
    new_dept = {
        'id': dept_id,
        'name': name,
        'status': status,
        'doctors': 0,
        'staff': 0
    }
    
    try:
        mongo.db.departments.insert_one(dict(new_dept))
    except Exception:
        pass
        
    IN_MEMORY_DEPARTMENTS.append(new_dept)
    ret = new_dept.copy()
    if '_id' in ret: del ret['_id']
    return jsonify({'success': True, 'data': ret}), 201

@hospital_bp.route('/departments/<id>', methods=['PUT'])
@token_required
def update_department(current_user, id):
    data = request.get_json() or {}
    name = data.get('name')
    status = data.get('status')
    
    updates = {}
    if name is not None: updates['name'] = name
    if status is not None: updates['status'] = status
    
    try:
        mongo.db.departments.update_one({'id': id}, {'$set': updates})
        updated_dept = mongo.db.departments.find_one({'id': id}, {'_id': 0})
        if updated_dept:
            return jsonify({'success': True, 'data': updated_dept}), 200
    except Exception:
        pass

    dept = next((d for d in IN_MEMORY_DEPARTMENTS if d.get('id') == id), None)
    if not dept:
        return jsonify({'success': False, 'message': 'Department not found'}), 404
    dept.update(updates)
    return jsonify({'success': True, 'data': dept}), 200

@hospital_bp.route('/departments/<id>', methods=['DELETE'])
@token_required
def delete_department(current_user, id):
    try:
        mongo.db.departments.delete_one({'id': id})
    except Exception:
        pass
    global IN_MEMORY_DEPARTMENTS
    IN_MEMORY_DEPARTMENTS = [d for d in IN_MEMORY_DEPARTMENTS if d.get('id') != id]
    return jsonify({'success': True, 'message': 'Department deleted successfully'}), 200
