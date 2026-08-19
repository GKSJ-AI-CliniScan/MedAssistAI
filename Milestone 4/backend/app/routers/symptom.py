from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.symptom_schema import SymptomCreate, SymptomResponse
from app.services.symptom_service import get_all_symptoms, create_symptom
from app.utils.auth_handler import get_current_user
from app.utils.role_checker import require_role

router = APIRouter(
    prefix="/symptoms",
    tags=["Symptom Dictionary"],
)


@router.get(
    "",
    response_model=List[SymptomResponse],
    summary="Get list of all supported symptoms",
)
def list_symptoms(
    skip: int = 0,
    limit: int = 500,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_all_symptoms(db, skip=skip, limit=limit)


@router.post(
    "",
    response_model=SymptomResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new symptom to the dictionary (Admin only)",
)
def add_symptom(
    data: SymptomCreate,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return create_symptom(db, data)
