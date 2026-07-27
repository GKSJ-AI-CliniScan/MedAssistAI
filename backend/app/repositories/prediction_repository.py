import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.prediction import Prediction
from app.models.risk_assessment import RiskAssessment
from app.models.recommendation import Recommendation

class PredictionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, patient_id: int, symptoms: list, severity: str, duration: int, notes: str,
               predicted_diseases: list, top_disease: str, top_confidence: float) -> Prediction:
        prediction = Prediction(
            patient_id=patient_id,
            symptoms_input=symptoms,
            severity_input=severity,
            duration_input=duration,
            notes_input=notes,
            predicted_diseases=predicted_diseases,
            top_disease=top_disease,
            top_confidence=top_confidence,
        )
        self.db.add(prediction)
        self.db.commit()
        self.db.refresh(prediction)
        return prediction

    def get_by_id(self, prediction_id: int) -> Optional[Prediction]:
        return self.db.query(Prediction).filter(Prediction.id == prediction_id).first()

    def get_by_patient(self, patient_id: int, limit: int = 20) -> List[Prediction]:
        return (
            self.db.query(Prediction)
            .filter(Prediction.patient_id == patient_id)
            .order_by(Prediction.created_at.desc())
            .limit(limit)
            .all()
        )

    def count(self) -> int:
        return self.db.query(Prediction).count()

    def count_today(self) -> int:
        today = datetime.date.today()
        return (
            self.db.query(Prediction)
            .filter(Prediction.created_at >= today)
            .count()
        )

    def save_risk_assessment(self, prediction_id: int, risk_data: dict) -> RiskAssessment:
        risk = RiskAssessment(prediction_id=prediction_id, **risk_data)
        self.db.add(risk)
        self.db.commit()
        self.db.refresh(risk)
        return risk

    def save_recommendation(self, prediction_id: int, rec_data: dict) -> Recommendation:
        rec = Recommendation(prediction_id=prediction_id, **rec_data)
        self.db.add(rec)
        self.db.commit()
        self.db.refresh(rec)
        return rec

    def get_risk_by_prediction(self, prediction_id: int) -> Optional[RiskAssessment]:
        return self.db.query(RiskAssessment).filter(RiskAssessment.prediction_id == prediction_id).first()

    def get_recommendation_by_prediction(self, prediction_id: int) -> Optional[Recommendation]:
        return self.db.query(Recommendation).filter(Recommendation.prediction_id == prediction_id).first()
