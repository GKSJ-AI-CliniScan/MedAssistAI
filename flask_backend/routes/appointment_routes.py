import datetime
import random
from flask import Blueprint, request, jsonify
from db import mongo
from utils.auth import token_required

appointment_bp = Blueprint('appointment', __name__)

# Standard available timeslots
ALL_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
]

IN_MEMORY_APPOINTMENTS = [
    {
        "id": "appt-1",
        "patientId": "patient-1",
        "patientName": "Alice Cooper",
        "patientPhone": "9876543210",
        "doctorId": "doc-3",
        "doctorName": "Dr. Alexander Smith",
        "date": datetime.date.today().isoformat(),
        "time": "09:30 AM",
        "scheduledTime": "09:30 AM",
        "reason": "General Checkup",
        "status": "Waiting",
        "consultantType": "doctor",
        "tokenNumber": 1,
        "priority": "normal",
        "notes": "Regular checkup",
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
]

def seed_appointments_if_empty():
    try:
        if mongo.db.appointments.count_documents({}) == 0:
            mongo.db.appointments.insert_one(dict(IN_MEMORY_APPOINTMENTS[0]))
    except Exception:
        pass

@appointment_bp.route('', methods=['GET'])
@token_required
def get_appointments(current_user):
    seed_appointments_if_empty()
    
    doctor_id = request.args.get('doctorId')
    patient_id = request.args.get('patientId')
    date = request.args.get('date')
    
    query = {}
    if doctor_id:
        query['doctorId'] = doctor_id
    if patient_id:
        query['patientId'] = patient_id
    if date:
        query['date'] = date
        
    try:
        appts = list(mongo.db.appointments.find(query).sort('time', 1))
        for a in appts:
            if '_id' in a:
                a['_id'] = str(a['_id'])
            a['scheduledTime'] = a.get('time', '')
        if appts:
            return jsonify({'success': True, 'data': appts}), 200
    except Exception:
        pass

    # In-memory filter
    filtered = [
        a for a in IN_MEMORY_APPOINTMENTS
        if (not doctor_id or a.get('doctorId') == doctor_id) and
           (not patient_id or a.get('patientId') == patient_id) and
           (not date or a.get('date') == date)
    ]
    return jsonify({'success': True, 'data': filtered}), 200

@appointment_bp.route('', methods=['POST'])
@token_required
def create_appointment(current_user):
    seed_appointments_if_empty()
    
    data = request.get_json() or {}
    patient_id = data.get('patientId')
    patient_name = data.get('patientName')
    patient_phone = data.get('patientPhone', '')
    doctor_id = data.get('doctorId')
    doctor_name = data.get('doctorName')
    appt_date = data.get('date')
    appt_time = data.get('time') or data.get('slot') or "09:00 AM"
    reason = data.get('reason') or data.get('notes') or "Regular consultation"
    priority = data.get('priority', 'normal')
    consultant_type = data.get('consultantType', 'doctor')
    
    if not patient_id or not patient_name or not doctor_id or not appt_date:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
    # Check for double booking (excluding cancelled appointments)
    existing_appt = None
    try:
        existing_appt = mongo.db.appointments.find_one({
            'doctorId': doctor_id,
            'date': appt_date,
            'time': appt_time,
            'status': {'$nin': ['cancelled', 'Cancelled']}
        })
    except Exception:
        existing_appt = next((a for a in IN_MEMORY_APPOINTMENTS if a.get('doctorId') == doctor_id and a.get('date') == appt_date and a.get('time') == appt_time and a.get('status') not in ['cancelled', 'Cancelled']), None)

    if existing_appt:
        return jsonify({'success': False, 'message': 'This slot is already booked for this doctor'}), 409
        
    # Generate token number
    token_number = 1
    try:
        today_count = mongo.db.appointments.count_documents({
            'doctorId': doctor_id,
            'date': appt_date
        })
        token_number = today_count + 1
    except Exception:
        token_number = len([a for a in IN_MEMORY_APPOINTMENTS if a.get('doctorId') == doctor_id and a.get('date') == appt_date]) + 1
    
    appt_id = f"appt-{int(datetime.datetime.utcnow().timestamp())}-{random.randint(1000, 9999)}"
    
    new_appt = {
        "id": appt_id,
        "patientId": patient_id,
        "patientName": patient_name,
        "patientPhone": patient_phone,
        "doctorId": doctor_id,
        "doctorName": doctor_name,
        "date": appt_date,
        "time": appt_time,
        "scheduledTime": appt_time,
        "reason": reason,
        "status": "Waiting",
        "consultantType": consultant_type,
        "tokenNumber": token_number,
        "priority": priority,
        "notes": reason,
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    
    try:
        mongo.db.appointments.insert_one(dict(new_appt))
        if '_id' in new_appt:
            new_appt['_id'] = str(new_appt['_id'])
    except Exception:
        IN_MEMORY_APPOINTMENTS.append(new_appt)
        
    return jsonify({'success': True, 'data': new_appt}), 201

@appointment_bp.route('/<appt_id>/status', methods=['PUT'])
@token_required
def update_status(current_user, appt_id):
    seed_appointments_if_empty()
    
    data = request.get_json() or {}
    status = data.get('status')
    
    if not status:
        return jsonify({'success': False, 'message': 'Status is required'}), 400
        
    try:
        mongo.db.appointments.update_one(
            {'id': appt_id},
            {'$set': {'status': status}}
        )
        updated = mongo.db.appointments.find_one({'id': appt_id})
        if updated:
            if '_id' in updated:
                updated['_id'] = str(updated['_id'])
            updated['scheduledTime'] = updated.get('time', '')
            return jsonify({'success': True, 'data': updated}), 200
    except Exception:
        pass

    appt = next((a for a in IN_MEMORY_APPOINTMENTS if a.get('id') == appt_id), None)
    if not appt:
        return jsonify({'success': False, 'message': 'Appointment not found'}), 404
    appt['status'] = status
    return jsonify({'success': True, 'data': appt}), 200

@appointment_bp.route('/slots', methods=['GET'])
@token_required
def get_available_slots(current_user):
    seed_appointments_if_empty()
    
    doctor_id = request.args.get('doctorId')
    date = request.args.get('date')
    
    if not doctor_id or not date:
        return jsonify({'success': False, 'message': 'Doctor ID and Date are required'}), 400
        
    booked_times = set()
    try:
        booked_appts = list(mongo.db.appointments.find({
            'doctorId': doctor_id,
            'date': date,
            'status': {'$nin': ['cancelled', 'Cancelled']}
        }, {'time': 1, '_id': 0}))
        booked_times = {appt['time'] for appt in booked_appts}
    except Exception:
        booked_times = {a['time'] for a in IN_MEMORY_APPOINTMENTS if a.get('doctorId') == doctor_id and a.get('date') == date and a.get('status') not in ['cancelled', 'Cancelled']}
    
    available_slots = [slot for slot in ALL_SLOTS if slot not in booked_times]
    return jsonify({'success': True, 'data': available_slots}), 200

@appointment_bp.route('/queue', methods=['GET'])
@token_required
def get_queue(current_user):
    seed_appointments_if_empty()
    
    doctor_id = request.args.get('doctorId')
    date = request.args.get('date')
    
    if not doctor_id:
        return jsonify({'success': False, 'message': 'Doctor ID is required'}), 400
        
    if not date:
        date = datetime.date.today().isoformat()
        
    appts = []
    try:
        appts = list(mongo.db.appointments.find({
            'doctorId': doctor_id,
            'date': date,
            'status': {'$in': ['Waiting', 'Scheduled', 'in-progress', 'waiting', 'scheduled']}
        }, {'_id': 0}).sort('time', 1))
    except Exception:
        appts = [a for a in IN_MEMORY_APPOINTMENTS if a.get('doctorId') == doctor_id and a.get('date') == date and a.get('status') in ['Waiting', 'Scheduled', 'in-progress', 'waiting', 'scheduled']]
    
    queue_items = []
    for idx, appt in enumerate(appts):
        status_lower = appt.get('status', 'waiting').lower()
        queue_items.append({
            "id": appt.get('id'),
            "patientName": appt.get('patientName'),
            "appointmentTime": appt.get('time'),
            "time": appt.get('time'),
            "reason": appt.get('reason'),
            "status": 'in-progress' if status_lower == 'in-progress' else 'waiting',
            "patient": {"name": appt.get('patientName'), "id": appt.get('patientId')},
            "queueNumber": idx + 1
        })
        
    return jsonify({'success': True, 'data': queue_items}), 200

@appointment_bp.route('/queue/stats', methods=['GET'])
@token_required
def get_queue_stats(current_user):
    seed_appointments_if_empty()
    
    doctor_id = request.args.get('doctorId')
    date = request.args.get('date')
    
    if not doctor_id:
        return jsonify({'success': False, 'message': 'Doctor ID is required'}), 400
        
    if not date:
        date = datetime.date.today().isoformat()
        
    appts = []
    try:
        appts = list(mongo.db.appointments.find({
            'doctorId': doctor_id,
            'date': date
        }))
    except Exception:
        appts = [a for a in IN_MEMORY_APPOINTMENTS if a.get('doctorId') == doctor_id and a.get('date') == date]
    
    waiting = len([a for a in appts if a.get('status') in ['Waiting', 'Scheduled', 'waiting', 'scheduled']])
    in_progress = len([a for a in appts if a.get('status') in ['in-progress', 'In Consultation']])
    completed = len([a for a in appts if a.get('status') in ['completed', 'Completed']])
    
    return jsonify({
        'success': True,
        'data': {
            'waiting': waiting,
            'inProgress': in_progress,
            'completed': completed,
            'estimatedWaitMinutes': waiting * 15
        }
    }), 200
