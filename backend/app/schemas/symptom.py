from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class SymptomResponse(BaseModel):
    id: int
    code: str
    name: str
    body_part: str
    severity: str
    synonyms: List[str]

    model_config = ConfigDict(from_attributes=True)

class SymptomSearchQuery(BaseModel):
    query: Optional[str] = None
    body_part: Optional[str] = None
