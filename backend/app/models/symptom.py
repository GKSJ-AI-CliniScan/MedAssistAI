from sqlalchemy import Column, Integer, String, JSON
from app.core.database import Base

class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), index=True, nullable=False)
    body_part = Column(String(100), index=True, default="General")
    severity = Column(String(50), default="medium")
    synonyms = Column(JSON, default=list)
