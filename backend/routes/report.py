from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import random
import json

from backend.schemas import ReportRequest
from backend.database import get_db
from backend.models import (
    Prediction,
    User,
    Report,
    MedicalHistory
)

# Recommendation Module
from backend.recommendation import generate_recommendation

# PDF Generator
from backend.pdf_generator import generate_pdf

router = APIRouter()


@router.get("/")
def report_home():
    return {
        "message": "Health Report API"
    }


@router.post("/generate")
def generate_report(
    request: ReportRequest,
    db: Session = Depends(get_db)
):

    # =====================================================
    # Fetch Prediction
    # =====================================================

    prediction = db.query(Prediction).filter(
        Prediction.prediction_id == request.prediction_id
    ).first()

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found."
        )

    # =====================================================
    # Fetch Patient
    # =====================================================

    patient = db.query(User).filter(
        User.patient_id == prediction.patient_id
    ).first()

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # =====================================================
    # Fetch Recommendation
    # =====================================================

    recommendation = generate_recommendation(
        prediction.disease
    )

    # =====================================================
    # Check Existing Report
    # =====================================================

    existing_report = db.query(Report).filter(
        Report.prediction_id == prediction.prediction_id
    ).first()

    if existing_report:

        return {

            "message": "Report already exists.",

            "report": {

                "report_id": existing_report.report_id,
                "generated_date": existing_report.generated_date,
                "report_path": existing_report.report_path

            },

            "patient": {

                "patient_id": patient.patient_id,
                "patient_name": patient.full_name,
                "age": patient.age,
                "gender": patient.gender,
                "blood_group": patient.blood_group,
                "email": patient.email,
                "phone": patient.phone,
                "address": patient.address,
                "emergency_contact": patient.emergency_contact,
                "photo": patient.photo

            },

            "prediction": {

                "prediction_id": prediction.prediction_id,
                "symptoms": prediction.symptoms,
                "disease": prediction.disease,
                "confidence": prediction.confidence,
                "prediction_date": prediction.prediction_date

            },

            "risk": {

                "risk_score": prediction.risk_score,
                "risk_level": prediction.risk_level

            },

            "recommendation": recommendation

        }

    # =====================================================
    # Generate Unique Report ID
    # =====================================================

    while True:

        report_id = f"RPT{random.randint(100000,999999)}"

        exists = db.query(Report).filter(
            Report.report_id == report_id
        ).first()

        if not exists:
            break

    # =====================================================
    # Prepare Report Data
    # =====================================================

    report_data = {

        "report": {

            "report_id": report_id

        },

        "patient": {

            "patient_id": patient.patient_id,
            "patient_name": patient.full_name,
            "age": patient.age,
            "gender": patient.gender,
            "blood_group": patient.blood_group,
            "email": patient.email,
            "phone": patient.phone,
            "address": patient.address,
            "emergency_contact": patient.emergency_contact,
            "photo": patient.photo

        },

        "prediction": {

            "prediction_id": prediction.prediction_id,
            "symptoms": prediction.symptoms,
            "disease": prediction.disease,
            "confidence": prediction.confidence,
            "prediction_date": prediction.prediction_date

        },

        "risk": {

            "risk_score": prediction.risk_score,
            "risk_level": prediction.risk_level

        },

        "recommendation": recommendation

    }

    # =====================================================
    # Generate PDF
    # =====================================================

    pdf_path = generate_pdf(
        report_data=report_data,
        report_id=report_id
    )

    # =====================================================
    # Save Report
    # =====================================================

    new_report = Report(

        report_id=report_id,

        patient_id=patient.patient_id,

        prediction_id=prediction.prediction_id,

        report_path=pdf_path

    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # =====================================================
    # Generate History ID
    # =====================================================

    while True:

        history_id = f"HST{random.randint(100000,999999)}"

        exists = db.query(MedicalHistory).filter(
            MedicalHistory.history_id == history_id
        ).first()

        if not exists:
            break

    # =====================================================
    # Save Medical History
    # =====================================================

    new_history = MedicalHistory(

        history_id=history_id,

        patient_id=patient.patient_id,

        prediction_id=prediction.prediction_id,

        report_id=report_id,

        symptoms=prediction.symptoms,

        disease=prediction.disease,

        confidence=prediction.confidence,

        risk_score=prediction.risk_score,

        risk_level=prediction.risk_level,

        recommendation=json.dumps(recommendation),

        report_path=pdf_path

    )

    db.add(new_history)
    db.commit()

    # =====================================================
    # Update Response
    # =====================================================

    report_data["report"]["generated_date"] = new_report.generated_date

    report_data["report"]["report_path"] = pdf_path

    # =====================================================
    # Return Report
    # =====================================================

    return report_data