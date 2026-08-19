from typing import List
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.report_schema import ReportResponse, ReportUpdate
from app.services.report_service import (
    get_patient_reports,
    get_reports_by_patient_id,
    get_report_by_id,
    update_report_notes,
    generate_printable_report_text,
)
from app.utils.auth_handler import get_current_user
from app.utils.role_checker import require_role, require_roles

router = APIRouter(
    prefix="/reports",
    tags=["Health Reports"],
)


@router.get(
    "/my",
    response_model=List[ReportResponse],
    summary="Get all reports for current logged-in patient",
)
def get_my_reports(
    current_user: User = Depends(require_role("patient")),
    db: Session = Depends(get_db),
):
    return get_patient_reports(db, current_user)


@router.get(
    "/patient/{patient_id}",
    response_model=List[ReportResponse],
    summary="Get reports for a specific patient (Doctor, Admin, or Patient)",
)
def get_reports_for_patient(
    patient_id: int,
    current_user: User = Depends(require_roles("doctor", "admin", "patient")),
    db: Session = Depends(get_db),
):
    return get_reports_by_patient_id(db, patient_id)


@router.get(
    "/{id}",
    response_model=ReportResponse,
    summary="Get detailed medical report by ID",
)
def get_report(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_report_by_id(db, id)


@router.put(
    "/{id}/notes",
    response_model=ReportResponse,
    summary="Update doctor notes and medical recommendations on report (Doctor, Admin, or Patient)",
)
def update_notes(
    id: int,
    data: ReportUpdate,
    current_user: User = Depends(require_roles("doctor", "admin", "patient")),
    db: Session = Depends(get_db),
):
    return update_report_notes(db, id, current_user, data)


@router.get(
    "/{id}/download",
    summary="Download printable formatted medical report file (.txt)",
)
def download_report(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = get_report_by_id(db, id)
    report_text = generate_printable_report_text(report)

    filename = f"MedAssistAI_Report_{report.id}.txt"
    return Response(
        content=report_text,
        media_type="text/plain",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
