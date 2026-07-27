import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False, unique=True)
    lifestyle = Column(Text, nullable=True)
    diet = Column(Text, nullable=True)
    exercise = Column(Text, nullable=True)
    water_intake = Column(String(255), nullable=True)
    sleep = Column(String(255), nullable=True)
    follow_up = Column(Text, nullable=True)
    doctor = Column(String(100), default="General Practitioner")
    medicines = Column(JSON, default=list)
    disclaimer = Column(Text, default="For educational & preliminary screening purposes only. Consult a licensed physician for diagnosis.")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    prediction = relationship("Prediction", back_populates="recommendation")
