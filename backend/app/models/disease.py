from sqlalchemy import Column, Integer, String, Text, JSON
from app.core.database import Base

class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), index=True, nullable=False)
    risk_level = Column(String(50), default="Medium")
    description = Column(Text, nullable=True)
    symptoms = Column(JSON, default=list)
    causes = Column(JSON, default=list)
    complications = Column(JSON, default=list)
    suggested_tests = Column(JSON, default=list)
    specialist = Column(String(100), default="General Practitioner")
