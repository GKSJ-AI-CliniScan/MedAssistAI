from fastapi import APIRouter, Depends
from app.services.prediction_service import predict_disease  # <-- Changed this line to use YOUR model
from app.core.database import get_database
from app.core.security import get_current_user
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/analyze")
async def analyze(
    data: dict,
    current_user: dict = Depends(get_current_user),
):
    symptoms = data.get("symptoms", [])

    # This is now running your XGBoost model!
    result = await predict_disease(symptoms)

    result["id"] = str(uuid.uuid4())
    result["created_at"] = datetime.now().isoformat()
    result["date"] = datetime.now().strftime("%b %d, %Y")

    # Save the owner of this prediction
    result["user_email"] = current_user["email"]

    db = get_database()
    await db.consultations.insert_one(result)

    return result

@router.get("/{prediction_id}")
async def get_prediction(
    prediction_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()

    prediction = await db.consultations.find_one({
        "id": prediction_id,
        "user_email": current_user["email"]
    })

    if prediction is None:
        return {"error": "Prediction not found"}

    prediction.pop("_id", None)

    return prediction