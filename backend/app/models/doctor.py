from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    fullname = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    qualification = Column(String, nullable=True)
    license_number = Column(String, unique=True, nullable=True)
    phone_number = Column(String, nullable=True)
    years_of_experience = Column(Integer, default=0)
    consultation_fee = Column(Float, default=0.0)
    is_available = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="doctor_profile")
    appointments = relationship("Appointment", back_populates="doctor", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="doctor")
