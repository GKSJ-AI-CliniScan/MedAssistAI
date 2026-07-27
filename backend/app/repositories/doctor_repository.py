from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.doctor import Doctor

class DoctorRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, doctor_id: int) -> Optional[Doctor]:
        return self.db.query(Doctor).filter(Doctor.id == doctor_id).first()

    def get_by_user_id(self, user_id: int) -> Optional[Doctor]:
        return self.db.query(Doctor).filter(Doctor.user_id == user_id).first()

    def list_all(self, specialty: Optional[str] = None, search: Optional[str] = None) -> List[Doctor]:
        query = self.db.query(Doctor)
        if specialty:
            query = query.filter(Doctor.specialty.ilike(f"%{specialty}%"))
        if search:
            # We can join with User model if needed, but since Doctor is a standalone query here:
            from app.models.user import User
            query = query.join(User).filter(User.full_name.ilike(f"%{search}%"))
        return query.all()

    def create(self, user_id: int, specialty: str, experience: int, phone: Optional[str] = None, address: Optional[str] = None, bio: Optional[str] = None, availability: Optional[dict] = None) -> Doctor:
        doctor = Doctor(
            user_id=user_id,
            specialty=specialty,
            experience=experience,
            phone=phone,
            address=address,
            bio=bio
        )
        if availability:
            doctor.availability = availability
        self.db.add(doctor)
        self.db.commit()
        self.db.refresh(doctor)
        return doctor

    def update(self, doctor: Doctor, data: dict) -> Doctor:
        for key, val in data.items():
            setattr(doctor, key, val)
        self.db.commit()
        self.db.refresh(doctor)
        return doctor

    def delete(self, doctor_id: int) -> bool:
        doctor = self.get_by_id(doctor_id)
        if doctor:
            self.db.delete(doctor)
            self.db.commit()
            return True
        return False
