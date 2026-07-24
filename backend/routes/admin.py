from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.database import get_db

from backend.models import (
    Admin,
    User,
    Prediction,
    Report,
    MedicalHistory
)

from backend.schemas import AdminLoginResponse

from backend.core.security import (
    verify_password,
    create_access_token
)

router = APIRouter()


# =====================================================
# Home
# =====================================================

@router.get("/")
def admin_home():

    return {
        "message": "Admin API"
    }


# =====================================================
# Admin Login
# =====================================================

@router.post(
    "/login",
    response_model=AdminLoginResponse
)
def admin_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    admin = db.query(Admin).filter(
        Admin.email == form_data.username
    ).first()

    if admin is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password."
        )

    if not verify_password(
        form_data.password,
        admin.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password."
        )

    access_token = create_access_token(
        data={
            "sub": admin.email
        }
    )

    return {

        "access_token": access_token,

        "token_type": "bearer",

        "admin_id": admin.admin_id,

        "full_name": admin.full_name,

        "role": admin.role

    }


# =====================================================
# View All Patients
# =====================================================

@router.get("/patients")
def get_all_patients(
    db: Session = Depends(get_db)
):

    patients = db.query(User).all()

    if not patients:

        return {

            "message": "No patients found.",

            "patients": []

        }

    patient_list = []

    for patient in patients:

        patient_list.append({

            "patient_id": patient.patient_id,

            "full_name": patient.full_name,

            "email": patient.email,

            "phone": patient.phone,

            "age": patient.age,

            "gender": patient.gender,

            "blood_group": patient.blood_group,

            "created_at": patient.created_at

        })

    return {

        "total_patients": len(patient_list),

        "patients": patient_list

    }


# =====================================================
# View Single Patient Details
# =====================================================

@router.get("/patient/{patient_id}")
def get_patient_details(
    patient_id: str,
    db: Session = Depends(get_db)
):

    # ---------------------------------------------
    # Find Patient
    # ---------------------------------------------

    patient = db.query(User).filter(
        User.patient_id == patient_id
    ).first()

    if patient is None:

        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # ---------------------------------------------
    # Statistics
    # ---------------------------------------------

    total_predictions = db.query(Prediction).filter(
        Prediction.patient_id == patient_id
    ).count()

    total_reports = db.query(Report).filter(
        Report.patient_id == patient_id
    ).count()

    total_history = db.query(MedicalHistory).filter(
        MedicalHistory.patient_id == patient_id
    ).count()

    high_risk_cases = db.query(MedicalHistory).filter(
        MedicalHistory.patient_id == patient_id,
        MedicalHistory.risk_level.in_(["HIGH", "CRITICAL"])
    ).count()

    # ---------------------------------------------
    # Latest Prediction
    # ---------------------------------------------

    latest_prediction = db.query(Prediction).filter(
        Prediction.patient_id == patient_id
    ).order_by(
        Prediction.prediction_date.desc()
    ).first()

    latest_prediction_data = None

    if latest_prediction:

        latest_prediction_data = {

            "prediction_id": latest_prediction.prediction_id,

            "disease": latest_prediction.disease,

            "confidence": latest_prediction.confidence,

            "risk_score": latest_prediction.risk_score,

            "risk_level": latest_prediction.risk_level,

            "prediction_date": latest_prediction.prediction_date

        }

    # ---------------------------------------------
    # Recent Reports
    # ---------------------------------------------

    reports = db.query(Report).filter(
        Report.patient_id == patient_id
    ).order_by(
        Report.generated_date.desc()
    ).limit(5).all()

    report_list = []

    for report in reports:

        report_list.append({

            "report_id": report.report_id,

            "prediction_id": report.prediction_id,

            "report_path": report.report_path,

            "generated_date": report.generated_date

        })

    # ---------------------------------------------
    # Medical History
    # ---------------------------------------------

    history = db.query(MedicalHistory).filter(
        MedicalHistory.patient_id == patient_id
    ).order_by(
        MedicalHistory.created_at.desc()
    ).limit(5).all()

    history_list = []

    for item in history:

        history_list.append({

            "history_id": item.history_id,

            "disease": item.disease,

            "confidence": item.confidence,

            "risk_score": item.risk_score,

            "risk_level": item.risk_level,

            "created_at": item.created_at

        })

    # ---------------------------------------------
    # Final Response
    # ---------------------------------------------

    return {

        "patient": {

            "patient_id": patient.patient_id,

            "full_name": patient.full_name,

            "email": patient.email,

            "phone": patient.phone,

            "age": patient.age,

            "gender": patient.gender,

            "blood_group": patient.blood_group,

            "address": patient.address,

            "emergency_contact": patient.emergency_contact,

            "photo": patient.photo,

            "created_at": patient.created_at

        },

        "statistics": {

            "total_predictions": total_predictions,

            "total_reports": total_reports,

            "medical_history_records": total_history,

            "high_risk_cases": high_risk_cases

        },

        "latest_prediction": latest_prediction_data,

        "recent_reports": report_list,

        "medical_history": history_list

    }
    
