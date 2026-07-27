import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False, unique=True)
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String(50), default="Low")
    health_score = Column(Float, default=100.0)
    emergency_alert = Column(Boolean, default=False)
    message = Column(Text, nullable=True)
    factors_json = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    prediction = relationship("Prediction", back_populates="risk_assessment")
