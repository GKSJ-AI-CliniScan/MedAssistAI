from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.appointment import Appointment

class AppointmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, appointment_id: int) -> Optional[Appointment]:
        return self.db.query(Appointment).filter(Appointment.id == appointment_id).first()

    def get_by_patient(self, patient_id: int) -> List[Appointment]:
        return self.db.query(Appointment).filter(Appointment.patient_id == patient_id).all()

    def get_by_doctor(self, doctor_id: int) -> List[Appointment]:
        return self.db.query(Appointment).filter(Appointment.doctor_id == doctor_id).all()

    def list_all(self) -> List[Appointment]:
        return self.db.query(Appointment).all()

    def create(self, patient_id: int, doctor_id: Optional[int], doctor_name: str, doctor_specialty: str, date_time: str, priority: str = "normal", status: str = "confirmed") -> Appointment:
        appointment = Appointment(
            patient_id=patient_id,
            doctor_id=doctor_id,
            doctor_name=doctor_name,
            doctor_specialty=doctor_specialty,
            date_time=date_time,
            priority=priority,
            status=status
        )
        self.db.add(appointment)
        self.db.commit()
        self.db.refresh(appointment)
        return appointment

    def update(self, appointment: Appointment, data: dict) -> Appointment:
        for key, val in data.items():
            setattr(appointment, key, val)
        self.db.commit()
        self.db.refresh(appointment)
        return appointment

    def delete(self, appointment_id: int) -> bool:
        appointment = self.get_by_id(appointment_id)
        if appointment:
            self.db.delete(appointment)
            self.db.commit()
            return True
        return False
