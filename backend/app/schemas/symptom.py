from pydantic import BaseModel
from typing import Optional

class SymptomResponse(BaseModel):
    key: str
    display_name: str
    category: Optional[str] = "General"

    class Config:
        from_attributes = True
