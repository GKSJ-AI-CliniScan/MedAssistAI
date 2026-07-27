import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False, unique=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    report_type = Column(String(100), default="Clinical AI Diagnostic Summary")
    size_kb = Column(Integer, default=240)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="reports")
    prediction = relationship("Prediction", back_populates="report")
