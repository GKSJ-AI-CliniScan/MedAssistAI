"""
Reports Router – PDF generation and download
"""
import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.repositories import PatientRepository, PredictionRepository, ReportRepository
from app.services.report_generator import generate_pdf_report
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["Reports"])

REPORTS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "reports")


def _get_patient_or_404(user: User, db: Session):
    repo = PatientRepository(db)
    patient = repo.get_by_user_id(user.id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return patient


@router.post("/generate/{prediction_id}", response_model=dict, status_code=201)
def generate_report(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    pred_repo = PredictionRepository(db)
    report_repo = ReportRepository(db)

    prediction = pred_repo.get_by_id(prediction_id)
    if not prediction or prediction.patient_id != patient.id:
        raise HTTPException(status_code=404, detail="Prediction not found")

    # Check if report already exists
    existing = report_repo.get_by_prediction(prediction_id)
    if existing:
        return {
            "id": existing.id,
            "file_name": existing.file_name,
            "report_type": existing.report_type,
            "size_kb": existing.size_kb,
            "created_at": existing.created_at.isoformat(),
            "pdf_url": f"/api/reports/{existing.id}/download",
        }

    risk = pred_repo.get_risk_by_prediction(prediction_id)
    rec = pred_repo.get_recommendation_by_prediction(prediction_id)

    fpath = generate_pdf_report(
        prediction=prediction,
        patient=patient,
        user=current_user,
        risk=risk,
        recommendation=rec,
        output_dir=REPORTS_DIR,
    )

    fname = os.path.basename(fpath)
    report = report_repo.create(
        patient_id=patient.id,
        prediction_id=prediction_id,
        file_name=fname,
        file_path=fpath,
    )
    return {
        "id": report.id,
        "file_name": report.file_name,
        "report_type": report.report_type,
        "size_kb": report.size_kb,
        "created_at": report.created_at.isoformat(),
        "pdf_url": f"/api/reports/{report.id}/download",
    }


@router.get("/", response_model=List[dict])
def list_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    report_repo = ReportRepository(db)
    reports = report_repo.get_by_patient(patient.id)
    return [
        {
            "id": r.id,
            "file_name": r.file_name,
            "report_type": r.report_type,
            "size_kb": r.size_kb,
            "created_at": r.created_at.isoformat(),
            "pdf_url": f"/api/reports/{r.id}/download",
        }
        for r in reports
    ]


@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    report_repo = ReportRepository(db)
    report = report_repo.get_by_id(report_id)
    if not report or report.patient_id != patient.id:
        raise HTTPException(status_code=404, detail="Report not found")
    if not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Report file not found on server")
    return FileResponse(
        path=report.file_path,
        filename=report.file_name,
        media_type="application/pdf",
    )