# =====================================================
# Search Patient Records
# =====================================================

@router.get("/search-patient")
def search_patient(
    query: str,
    db: Session = Depends(get_db)
):

    patients = db.query(User).filter(

        or_(

            User.patient_id.ilike(f"%{query}%"),

            User.full_name.ilike(f"%{query}%"),

            User.email.ilike(f"%{query}%")

        )

    ).all()

    if not patients:

        return {

            "message": "No matching patient found.",

            "total_results": 0,

            "patients": []

        }

    patient_list = []

    for patient in patients:

        patient_list.append({

            "patient_id": patient.patient_id,

            "full_name": patient.full_name,

            "email": patient.email,

            "phone": patient.phone,

            "age": patient.age,

            "gender": patient.gender,

            "blood_group": patient.blood_group,

            "created_at": patient.created_at

        })

    return {

        "total_results": len(patient_list),

        "patients": patient_list

    }
    
# =====================================================
# View All Reports
# =====================================================

@router.get("/reports")
def view_all_reports(
    db: Session = Depends(get_db)
):

    reports = db.query(Report).order_by(
        Report.generated_date.desc()
    ).all()

    if not reports:

        return {

            "message": "No reports found.",

            "total_reports": 0,

            "reports": []

        }

    report_list = []

    for report in reports:

        # ------------------------------------------
        # Patient Details
        # ------------------------------------------

        patient = db.query(User).filter(
            User.patient_id == report.patient_id
        ).first()

        # ------------------------------------------
        # Prediction Details
        # ------------------------------------------

        prediction = db.query(Prediction).filter(
            Prediction.prediction_id == report.prediction_id
        ).first()

        report_list.append({

            "report_id": report.report_id,

            "patient_id": report.patient_id,

            "patient_name": patient.full_name if patient else None,

            "prediction_id": report.prediction_id,

            "disease": prediction.disease if prediction else None,

            "confidence": prediction.confidence if prediction else None,

            "risk_score": prediction.risk_score if prediction else None,

            "risk_level": prediction.risk_level if prediction else None,

            "report_path": report.report_path,

            "generated_date": report.generated_date

        })

    return {

        "total_reports": len(report_list),

        "reports": report_list

    }
    
# =====================================================
# View High Risk Patients
# =====================================================

@router.get("/high-risk-patients")
def get_high_risk_patients(
    db: Session = Depends(get_db)
):

    predictions = db.query(Prediction).filter(
        Prediction.risk_level.in_(["HIGH", "CRITICAL"])
    ).order_by(
        Prediction.prediction_date.desc()
    ).all()

    if not predictions:

        return {

            "message": "No high risk patients found.",

            "total_high_risk_patients": 0,

            "patients": []

        }

    patient_list = []

    for prediction in predictions:

        patient = db.query(User).filter(
            User.patient_id == prediction.patient_id
        ).first()

        if patient:

            patient_list.append({

                "patient_id": patient.patient_id,

                "full_name": patient.full_name,

                "phone": patient.phone,

                "emergency_contact": patient.emergency_contact,

                "age": patient.age,

                "gender": patient.gender,

                "blood_group": patient.blood_group,

                "disease": prediction.disease,

                "confidence": prediction.confidence,

                "risk_score": prediction.risk_score,

                "risk_level": prediction.risk_level,

                "prediction_date": prediction.prediction_date

            })

    return {

        "total_high_risk_patients": len(patient_list),

        "patients": patient_list

    }
    
# =====================================================
# Dashboard Statistics
# =====================================================

@router.get("/dashboard-statistics")
def dashboard_statistics(
    db: Session = Depends(get_db)
):

    # ---------------------------------------------
    # Total Patients
    # ---------------------------------------------

    total_patients = db.query(User).count()

    # ---------------------------------------------
    # Total Predictions
    # ---------------------------------------------

    total_predictions = db.query(Prediction).count()

    # ---------------------------------------------
    # Total Reports
    # ---------------------------------------------

    total_reports = db.query(Report).count()

    # ---------------------------------------------
    # Total Medical History Records
    # ---------------------------------------------

    medical_history_records = db.query(
        MedicalHistory
    ).count()

    # ---------------------------------------------
    # High Risk Patients
    # ---------------------------------------------

    high_risk_patients = db.query(Prediction).filter(

        Prediction.risk_level == "HIGH"

    ).count()

    # ---------------------------------------------
    # Critical Patients
    # ---------------------------------------------

    critical_patients = db.query(Prediction).filter(

        Prediction.risk_level == "CRITICAL"

    ).count()

    # ---------------------------------------------
    # Final Response
    # ---------------------------------------------

    return {

        "total_patients": total_patients,

        "total_predictions": total_predictions,

        "total_reports": total_reports,

        "medical_history_records": medical_history_records,

        "high_risk_patients": high_risk_patients,

        "critical_patients": critical_patients

    }
