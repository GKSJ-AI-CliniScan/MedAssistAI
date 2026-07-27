"""
Symptom Router – Search and list symptoms
"""
from typing import List, Optional
from fastapi import APIRouter, Query
from app.ml.predictor import ALL_SYMPTOMS

router = APIRouter(prefix="/symptoms", tags=["Symptoms"])


@router.get("/", response_model=List[dict])
def list_symptoms(
    q: Optional[str] = Query(None, description="Search by symptom name"),
    body_part: Optional[str] = Query(None, description="Filter by body part"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
):
    results = ALL_SYMPTOMS
    if q:
        q_lower = q.lower()
        results = [s for s in results if q_lower in s["name"].lower() or q_lower in s["code"].lower()]
    if body_part:
        results = [s for s in results if s["body_part"].lower() == body_part.lower()]
    if severity:
        results = [s for s in results if s["severity"].lower() == severity.lower()]
    return results


@router.get("/body-parts", response_model=List[str])
def list_body_parts():
    parts = list({s["body_part"] for s in ALL_SYMPTOMS})
    return sorted(parts)
