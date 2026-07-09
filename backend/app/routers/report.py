from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.report_schema import ReportCreate, ReportUpdate, ReportResponse
from app.services.report_service import (
    create_report, get_report, get_all_reports,
    get_reports_by_patient, update_report, delete_report,
)
from app.utils.auth_handler import verify_token

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/", response_model=ReportResponse, status_code=201)
def add_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return create_report(db, report, current_user)


@router.get("/", response_model=List[ReportResponse])
def list_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_all_reports(db, skip, limit, current_user)


@router.get("/patient/{patient_id}", response_model=List[ReportResponse])
def list_reports_by_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_reports_by_patient(db, patient_id, current_user)


@router.get("/{report_id}", response_model=ReportResponse)
def get_report_by_id(
    report_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_report(db, report_id, current_user)


@router.put("/{report_id}", response_model=ReportResponse)
def edit_report(
    report_id: int,
    report_update: ReportUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return update_report(db, report_id, report_update, current_user)


@router.delete("/{report_id}", status_code=204)
def remove_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    delete_report(db, report_id, current_user)
    return Response(status_code=204)
