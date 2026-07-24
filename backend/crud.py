from datetime import datetime

from sqlalchemy.orm import Session

from backend import models


# ==========================================
# Generate Prediction ID
# ==========================================

def generate_prediction_id():

    return "PRD" + datetime.now().strftime("%H%M%S")


# ==========================================
# Save Prediction
# ==========================================

def save_prediction(
    db: Session,
    patient_id: str,
    symptoms: list,
    disease: str,
    confidence: float
):

    prediction = models.Prediction(

        prediction_id=generate_prediction_id(),

        patient_id=patient_id,

        symptoms=", ".join(symptoms),

        disease=disease,

        confidence=confidence,

        risk_score=None,

        risk_level=None
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction