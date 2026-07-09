from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Patient(Base):
    __tablename__ = "patients"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True
    )
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(20), nullable=True)
    phone_number = Column(String(15), unique=True, nullable=True)
    blood_group = Column(String(5), nullable=True)
    address = Column(Text, nullable=True)
    emergency_contact = Column(String(15), nullable=True)
    medical_history = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)

    
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships
    user = relationship(
        "User",
        back_populates="patient"
    )

    appointments = relationship(
        "Appointment",
        back_populates="patient",
        cascade="all, delete-orphan"
    )

    reports = relationship(
        "Report",
        back_populates="patient",
        cascade="all, delete-orphan"
    )

    symptoms = relationship("Symptom", back_populates="patient")