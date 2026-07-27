import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    age = Column(Integer, default=25)
    gender = Column(String(20), default="Not specified")
    blood_type = Column(String(10), default="Unknown")
    height = Column(String(20), default="170 cm")
    weight = Column(String(20), default="70 kg")
    bmi = Column(Float, default=24.2)
    smoking = Column(String(20), default="Non-smoker")
    alcohol = Column(String(20), default="Non-drinker")
    bp_systolic = Column(Integer, default=120)
    bp_diastolic = Column(Integer, default=80)
    fasting_sugar = Column(Integer, default=90)
    emergency_contact = Column(JSON, default=dict)
    allergies = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="patient")
    medical_histories = relationship("MedicalHistory", back_populates="patient", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="patient", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="patient", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")
