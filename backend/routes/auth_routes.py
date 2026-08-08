from flask import Blueprint, request, jsonify
from db import mongo
from utils.auth import hash_password, check_password, generate_token, token_required
import uuid
import datetime

auth_bp = Blueprint('auth', __name__)

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

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # We will use email or phone as identifier
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password', '123456') # Default password if not provided by mock frontend
    role = normalize_role(data.get('role', 'patient'))
    
    if not email and not phone:
        return jsonify({'success': False, 'message': 'Email or Phone is required'}), 400
        
    identifier = email if email else phone
    
    # Check if user exists
    existing_user = mongo.db.users.find_one({'$or': [{'email': identifier}, {'phone': identifier}]})
    if existing_user:
        return jsonify({'success': False, 'message': 'User already exists'}), 400
        
    new_user = {
        'id': str(uuid.uuid4()),
        'name': data.get('name', f'User {identifier}'),
        'email': email,
        'phone': phone,
        'password': hash_password(password),
        'role': role,
        'profileCompleted': False,
        'language': 'en', # Default language
        'createdAt': datetime.datetime.utcnow()
    }
    
    mongo.db.users.insert_one(new_user)
    
    # Generate token
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

def register_demo_user(demo_info):
    role_normalized = normalize_role(demo_info['role'])
    new_user = {
        'id': str(uuid.uuid4()),
        'name': demo_info['name'],
        'email': demo_info['email'],
        'phone': demo_info['phone'],
        'password': hash_password('123456'),
        'role': role_normalized,
        'profileCompleted': True,
        'language': 'en',
        'createdAt': datetime.datetime.utcnow()
    }
    mongo.db.users.insert_one(new_user)
    return new_user

def seed_demo_accounts():
    # Only keep unique users based on email
    unique_users = {}
    for identifier, info in DEMO_ACCOUNTS.items():
        unique_users[info['email']] = info
        
    for email, info in unique_users.items():
        role_normalized = normalize_role(info['role'])
        existing_user = mongo.db.users.find_one({
            '$or': [{'email': info['email']}, {'phone': info['phone']}]
        })
        if not existing_user:
            register_demo_user(info)
            print(f"Seeded demo account: {info['name']} ({info['email']})")
        else:
            # Ensure existing demo accounts have correct normalized roles and details
            if existing_user.get('role') != role_normalized or not existing_user.get('profileCompleted'):
                mongo.db.users.update_one(
                    {'id': existing_user['id']},
                    {'$set': {
                        'role': role_normalized,
                        'profileCompleted': True,
                        'name': info['name'],
                        'email': info['email'],
                        'phone': info['phone']
                    }}
                )
                print(f"Normalized existing demo account: {info['name']} ({info['email']})")

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password', '123456')
    role = normalize_role(data.get('role', 'patient'))
    
    if not identifier:
        return jsonify({'success': False, 'message': 'Identifier required'}), 400
        
    # Check if this is a demo account
    demo_info = DEMO_ACCOUNTS.get(identifier)
    if demo_info:
        role = normalize_role(demo_info['role'])
        # Find user by email or phone associated with this demo account
        user = mongo.db.users.find_one({
            '$or': [{'email': demo_info['email']}, {'phone': demo_info['phone']}]
        })
        if not user:
            user = register_demo_user(demo_info)
        else:
            # Force normalized role and details on login
            if user.get('role') != role or not user.get('profileCompleted'):
                mongo.db.users.update_one(
                    {'id': user['id']},
                    {'$set': {
                        'role': role,
                        'profileCompleted': True,
                        'name': demo_info['name'],
                        'email': demo_info['email'],
                        'phone': demo_info['phone']
                    }}
                )
                user['role'] = role
                user['profileCompleted'] = True
                user['name'] = demo_info['name']
                user['email'] = demo_info['email']
                user['phone'] = demo_info['phone']
    else:
        # Find user by email or phone (role-insensitive first)
        user = mongo.db.users.find_one({
            '$or': [{'email': identifier}, {'phone': identifier}]
        })
        
        # If user doesn't exist, register them dynamically
        if not user:
            data['role'] = role
            return register_from_login(data)
            
    # Verify password
    if not check_password(password, user['password']):
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
    # Ensure role is normalized
    user['role'] = normalize_role(user.get('role', 'PATIENT'))
    
    # Update role to the chosen role if it has changed, ensuring easy testing (skip for demo accounts)
    if not demo_info and user.get('role') != role:
        mongo.db.users.update_one(
            {'id': user['id']},
            {'$set': {
                'role': role,
                'profileCompleted': role != 'PATIENT'
            }}
        )
        user['role'] = role
        user['profileCompleted'] = role != 'PATIENT'
        
    token = generate_token(user['id'], user['role'])
    
    user_data = {k: v for k, v in user.items() if k not in ['_id', 'password']}
    return jsonify({
        'success': True,
        'token': token,
        'user': user_data
    }), 200


def register_from_login(data):
    identifier = data.get('identifier')
    role = normalize_role(data.get('role', 'patient'))
    login_method = data.get('loginMethod', 'email')
    
    email = identifier if login_method == 'email' else ''
    phone = identifier if login_method == 'phone' else ''
    password = data.get('password', '123456')
    
    new_user = {
        'id': str(uuid.uuid4()),
        'name': f'User {identifier}',
        'email': email,
        'phone': phone,
        'password': hash_password(password),
        'role': role,
        'profileCompleted': role != 'PATIENT',
        'language': 'en',
        'createdAt': datetime.datetime.utcnow()
    }
    
    mongo.db.users.insert_one(new_user)
    token = generate_token(new_user['id'], role)
    
    user_data = {k: v for k, v in new_user.items() if k not in ['_id', 'password']}
    return jsonify({
        'success': True,
        'token': token,
        'user': user_data
    }), 201

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me(current_user):
    user = mongo.db.users.find_one({'id': current_user['id']})
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
        
    user['role'] = normalize_role(user.get('role', 'PATIENT'))
    user_data = {k: v for k, v in user.items() if k not in ['_id', 'password']}
    return jsonify({
        'success': True,
        'user': user_data
    }), 200
