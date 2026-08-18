from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_user
from app.schemas.history import SymptomCheckRequest, ConsultationResponse
from app.services.prediction_service import predict_diseases
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/check", response_model=ConsultationResponse, status_code=status.HTTP_201_CREATED)
async def check_symptoms(
    request: SymptomCheckRequest,
    current_user: dict = Depends(get_current_user)
):
    if not request.symptoms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one symptom must be selected"
        )
        
    db = get_database()
    
    # 1. Run baseline prediction service
    predicted_diseases, risk_level, risk_score, recommendations = await predict_diseases(request.symptoms)
    
    # 2. Save consultation record
    consultation_id = str(ObjectId())
    consultation_doc = {
        "_id": consultation_id,
        "patient_id": current_user["id"],
        "symptoms": request.symptoms,
        "predicted_diseases": predicted_diseases,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "recommendations": recommendations,
        "created_at": datetime.utcnow()
    }
    
    await db.consultations.insert_one(consultation_doc)
    
    # Map _id to id for serialization
    consultation_doc["id"] = consultation_doc["_id"]
    return consultation_doc

@router.get("", response_model=List[ConsultationResponse])
async def get_consultation_history(current_user: dict = Depends(get_current_user)):
    db = get_database()
    # Fetch consultations for current patient sorted by date descending
    cursor = db.consultations.find({"patient_id": current_user["id"]}).sort("created_at", -1)
    
    history = []
    async for doc in cursor:
        doc["id"] = doc["_id"]
        history.append(doc)
    return history

@router.get("/{id}", response_model=ConsultationResponse)
async def get_consultation(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    consultation = await db.consultations.find_one({"_id": id})
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation record not found"
        )
        
    # Security check: patients can only access their own history, doctors/admins can access all
    if current_user["role"] == "patient" and consultation["patient_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this consultation record"
        )
        
    consultation["id"] = consultation["_id"]
    return consultation
