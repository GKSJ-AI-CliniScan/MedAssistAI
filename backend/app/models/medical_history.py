import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class MedicalHistory(Base):
    __tablename__ = "medical_histories"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    condition = Column(String(255), nullable=False)
    diagnosed_year = Column(Integer, nullable=False)
    category = Column(String(100), default="Condition")
    status = Column(String(50), default="Active")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="medical_histories")
