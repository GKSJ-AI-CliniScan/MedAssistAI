from fastapi import APIRouter, Depends
from app.core.database import get_database
from app.core.security import get_current_user
from app.schemas.symptom import SymptomResponse
from typing import List

router = APIRouter()


# Get all symptoms
@router.get("", response_model=List[SymptomResponse])
async def get_symptoms(current_user: dict = Depends(get_current_user)):
    db = get_database()

    cursor = db.symptoms.find().sort("display_name", 1)

    symptoms = []
    async for doc in cursor:
        symptoms.append(doc)

    return symptoms


# Search symptoms
@router.get("/search", response_model=List[SymptomResponse])
async def search_symptoms(
    q: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()

    cursor = db.symptoms.find({
        "$or": [
            {
                "display_name": {
                    "$regex": q,
                    "$options": "i"
                }
            },
            {
                "key": {
                    "$regex": q,
                    "$options": "i"
                }
            }
        ]
    }).sort("display_name", 1)

    symptoms = []

    async for doc in cursor:
        symptoms.append(doc)

    return symptoms


# Categories
@router.get("/categories")
async def categories():
    return [
    "General",
    "Cardiology",
    "Pulmonology",
    "Dermatology",
    "Gastroenterology",
    "ENT",
    "Pain & Discomfort",
    "Mental Health",
    "Gynecology",
    "Musculoskeletal",
    "Ophthalmology",
    "Urology"
]