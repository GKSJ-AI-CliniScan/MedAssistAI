from fastapi import APIRouter

from backend.recommendation import generate_recommendation
from backend.schemas import DiseaseRequest

router = APIRouter()


@router.get("/")
def recommendation_home():
    return {"message": "Recommendation API"}


@router.post("/get")
def recommendation(request: DiseaseRequest):

    result = generate_recommendation(request.disease)

    return result