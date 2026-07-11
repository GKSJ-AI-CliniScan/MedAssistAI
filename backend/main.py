from fastapi import FastAPI

from backend.routes.prediction import router as prediction_router
from backend.routes.risk import router as risk_router
from backend.routes.recommendation import router as recommendation_router

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "Welcome to MedAssist AI Backend"
    }


app.include_router(
    prediction_router,
    prefix="/prediction",
    tags=["Disease Prediction"]
)

app.include_router(
    risk_router,
    prefix="/risk",
    tags=["Risk Assessment"]
)

app.include_router(
    recommendation_router,
    prefix="/recommendation",
    tags=["Treatment Recommendation"]
)