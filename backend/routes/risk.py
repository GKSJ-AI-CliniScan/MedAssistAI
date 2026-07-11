from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from backend.risk_assessment import calculate_final_risk_score

router = APIRouter()


class Lifestyle(BaseModel):
    smoking: bool
    alcohol: bool
    exercise: bool
    sleep: str
    recent_travel: bool
    high_risk_job: bool


class RiskRequest(BaseModel):
    disease: str
    symptoms: List[str]
    age: int
    history: List[str]
    lifestyle: Lifestyle


@router.get("/")
def risk_home():
    return {"message": "Risk Assessment API"}


@router.post("/assess")
def assess_risk(request: RiskRequest):

    result = calculate_final_risk_score(
        disease=request.disease,
        symptoms=request.symptoms,
        age=request.age,
        history=request.history,
        lifestyle=request.lifestyle.model_dump()
    )

    return result