import uuid
import datetime
from flask import Blueprint, request, jsonify
from db import mongo
from utils.auth import hash_password, check_password, generate_token, token_required

auth_bp = Blueprint('auth', __name__)

# In-memory resilient store when MongoDB service is not connected locally
IN_MEMORY_USERS = {}

def normalize_role(role_name):
    if not role_name:
        return 'PATIENT'
    role = str(role_name).upper().strip()
    role_map = {
        'PATIENT': 'PATIENT',
        'DOCTOR': 'DOCTOR',
        'LAB_ASSISTANT': 'LAB_ASSISTANT',
        'LAB ASSISTANT': 'LAB_ASSISTANT',
        'LAB': 'LAB_ASSISTANT',
        'PHARMACY': 'PHARMACY',
        'PHARMACIST': 'PHARMACY',
        'CLINIC': 'PHARMACY',
        'APPOINTMENT': 'APPOINTMENT',
        'RECEPTIONIST': 'APPOINTMENT',
        'HOSPITAL_ADMIN': 'HOSPITAL_ADMIN',
        'HOSPITAL ADMIN': 'HOSPITAL_ADMIN',
        'SUPER_ADMIN': 'SUPER_ADMIN',
        'SUPER ADMIN': 'SUPER_ADMIN',
        'ADMIN': 'SUPER_ADMIN'
    }
    return role_map.get(role, role)

def seed_demo_accounts():
    print("Demo accounts initialized and ready for instant login.")

# Predefined demo accounts
DEMO_ACCOUNTS = {
    "patient@medassist.ai": {"role": "PATIENT", "name": "Sarah Williams (Demo Patient)", "email": "patient@medassist.ai", "phone": "9876543210"},
    "9876543210": {"role": "PATIENT", "name": "Sarah Williams (Demo Patient)", "email": "patient@medassist.ai", "phone": "9876543210"},
    
    "doctor@medassist.ai": {"role": "DOCTOR", "name": "Dr. Alexander Smith (Demo Doctor)", "email": "doctor@medassist.ai", "phone": "9876543211"},
    "9876543211": {"role": "DOCTOR", "name": "Dr. Alexander Smith (Demo Doctor)", "email": "doctor@medassist.ai", "phone": "9876543211"},
    
    "lab@medassist.ai": {"role": "LAB_ASSISTANT", "name": "Lab Assistant (Demo)", "email": "lab@medassist.ai", "phone": "9876543212"},
    "9876543212": {"role": "LAB_ASSISTANT", "name": "Lab Assistant (Demo)", "email": "lab@medassist.ai", "phone": "9876543212"},
    
    "receptionist@medassist.ai": {"role": "APPOINTMENT", "name": "Receptionist (Demo)", "email": "receptionist@medassist.ai", "phone": "9876543213"},
    "9876543213": {"role": "APPOINTMENT", "name": "Receptionist (Demo)", "email": "receptionist@medassist.ai", "phone": "9876543213"},
    
    "pharmacy@medassist.ai": {"role": "PHARMACY", "name": "Pharmacy Manager (Demo)", "email": "pharmacy@medassist.ai", "phone": "9876543214"},
    "9876543214": {"role": "PHARMACY", "name": "Pharmacy Manager (Demo)", "email": "pharmacy@medassist.ai", "phone": "9876543214"},
    
    "admin@medassist.ai": {"role": "HOSPITAL_ADMIN", "name": "Hospital Admin (Demo)", "email": "admin@medassist.ai", "phone": "9876543215"},
    "9876543215": {"role": "HOSPITAL_ADMIN", "name": "Hospital Admin (Demo)", "email": "admin@medassist.ai", "phone": "9876543215"},
    
    "superadmin@medassist.ai": {"role": "SUPER_ADMIN", "name": "Super Admin (Demo)", "email": "superadmin@medassist.ai", "phone": "9876543216"},
    "9876543216": {"role": "SUPER_ADMIN", "name": "Super Admin (Demo)", "email": "superadmin@medassist.ai", "phone": "9876543216"}
}

def get_demo_user_dict(demo_info):
    role = normalize_role(demo_info['role'])
    return {
        'id': f"demo-{role.lower()}-1",
        'name': demo_info['name'],
        'email': demo_info['email'],
        'phone': demo_info['phone'],
        'password': hash_password('123456'),
        'role': role,
        'profileCompleted': True,
        'language': 'en',
        'createdAt': datetime.datetime.utcnow()
    }

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password', '123456')
    role = normalize_role(data.get('role', 'patient'))
    
    if not email and not phone:
        return jsonify({'success': False, 'message': 'Email or Phone is required'}), 400
        
    identifier = email if email else phone
    
    new_user = {
        'id': str(uuid.uuid4()),
        'name': data.get('name', f'User {identifier}'),
        'email': email,
        'phone': phone,
        'password': hash_password(password),
        'role': role,
        'profileCompleted': False,
        'language': 'en',
        'createdAt': datetime.datetime.utcnow()
    }
    
    # Try saving to MongoDB with in-memory fallback
    try:
        mongo.db.users.insert_one(new_user)
    except Exception as e:
        IN_MEMORY_USERS[identifier] = new_user

    token = generate_token(new_user['id'], role)
    
    return jsonify({
        'success': True,
        'token': token,
        'user': {
            'id': new_user['id'],
            'name': new_user['name'],
            'email': new_user['email'],
            'phone': new_user['phone'],
            'role': new_user['role'],
            'profileCompleted': new_user['profileCompleted'],
            'language': new_user['language']
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    identifier = data.get('identifier')
    password = data.get('password', '123456')
    role = normalize_role(data.get('role', 'patient'))
    
    if not identifier:
        return jsonify({'success': False, 'message': 'Identifier required'}), 400
        
    identifier_clean = str(identifier).strip().lower()
    
    # 1. Direct Demo Account match
    demo_info = DEMO_ACCOUNTS.get(identifier_clean) or DEMO_ACCOUNTS.get(str(identifier).strip())
    if demo_info:
        user = get_demo_user_dict(demo_info)
        token = generate_token(user['id'], user['role'])
        user_data = {k: v for k, v in user.items() if k not in ['_id', 'password']}
        return jsonify({
            'success': True,
            'token': token,
            'user': user_data
        }), 200

    # 2. General user lookup with MongoDB / In-memory fallback
    user = None
    try:
        user = mongo.db.users.find_one({
            '$or': [{'email': identifier}, {'phone': identifier}]
        })
    except Exception:
        pass
        
    if not user:
        user = IN_MEMORY_USERS.get(identifier)

    # 3. Dynamic registration if first time
    if not user:
        user = {
            'id': str(uuid.uuid4()),
            'name': f'User {identifier}',
            'email': identifier if '@' in identifier else '',
            'phone': identifier if '@' not in identifier else '',
            'password': hash_password(password),
            'role': role,
            'profileCompleted': role != 'PATIENT',
            'language': 'en',
            'createdAt': datetime.datetime.utcnow()
        }
        IN_MEMORY_USERS[identifier] = user

    token = generate_token(user['id'], user['role'])
    user_data = {k: v for k, v in user.items() if k not in ['_id', 'password']}
    
    return jsonify({
        'success': True,
        'token': token,
        'user': user_data
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    user_data = {k: v for k, v in current_user.items() if k not in ['_id', 'password']}
    return jsonify({
        'success': True,
        'user': user_data
    }), 200
