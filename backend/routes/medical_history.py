from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import MedicalHistory

router = APIRouter()


# =====================================================
# Home
# =====================================================

@router.get("/")
def medical_history_home():

    return {
        "message": "Medical History API"
    }


# =====================================================
# Get Complete Medical History of a Patient
# =====================================================

@router.get("/{patient_id}")
def get_medical_history(
    patient_id: str,
    db: Session = Depends(get_db)
):

    history = db.query(MedicalHistory).filter(
        MedicalHistory.patient_id == patient_id
    ).order_by(
        MedicalHistory.created_at.desc()
    ).all()

    if not history:

        raise HTTPException(
            status_code=404,
            detail="No medical history found."
        )

    response = []

    for record in history:

        response.append({

            "history_id": record.history_id,

            "patient_id": record.patient_id,

            "prediction_id": record.prediction_id,

            "report_id": record.report_id,

            "report_path": record.report_path,

            "symptoms": record.symptoms,

            "disease": record.disease,

            "confidence": record.confidence,

            "risk_score": record.risk_score,

            "risk_level": record.risk_level,

            "recommendation": record.recommendation,

            "date": record.created_at

        })

    return response