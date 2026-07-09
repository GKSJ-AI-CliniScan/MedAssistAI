from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.schemas.appointment_schema import AppointmentCreate, AppointmentUpdate


def _is_admin(current_user: dict) -> bool:
    return current_user.get("role") == "admin"


def _owns_appointment(current_user: dict, appointment: Appointment) -> bool:
    role = current_user.get("role")
    uid = current_user.get("id")

    if role == "patient" and appointment.patient.user_id == uid:
        return True
    if role == "doctor" and appointment.doctor.user_id == uid:
        return True
    return False


def _get_appointment_or_404(db: Session, appointment_id: int) -> Appointment:
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


def create_appointment(db: Session, appointment: AppointmentCreate, current_user: dict):
    patient = db.query(Patient).filter(Patient.id == appointment.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    doctor = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Only admins can book on behalf of someone else; a patient may only
    # book for their own patient record.
    if not _is_admin(current_user):
        if current_user.get("role") != "patient" or patient.user_id != current_user.get("id"):
            raise HTTPException(
                status_code=403,
                detail="You can only book appointments for your own patient profile"
            )

    db_appointment = Appointment(**appointment.model_dump())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment


def get_appointment(db: Session, appointment_id: int, current_user: dict):
    appointment = _get_appointment_or_404(db, appointment_id)

    if _is_admin(current_user) or _owns_appointment(current_user, appointment):
        return appointment

    raise HTTPException(status_code=403, detail="Access denied")


def get_all_appointments(db: Session, skip: int, limit: int, current_user: dict):
    if not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")

    return db.query(Appointment).offset(skip).limit(limit).all()


def get_appointments_by_patient(db: Session, patient_id: int, current_user: dict):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if not _is_admin(current_user) and patient.user_id != current_user.get("id"):
        raise HTTPException(status_code=403, detail="Access denied")

    return db.query(Appointment).filter(Appointment.patient_id == patient_id).all()


def get_appointments_by_doctor(db: Session, doctor_id: int, current_user: dict):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    if not _is_admin(current_user) and doctor.user_id != current_user.get("id"):
        raise HTTPException(status_code=403, detail="Access denied")

    return db.query(Appointment).filter(Appointment.doctor_id == doctor_id).all()


def update_appointment(db: Session, appointment_id: int, appointment_update: AppointmentUpdate, current_user: dict):
    appointment = _get_appointment_or_404(db, appointment_id)

    if not _is_admin(current_user) and not _owns_appointment(current_user, appointment):
        raise HTTPException(status_code=403, detail="Access denied")

    for field, value in appointment_update.model_dump(exclude_unset=True).items():
        setattr(appointment, field, value)

    db.commit()
    db.refresh(appointment)
    return appointment


def delete_appointment(db: Session, appointment_id: int, current_user: dict):
    appointment = _get_appointment_or_404(db, appointment_id)

    if not _is_admin(current_user) and not _owns_appointment(current_user, appointment):
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(appointment)
    db.commit()
    return {"message": "Appointment deleted successfully"}
