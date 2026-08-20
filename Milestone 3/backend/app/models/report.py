from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    predicted_disease = Column(String, nullable=False)
    confidence = Column(Float, nullable=True)
    risk_level = Column(String, nullable=False)
    severity_level = Column(String, nullable=False)
    severity_score = Column(Integer, default=0)
    emergency = Column(Boolean, default=False)
    symptoms_submitted = Column(Text, nullable=False)  # Comma-separated or JSON list of symptoms
    recommendations = Column(Text, nullable=True)
    doctor_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="reports")
