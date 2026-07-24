from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Float
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy.sql import func

from backend.database import Base


# ==========================================
# Users Table
# ==========================================

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        String(20),
        unique=True,
        nullable=False
    )

    full_name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    phone = Column(
        String(15),
        unique=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    age = Column(
        Integer,
        nullable=False
    )

    gender = Column(
        String(20),
        nullable=False
    )

    blood_group = Column(
        String(10),
        nullable=True
    )

    photo = Column(
        String(255),
        nullable=True
    )

    address = Column(
        String(255),
        nullable=True
    )

    emergency_contact = Column(
        String(15),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ==========================================
# Predictions Table
# ==========================================

class Prediction(Base):

    __tablename__ = "predictions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    prediction_id = Column(
        String(20),
        unique=True,
        nullable=False
    )

    patient_id = Column(
        String(20),
        ForeignKey("users.patient_id"),
        nullable=False
    )

    symptoms = Column(
        Text,
        nullable=False
    )

    disease = Column(
        String(100),
        nullable=False
    )

    confidence = Column(
        Float,
        nullable=False
    )

    risk_score = Column(
        Integer,
        nullable=True
    )

    risk_level = Column(
        String(20),
        nullable=True
    )

    prediction_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ==========================================
# Medical History Table
# ==========================================

class MedicalHistory(Base):

    __tablename__ = "medical_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    history_id = Column(
        String(20),
        unique=True,
        nullable=False
    )

    patient_id = Column(
        String(20),
        ForeignKey("users.patient_id"),
        nullable=False
    )

    prediction_id = Column(
        String(20),
        ForeignKey("predictions.prediction_id"),
        nullable=False
    )

    report_id = Column(
        String(20),
        nullable=True
    )

    symptoms = Column(
        Text,
        nullable=False
    )

    disease = Column(
        String(100),
        nullable=False
    )

    confidence = Column(
        Float,
        nullable=False
    )

    risk_score = Column(
        Integer,
        nullable=False
    )

    risk_level = Column(
        String(20),
        nullable=False
    )

    report_path = Column(
        String(255),
        nullable=True
    )

    recommendation = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ==========================================
# Reports Table
# ==========================================

class Report(Base):

    __tablename__ = "reports"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    report_id = Column(
        String(20),
        unique=True,
        nullable=False
    )

    patient_id = Column(
        String(20),
        ForeignKey("users.patient_id"),
        nullable=False
    )

    prediction_id = Column(
        String(20),
        ForeignKey("predictions.prediction_id"),
        nullable=False
    )

    report_path = Column(
        String(255),
        nullable=True
    )

    generated_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ==========================================
# Admin Table
# ==========================================

class Admin(Base):

    __tablename__ = "admins"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    admin_id = Column(
        String(20),
        unique=True,
        nullable=False
    )

    full_name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(50),
        nullable=False,
        default="ADMIN"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )