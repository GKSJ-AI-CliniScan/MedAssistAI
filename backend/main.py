from fastapi import FastAPI
from backend.recommendation import get_recommendations

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Welcome to MedAssist AI Backend!"
    }

@app.get("/recommendation/{disease}")
def recommendation(disease: str):
    return get_recommendations(disease)