from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.models.medical_history import MedicalHistory

class PatientRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: int) -> Optional[Patient]:
        return self.db.query(Patient).filter(Patient.user_id == user_id).first()

    def get_by_id(self, patient_id: int) -> Optional[Patient]:
        return self.db.query(Patient).filter(Patient.id == patient_id).first()

    def create(self, user_id: int) -> Patient:
        patient = Patient(user_id=user_id)
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient

    def update(self, patient: Patient, data: dict) -> Patient:
        for key, value in data.items():
            if value is not None:
                setattr(patient, key, value)
        self.db.commit()
        self.db.refresh(patient)
        return patient

    def count(self) -> int:
        return self.db.query(Patient).count()

    # Medical History helpers
    def get_medical_histories(self, patient_id: int) -> List[MedicalHistory]:
        return self.db.query(MedicalHistory).filter(MedicalHistory.patient_id == patient_id).all()

    def add_medical_history(self, patient_id: int, data: dict) -> MedicalHistory:
        history = MedicalHistory(patient_id=patient_id, **data)
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history

    def delete_medical_history(self, history_id: int, patient_id: int) -> bool:
        history = self.db.query(MedicalHistory).filter(
            MedicalHistory.id == history_id,
            MedicalHistory.patient_id == patient_id
        ).first()
        if history:
            self.db.delete(history)
            self.db.commit()
            return True
        return False
