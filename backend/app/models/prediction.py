import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    symptoms_input = Column(JSON, default=list)
    severity_input = Column(String(50), default="mild")
    duration_input = Column(Integer, default=3)
    notes_input = Column(String(500), nullable=True)
    predicted_diseases = Column(JSON, default=list)
    top_disease = Column(String(255), nullable=True)
    top_confidence = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="predictions")
    risk_assessment = relationship("RiskAssessment", back_populates="prediction", uselist=False, cascade="all, delete-orphan")
    recommendation = relationship("Recommendation", back_populates="prediction", uselist=False, cascade="all, delete-orphan")
    report = relationship("Report", back_populates="prediction", uselist=False, cascade="all, delete-orphan")
