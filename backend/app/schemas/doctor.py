from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict

class DoctorCreate(BaseModel):
    specialty: str
    experience: int
    phone: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    availability: Optional[Dict[str, List[str]]] = None

class DoctorUpdate(BaseModel):
    specialty: Optional[str] = None
    experience: Optional[int] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    availability: Optional[Dict[str, List[str]]] = None

class DoctorResponse(BaseModel):
    id: int
    user_id: int
    specialty: str
    experience: int
    phone: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    availability: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)
