from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database.database import Base


class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True, default="General")
    severity_weight = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
