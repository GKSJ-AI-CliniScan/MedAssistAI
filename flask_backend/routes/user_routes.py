from flask import Blueprint, request, jsonify
from db import mongo
from utils.auth import token_required, hash_password
import uuid
import datetime

user_bp = Blueprint('user', __name__)

MOCK_DOCTORS = [
    {
        "id": "doc-1",
        "name": "Dr. Sarah Johnson",
        "email": "sarah.johnson@medassist.com",
        "phone": "+1234567890",
        "role": "doctor",
        "specialization": "General Medicine",
        "specialty": "General Medicine",
        "consultantType": "doctor",
        "profileCompleted": True
    },
    {
        "id": "doc-2",
        "name": "Dr. Michael Chen",
        "email": "michael.chen@medassist.com",
        "phone": "+0987654321",
        "role": "doctor",
        "specialization": "Cardiology",
        "specialty": "Cardiology",
        "consultantType": "doctor",
        "profileCompleted": True
    },
    {
        "id": "doc-3",
        "name": "Dr. Alexander Smith",
        "email": "alex.smith@medassist.com",
        "phone": "+9998887776",
        "role": "doctor",
        "specialization": "General Medicine",
        "specialty": "General Medicine",
        "consultantType": "doctor",
        "profileCompleted": True
    }
]

MOCK_PATIENTS = [
    {
        "id": "patient-1",
        "name": "Alice Cooper",
        "email": "alice.cooper@email.com",
        "phone": "9876543210",
        "role": "patient",
        "gender": "Female",
        "age": 34,
        "profileCompleted": True,
        "address": "Medical District, Hyderabad",
        "emergencyContactName": "Bob Cooper",
        "emergencyContactNumber": "9876543211"
    }
]

IN_MEMORY_DOCTORS = list(MOCK_DOCTORS)
IN_MEMORY_PATIENTS = list(MOCK_PATIENTS)

def seed_users_if_empty():
    try:
        if mongo.db.users.count_documents({"role": "doctor"}) == 0:
            docs = []
            for d in MOCK_DOCTORS:
                doc_copy = d.copy()
                doc_copy["password"] = hash_password("123456")
                doc_copy["createdAt"] = datetime.datetime.utcnow()
                docs.append(doc_copy)
            mongo.db.users.insert_many(docs)
            
        if mongo.db.users.count_documents({"role": "patient"}) == 0:
            pats = []
            for p in MOCK_PATIENTS:
                pat_copy = p.copy()
                pat_copy["password"] = hash_password("123456")
                pat_copy["createdAt"] = datetime.datetime.utcnow()
                pats.append(pat_copy)
            mongo.db.users.insert_many(pats)
    except Exception:
        pass

@user_bp.route('/language', methods=['PUT'])
@token_required
def update_language(current_user):
    data = request.get_json() or {}
    language = data.get('language')
    
    if not language:
        return jsonify({'success': False, 'message': 'Language code is required'}), 400
        
    try:
        mongo.db.users.update_one(
            {'id': current_user['id']},
            {'$set': {'language': language}}
        )
    except Exception:
        pass
            
    return jsonify({
        'success': True, 
        'message': 'Language updated successfully',
        'language': language
    }), 200

@user_bp.route('/profile', methods=['PUT'])
@token_required
def complete_profile(current_user):
    profile_data = request.get_json() or {}
    
    if 'password' in profile_data:
        del profile_data['password']
    if 'id' in profile_data:
        del profile_data['id']
        
    profile_data['profileCompleted'] = True
    
    user = None
    try:
        mongo.db.users.update_one(
            {'id': current_user['id']},
            {'$set': profile_data}
        )
        user = mongo.db.users.find_one({'id': current_user['id']}, {'_id': 0, 'password': 0})
    except Exception:
        pass

    if not user:
        user = dict(current_user)
        user.update(profile_data)
        if 'password' in user:
            del user['password']
        if '_id' in user:
            del user['_id']
    
    return jsonify({
        'success': True,
        'user': user
    }), 200

@user_bp.route('/doctors', methods=['GET'])
@token_required
def get_doctors(current_user):
    seed_users_if_empty()
    try:
        doctors = list(mongo.db.users.find({"role": "doctor"}, {'_id': 0, 'password': 0}))
        if doctors:
            return jsonify({'success': True, 'data': doctors}), 200
    except Exception:
        pass
    return jsonify({'success': True, 'data': IN_MEMORY_DOCTORS}), 200

@user_bp.route('/patients', methods=['GET'])
@token_required
def get_patients(current_user):
    seed_users_if_empty()
    try:
        patients = list(mongo.db.users.find({"role": "patient"}, {'_id': 0, 'password': 0}))
        if patients:
            return jsonify({'success': True, 'data': patients}), 200
    except Exception:
        pass
    return jsonify({'success': True, 'data': IN_MEMORY_PATIENTS}), 200

@user_bp.route('/patients', methods=['POST'])
@token_required
def register_patient(current_user):
    seed_users_if_empty()
    data = request.get_json() or {}
    name = data.get('name')
    phone = data.get('phone')
    email = data.get('email', '')
    
    if not name or not phone:
        return jsonify({'success': False, 'message': 'Name and Phone are required'}), 400
        
    # Check if patient already exists
    existing = None
    try:
        existing = mongo.db.users.find_one({
            'role': 'patient',
            '$or': [{'phone': phone}, {'email': email} if email else {'phone': phone}]
        })
    except Exception:
        existing = next((p for p in IN_MEMORY_PATIENTS if p.get('phone') == phone or (email and p.get('email') == email)), None)
    
    if existing:
        res = dict(existing)
        if '_id' in res:
            del res['_id']
        if 'password' in res:
            del res['password']
        return jsonify({'success': True, 'data': res}), 200
        
    new_patient = {
        'id': f"patient-{int(datetime.datetime.utcnow().timestamp())}",
        'name': name,
        'email': email,
        'phone': phone,
        'role': 'patient',
        'password': hash_password('123456'),
        'profileCompleted': False,
        'createdAt': datetime.datetime.utcnow()
    }
    
    try:
        mongo.db.users.insert_one(dict(new_patient))
    except Exception:
        IN_MEMORY_PATIENTS.append(new_patient)

    res_patient = {k: v for k, v in new_patient.items() if k not in ['_id', 'password']}
    return jsonify({'success': True, 'data': res_patient}), 201
