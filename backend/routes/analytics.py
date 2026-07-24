from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database import get_db
from backend.models import User, Prediction, Report
from collections import Counter

router = APIRouter()


# =====================================================
# Home
# =====================================================

@router.get("/")
def analytics_home():

    return {
        "message": "Analytics API"
    }


# =====================================================
# Dashboard Summary
# =====================================================

@router.get("/dashboard/{patient_id}")
def dashboard_summary(
    patient_id: str,
    db: Session = Depends(get_db)
):

    # ==========================================
    # Total Predictions
    # ==========================================

    total_predictions = db.query(Prediction).filter(
        Prediction.patient_id == patient_id
    ).count()

    # ==========================================
    # Total Reports
    # ==========================================

    total_reports = db.query(Report).filter(
        Report.patient_id == patient_id
    ).count()

    # ==========================================
    # Latest Prediction
    # ==========================================

    latest_prediction = db.query(Prediction).filter(
        Prediction.patient_id == patient_id
    ).order_by(
        Prediction.prediction_date.desc()
    ).first()

    # ==========================================
    # High Risk Alerts
    # ==========================================

    high_risk_alerts = db.query(Prediction).filter(
        Prediction.patient_id == patient_id,
        Prediction.risk_level.in_(["HIGH", "CRITICAL"])
    ).count()

    # ==========================================
    # Average Confidence
    # ==========================================

    average_confidence = db.query(
        func.avg(Prediction.confidence)
    ).filter(
        Prediction.patient_id == patient_id
    ).scalar()

    if average_confidence is None:
        average_confidence = 0

    # ==========================================
    # No Predictions
    # ==========================================

    if total_predictions == 0:

        raise HTTPException(
            status_code=404,
            detail="No prediction history found."
        )

    # ==========================================
    # Response
    # ==========================================

    return {

        "patient_id": patient_id,

        "total_predictions": total_predictions,

        "total_reports": total_reports,

        "latest_prediction": latest_prediction.disease,

        "latest_prediction_date": latest_prediction.prediction_date,

        "high_risk_alerts": high_risk_alerts,

        "average_confidence": round(
            average_confidence,
            2
        )

    }
# =====================================================
# Disease Distribution
# =====================================================

from sqlalchemy import func


@router.get("/disease-distribution/{patient_id}")
def disease_distribution(
    patient_id: str,
    db: Session = Depends(get_db)
):

    result = (
        db.query(
            Prediction.disease,
            func.count(Prediction.disease).label("count")
        )
        .filter(Prediction.patient_id == patient_id)
        .group_by(Prediction.disease)
        .all()
    )

    return [
        {
            "disease": row.disease,
            "count": row.count
        }
        for row in result
    ]
# =====================================================
# Risk Distribution
# =====================================================

@router.get("/risk-distribution/{patient_id}")
def risk_distribution(
    patient_id: str,
    db: Session = Depends(get_db)
):

    result = (
        db.query(
            Prediction.risk_level,
            func.count(Prediction.risk_level).label("count")
        )
        .filter(Prediction.patient_id == patient_id)
        .group_by(Prediction.risk_level)
        .all()
    )

    return [
        {
            "risk_level": row.risk_level,
            "count": row.count
        }
        for row in result
    ]
# =====================================================
# Monthly Prediction Trend
# =====================================================

@router.get("/monthly-trend/{patient_id}")
def monthly_prediction_trend(
    patient_id: str,
    db: Session = Depends(get_db)
):

    patient = db.query(User).filter(
        User.patient_id == patient_id
    ).first()

    if patient is None:

        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    monthly_data = (

        db.query(

            func.to_char(
                Prediction.prediction_date,
                "YYYY-MM"
            ).label("month"),

            func.count(
                Prediction.prediction_id
            ).label("predictions")

        )

        .filter(
            Prediction.patient_id == patient_id
        )

        .group_by("month")

        .order_by("month")

        .all()

    )

    return [

        {
            "month": row.month,
            "predictions": row.predictions
        }

        for row in monthly_data

    ]
# =====================================================
# Most Common Symptoms
# =====================================================

@router.get("/common-symptoms/{patient_id}")
def common_symptoms(
    patient_id: str,
    db: Session = Depends(get_db)
):

    # Check patient exists
    patient = db.query(User).filter(
        User.patient_id == patient_id
    ).first()

    if patient is None:

        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # Fetch all symptoms
    predictions = db.query(
        Prediction.symptoms
    ).filter(
        Prediction.patient_id == patient_id
    ).all()

    symptom_counter = Counter()

    for row in predictions:

        if row.symptoms:

            symptoms = row.symptoms.split(",")

            symptoms = [
                symptom.strip().lower()
                for symptom in symptoms
            ]

            symptom_counter.update(symptoms)

    return [

        {
            "symptom": symptom,
            "count": count
        }

        for symptom, count in symptom_counter.most_common()

    ]
# =====================================================
# Prediction Accuracy
# =====================================================

@router.get("/prediction-accuracy/{patient_id}")
def prediction_accuracy(
    patient_id: str,
    db: Session = Depends(get_db)
):

    # Check patient exists
    patient = db.query(User).filter(
        User.patient_id == patient_id
    ).first()

    if patient is None:

        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    predictions = db.query(Prediction).filter(
        Prediction.patient_id == patient_id
    ).all()

    if len(predictions) == 0:

        return {

            "patient_id": patient_id,

            "total_predictions": 0,

            "average_confidence": 0,

            "highest_confidence": 0,

            "lowest_confidence": 0

        }

    confidences = [

        prediction.confidence

        for prediction in predictions

    ]

    return {

        "patient_id": patient_id,

        "total_predictions": len(predictions),

        "average_confidence": round(
            sum(confidences) / len(confidences),
            2
        ),

        "highest_confidence": round(
            max(confidences),
            2
        ),

        "lowest_confidence": round(
            min(confidences),
            2
        )

    }