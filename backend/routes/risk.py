from fastapi import APIRouter
from sqlalchemy.orm import Session

from backend.schemas import RiskRequest
from backend.database import SessionLocal
from backend.models import Prediction
from backend.risk_assessment import calculate_final_risk_score

router = APIRouter()


@router.get("/")
def risk_home():
    return {
        "message": "Risk Assessment API"
    }


@router.post("/assess")
def assess_risk(request: RiskRequest):

    db: Session = SessionLocal()

    # Calculate Risk
    result = calculate_final_risk_score(
        disease=request.disease,
        symptoms=request.symptoms,
        age=request.age,
        history=request.history,
        lifestyle=request.lifestyle
    )

    # Find Prediction Record
    prediction = db.query(Prediction).filter(
        Prediction.prediction_id == request.prediction_id
    ).first()

    if prediction:

        prediction.risk_score = result["Total Risk Score"]
        prediction.risk_level = result["Risk Level"]

        db.commit()

    db.close()

    return result