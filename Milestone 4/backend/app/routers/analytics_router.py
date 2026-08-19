from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.services.analytics_service import (
    get_system_analytics_summary,
    get_disease_distribution_stats,
)
from app.utils.role_checker import require_roles

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics & Monitoring"],
)


@router.get(
    "/summary",
    summary="Get system overview analytics metrics (Admin, Doctor, or Patient)",
)
def get_analytics_summary(
    current_user: User = Depends(require_roles("admin", "doctor", "patient")),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return get_system_analytics_summary(db)


@router.get(
    "/diseases",
    summary="Get top predicted diseases distribution (Admin, Doctor, or Patient)",
)
def get_disease_analytics(
    current_user: User = Depends(require_roles("admin", "doctor", "patient")),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return get_disease_distribution_stats(db)
