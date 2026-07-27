import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    specialty = Column(String(100), nullable=False, default="General Physician")
    experience = Column(Integer, default=5)
    phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    bio = Column(String(1000), nullable=True)
    availability = Column(JSON, default=lambda: {
        "Monday": ["09:00-13:00", "14:00-17:00"],
        "Tuesday": ["09:00-13:00", "14:00-17:00"],
        "Wednesday": ["09:00-13:00", "14:00-17:00"],
        "Thursday": ["09:00-13:00", "14:00-17:00"],
        "Friday": ["09:00-13:00", "14:00-17:00"]
    })
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor", cascade="all, delete-orphan")
