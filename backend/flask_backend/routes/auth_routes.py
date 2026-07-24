from flask import Blueprint, request, jsonify
from db import mongo
from utils.auth import hash_password, check_password, generate_token, token_required
import uuid
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # We will use email or phone as identifier
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password', '123456') # Default password if not provided by mock frontend
    role = data.get('role', 'patient')
    
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

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password', '123456')
    role = data.get('role', 'patient')
    
    if not identifier:
        return jsonify({'success': False, 'message': 'Identifier required'}), 400
        
    # Find user by email or phone (role-insensitive first)
    user = mongo.db.users.find_one({
        '$or': [{'email': identifier}, {'phone': identifier}]
    })
    
    # If user doesn't exist, register them dynamically
    if not user:
        return register_from_login(data)
        
    # Verify password
    if not check_password(password, user['password']):
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
    # Update role to the chosen role if it has changed, ensuring easy testing
    if user.get('role') != role:
        mongo.db.users.update_one(
            {'id': user['id']},
            {'$set': {
                'role': role,
                'profileCompleted': role != 'patient'
            }}
        )
        user['role'] = role
        user['profileCompleted'] = role != 'patient'
        
    token = generate_token(user['id'], user['role'])
    
    user_data = {k: v for k, v in user.items() if k not in ['_id', 'password']}
    return jsonify({
        'success': True,
        'token': token,
        'user': user_data
    }), 200

def register_from_login(data):
    identifier = data.get('identifier')
    role = data.get('role', 'patient')
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
        'profileCompleted': role != 'patient',
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
        
    user_data = {k: v for k, v in user.items() if k not in ['_id', 'password']}
    return jsonify({
        'success': True,
        'user': user_data
    }), 200
