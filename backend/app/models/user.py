import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    first_name = Column(String(128), nullable=True)
    last_name = Column(String(128), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    hashed_password = Column(String(512), nullable=False)
    role = Column(String(50), default="patient")  # patient | doctor | admin
    is_active = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    reset_token = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    google_id = Column(String(255), nullable=True, index=True)
    microsoft_id = Column(String(255), nullable=True, index=True)
    login_provider = Column(String(50), default="email")  # email | google | microsoft
    last_login_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="user", uselist=False, cascade="all, delete-orphan")
    doctor = relationship("Doctor", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")