# =====================================================
# Disease Distribution
# =====================================================

@router.get("/analytics/disease-distribution")
def disease_distribution(
    db: Session = Depends(get_db)
):

    predictions = db.query(Prediction).all()

    if not predictions:

        return {

            "message": "No prediction data available.",

            "total_diseases": 0,

            "distribution": []

        }

    disease_count = {}

    for prediction in predictions:

        disease = prediction.disease

        if disease in disease_count:

            disease_count[disease] += 1

        else:

            disease_count[disease] = 1

    distribution = []

    for disease, count in disease_count.items():

        distribution.append({

            "disease": disease,

            "count": count

        })

    distribution.sort(
        key=lambda x: x["count"],
        reverse=True
    )

    return {

        "total_diseases": len(distribution),

        "distribution": distribution

    }
    
# =====================================================
# Risk Level Distribution
# =====================================================

@router.get("/analytics/risk-distribution")
def risk_distribution(
    db: Session = Depends(get_db)
):

    predictions = db.query(Prediction).all()

    if not predictions:

        return {

            "message": "No prediction data available.",

            "distribution": []

        }

    risk_levels = {

        "LOW": 0,

        "MEDIUM": 0,

        "HIGH": 0,

        "CRITICAL": 0

    }

    for prediction in predictions:

        level = prediction.risk_level

        if level in risk_levels:

            risk_levels[level] += 1

    distribution = []

    for level, count in risk_levels.items():

        distribution.append({

            "risk_level": level,

            "count": count

        })

    return {

        "distribution": distribution

    }
    
# =====================================================
# Monthly Prediction Trend
# =====================================================

@router.get("/analytics/monthly-prediction-trend")
def monthly_prediction_trend(
    db: Session = Depends(get_db)
):

    predictions = db.query(Prediction).all()

    if not predictions:

        return {

            "message": "No prediction data available.",

            "trend": []

        }

    monthly_data = {}

    for prediction in predictions:

        month = prediction.prediction_date.strftime("%B %Y")

        if month in monthly_data:

            monthly_data[month] += 1

        else:

            monthly_data[month] = 1

    trend = []

    for month, count in monthly_data.items():

        trend.append({

            "month": month,

            "predictions": count

        })

    trend.sort(
        key=lambda x: x["month"]
    )

    return {

        "trend": trend

    }
    
# =====================================================
# Most Common Diseases
# =====================================================

@router.get("/analytics/most-common-diseases")
def most_common_diseases(
    db: Session = Depends(get_db)
):

    predictions = db.query(Prediction).all()

    if not predictions:

        return {

            "message": "No prediction data available.",

            "top_diseases": []

        }

    disease_count = {}

    for prediction in predictions:

        disease = prediction.disease

        disease_count[disease] = disease_count.get(disease, 0) + 1

    sorted_diseases = sorted(
        disease_count.items(),
        key=lambda x: x[1],
        reverse=True
    )

    top_diseases = []

    rank = 1

    for disease, count in sorted_diseases[:5]:

        top_diseases.append({

            "rank": rank,

            "disease": disease,

            "count": count

        })

        rank += 1

    return {

        "top_diseases": top_diseases

    }
    
# =====================================================
# Most Common Symptoms
# =====================================================

@router.get("/analytics/most-common-symptoms")
def most_common_symptoms(
    db: Session = Depends(get_db)
):

    predictions = db.query(Prediction).all()

    if not predictions:

        return {

            "message": "No prediction data available.",

            "top_symptoms": []

        }

    symptom_count = {}

    for prediction in predictions:

        if not prediction.symptoms:

            continue

        # Split comma-separated symptoms
        symptoms = prediction.symptoms.split(",")

        for symptom in symptoms:

            symptom = symptom.strip().lower()

            if symptom == "":

                continue

            if symptom in symptom_count:

                symptom_count[symptom] += 1

            else:

                symptom_count[symptom] = 1

    sorted_symptoms = sorted(

        symptom_count.items(),

        key=lambda x: x[1],

        reverse=True

    )

    top_symptoms = []

    rank = 1

    for symptom, count in sorted_symptoms[:10]:

        top_symptoms.append({

            "rank": rank,

            "symptom": symptom.title(),

            "count": count

        })

        rank += 1

    return {

        "total_unique_symptoms": len(symptom_count),

        "top_symptoms": top_symptoms

    }