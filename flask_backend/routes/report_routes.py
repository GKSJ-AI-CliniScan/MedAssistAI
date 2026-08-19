import os
import datetime
from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from db import mongo
from utils.auth import token_required

report_bp = Blueprint('report', __name__)

UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads'))
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Mock reports seed data
MOCK_REPORTS = [
    {
        "id": "LR-10241",
        "patientName": "Aarav Sharma",
        "patientId": "P-2041",
        "patientAge": 34,
        "patientGender": "Male",
        "testName": "Complete Blood Count",
        "testType": "Hematology",
        "doctor": "Dr. Meera Iyer",
        "doctorSpecialty": "General Physician",
        "sampleDate": "2026-05-14",
        "reportDate": "2026-05-15",
        "status": "Completed",
        "notes": "All values within normal range.",
        "history": [
            { "date": "2026-05-14 09:12", "event": "Sample collected" },
            { "date": "2026-05-14 11:30", "event": "Sample received in lab" },
            { "date": "2026-05-15 08:45", "event": "Analysis completed" },
            { "date": "2026-05-15 10:20", "event": "Report verified & released" }
        ],
        "attachments": []
    },
    {
        "id": "LR-10242",
        "patientName": "Priya Nair",
        "patientId": "P-2042",
        "patientAge": 28,
        "patientGender": "Female",
        "testName": "Lipid Profile",
        "testType": "Biochemistry",
        "doctor": "Dr. Rohan Mehta",
        "doctorSpecialty": "Cardiologist",
        "sampleDate": "2026-05-15",
        "reportDate": "—",
        "status": "Pending",
        "history": [{ "date": "2026-05-15 08:00", "event": "Sample collected" }],
        "attachments": []
    },
    {
        "id": "LR-10243",
        "patientName": "Vikram Singh",
        "patientId": "P-2043",
        "patientAge": 45,
        "patientGender": "Male",
        "testName": "Thyroid Function (TSH, T3, T4)",
        "testType": "Endocrinology",
        "doctor": "Dr. Anjali Rao",
        "doctorSpecialty": "Endocrinologist",
        "sampleDate": "2026-05-15",
        "reportDate": "—",
        "status": "In Progress",
        "history": [
            { "date": "2026-05-15 07:40", "event": "Sample collected" },
            { "date": "2026-05-15 09:10", "event": "Analysis in progress" }
        ],
        "attachments": []
    },
    {
        "id": "LR-10244",
        "patientName": "Sneha Kapoor",
        "patientId": "P-2044",
        "patientAge": 31,
        "patientGender": "Female",
        "testName": "HbA1c",
        "testType": "Biochemistry",
        "doctor": "Dr. Karan Verma",
        "doctorSpecialty": "Diabetologist",
        "sampleDate": "2026-05-13",
        "reportDate": "2026-05-14",
        "status": "Completed",
        "notes": "Within target range.",
        "history": [
            { "date": "2026-05-13 10:00", "event": "Sample collected" },
            { "date": "2026-05-14 09:30", "event": "Report released" }
        ],
        "attachments": []
    }
]

# In-memory store fallback
IN_MEMORY_REPORTS = list(MOCK_REPORTS)

def seed_db_if_empty():
    try:
        if mongo.db.reports.count_documents({}) == 0:
            mongo.db.reports.insert_many(MOCK_REPORTS)
    except Exception:
        pass

@report_bp.route('', methods=['GET'])
@token_required
def get_reports(current_user):
    seed_db_if_empty()
    try:
        reports = list(mongo.db.reports.find({}, {'_id': 0}))
        if reports:
            return jsonify(reports), 200
    except Exception:
        pass
    return jsonify(IN_MEMORY_REPORTS), 200

@report_bp.route('/uploads/<filename>', methods=['GET'])
def get_uploaded_file(filename):
    return send_from_directory(UPLOADS_DIR, filename)

@report_bp.route('/upload', methods=['POST'])
@token_required
def upload_report(current_user):
    seed_db_if_empty()
    
    record_id = request.form.get('recordId')
    status = request.form.get('status', 'Completed')
    notes = request.form.get('notes', '')
    test_values = request.form.get('testValues', '')
    
    if not record_id:
        return jsonify({'success': False, 'message': 'Record ID is required'}), 400
        
    report = None
    try:
        report = mongo.db.reports.find_one({'id': record_id})
    except Exception:
        pass
        
    if not report:
        report = next((r for r in IN_MEMORY_REPORTS if r.get('id') == record_id), None)
        
    if not report:
        # Create a new record dynamically if it doesn't exist
        patient_name = request.form.get('patientName', 'Unknown Patient')
        patient_id = request.form.get('patientId', 'P-Unknown')
        test_name = request.form.get('testName', 'General Lab Test')
        test_type = request.form.get('testType', 'Biochemistry')
        doctor_name = request.form.get('doctor', 'Dr. General')
        doctor_spec = request.form.get('doctorSpecialty', 'General Physician')
        
        report = {
            'id': record_id,
            'patientName': patient_name,
            'patientId': patient_id,
            'patientAge': int(request.form.get('patientAge', 30)),
            'patientGender': request.form.get('patientGender', 'Female'),
            'testName': test_name,
            'testType': test_type,
            'doctor': doctor_name,
            'doctorSpecialty': doctor_spec,
            'sampleDate': datetime.date.today().isoformat(),
            'reportDate': '—',
            'status': status,
            'notes': notes,
            'testValues': test_values,
            'history': [{
                'date': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'),
                'event': 'Report record created'
            }],
            'attachments': []
        }
        try:
            mongo.db.reports.insert_one(dict(report))
        except Exception:
            IN_MEMORY_REPORTS.append(report)

    # Handle file upload
    attachments = []
    if 'file' in request.files:
        files = request.files.getlist('file')
        for file in files:
            if file and file.filename:
                orig_name = file.filename
                timestamp = int(datetime.datetime.now().timestamp())
                secure_name = f"{timestamp}_{secure_filename(orig_name)}"
                file_path = os.path.join(UPLOADS_DIR, secure_name)
                file.save(file_path)
                
                rel_path = f"/api/reports/uploads/{secure_name}"
                file_size = os.path.getsize(file_path)
                
                attachments.append({
                    'originalName': orig_name,
                    'filename': secure_name,
                    'path': rel_path,
                    'mimetype': file.mimetype or 'application/octet-stream',
                    'size': file_size,
                    'uploadedAt': datetime.datetime.now().isoformat()
                })

    # Update history events
    new_history = list(report.get('history', []))
    now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    new_history.append({
        'date': now_str,
        'event': f"Status changed to {status}"
    })
    for att in attachments:
        new_history.append({
            'date': now_str,
            'event': f"File attached: {att['originalName']}"
        })

    # Combine attachments
    old_attachments = report.get('attachments', [])
    updated_attachments = old_attachments + attachments

    update_payload = {
        'status': status,
        'notes': notes,
        'testValues': test_values,
        'reportDate': datetime.date.today().isoformat() if status == 'Completed' else '—',
        'attachments': updated_attachments,
        'history': new_history,
        'labAssistant': current_user.get('name', 'Lab Assistant')
    }

    try:
        mongo.db.reports.update_one(
            {'id': record_id},
            {'$set': update_payload}
        )
        updated_report = mongo.db.reports.find_one({'id': record_id}, {'_id': 0})
    except Exception:
        report.update(update_payload)
        updated_report = {k: v for k, v in report.items() if k != '_id'}

    return jsonify({
        'success': True,
        'message': 'Report saved and uploaded successfully',
        'report': updated_report
    }), 200
