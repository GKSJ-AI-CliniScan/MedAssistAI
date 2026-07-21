from fastapi import APIRouter, Depends
from app.core.database import get_database
from app.core.security import get_current_user
from app.schemas.symptom import SymptomResponse
from typing import List

router = APIRouter()

@router.get("", response_model=List[SymptomResponse])
async def get_symptoms(current_user: dict = Depends(get_current_user)):
    db = get_database()
    # Find all symptoms sorted alphabetically by display_name
    cursor = db.symptoms.find().sort("display_name", 1)
    symptoms = []
    async for doc in cursor:
        symptoms.append(doc)
    return symptoms
