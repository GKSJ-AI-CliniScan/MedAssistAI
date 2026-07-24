from fastapi import FastAPI
from app.routes import health
from app.routes import risk_assessment
from app.routes import predict

app = FastAPI()

app.include_router(health.router)
app.include_router(risk_assessment.router)
app.include_router(predict.router)

@app.get("/")
def home():
    return {
        "message": "Welcome to MedAssist AI Backend"
    }