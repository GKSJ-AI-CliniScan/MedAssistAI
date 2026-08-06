from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class SymptomCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = "General"
    severity_weight: Optional[int] = 1


class SymptomResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    severity_weight: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
