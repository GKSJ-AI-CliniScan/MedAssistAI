from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import json
import pandas as pd
import numpy as np
import os
import re

app = FastAPI(title="MedAssist ML Backend API", version="2.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Trained Model & Artifacts
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_model.joblib")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "label_encoder.joblib")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "feature_names.json")

model = None
le = None
feature_names = []

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    if os.path.exists(ENCODER_PATH):
        le = joblib.load(ENCODER_PATH)
    if os.path.exists(FEATURES_PATH):
        with open(FEATURES_PATH, "r") as f:
            feature_names = json.load(f)
    print(f"[OK] ML Backend loaded successfully! Features: {len(feature_names)}, Model: {model is not None}, Encoder: {le is not None}")
except Exception as e:
    print(f"[Warning] Failed to load ML artifacts: {e}")

class PatientVitals(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    temperature: Optional[float] = None
    heart_rate: Optional[int] = None
    bp_sys: Optional[int] = None
    bp_dia: Optional[int] = None

class SymptomPredictionRequest(BaseModel):
    symptoms: List[str]
    vitals: Optional[PatientVitals] = None
    duration: Optional[str] = None
    severity: Optional[str] = None
    medical_history: Optional[List[str]] = None

def match_symptom_to_feature(symptom_str: str, available_features: List[str]) -> Optional[str]:
    s_clean = symptom_str.lower().strip()
    s_snake = re.sub(r'[\s\-\/\,]+', '_', s_clean)

    # 1. Exact match
    if s_snake in available_features:
        return s_snake
    if s_clean in available_features:
        return s_clean

    # 2. Substring match
    for feat in available_features:
        if s_clean in feat or feat in s_clean:
            return feat
        feat_clean = feat.replace('_', ' ')
        if s_clean in feat_clean or feat_clean in s_clean:
            return feat

    return None

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MedAssist ML Backend",
        "model_loaded": model is not None,
        "encoder_loaded": le is not None,
        "feature_count": len(feature_names),
        "class_count": len(le.classes_) if le else 0
    }

@app.post("/predict")
def predict_disease(req: SymptomPredictionRequest):
    if model is None or le is None or not feature_names:
        raise HTTPException(
            status_code=500,
            detail="ML Model or LabelEncoder not loaded on server. Run train_gdrive_rf.py."
        )

    if not req.symptoms or len(req.symptoms) == 0:
        raise HTTPException(status_code=400, detail="Please select at least one symptom.")

    # Build 377-dimensional binary input vector
    input_vector = np.zeros(len(feature_names), dtype=np.uint8)
    matched_symptoms = []

    for user_sym in req.symptoms:
        matched_feat = match_symptom_to_feature(user_sym, feature_names)
        if matched_feat:
            idx = feature_names.index(matched_feat)
            input_vector[idx] = 1
            matched_symptoms.append(matched_feat)

    # Convert to DataFrame
    df_input = pd.DataFrame([input_vector], columns=feature_names)

    # Predict Probabilities
    probas = model.predict_proba(df_input)[0]

    # Extract Top 5 Predictions
    top_indices = np.argsort(probas)[::-1][:5]
    predictions = []

    for rank, idx in enumerate(top_indices, 1):
        disease_name = str(le.inverse_transform([idx])[0])
        prob_val = float(probas[idx])
        prob_pct = round(prob_val * 100, 2)

        # Risk Classification based on probability & rank
        if prob_val >= 0.40 or rank == 1 and prob_val >= 0.25:
            risk_level = "High"
            urgency = "Consult Doctor Soon"
        elif prob_val >= 0.15:
            risk_level = "Moderate"
            urgency = "Monitor & Self Care"
        else:
            risk_level = "Low"
            urgency = "Routine Care"

        predictions.append({
            "rank": rank,
            "disease": disease_name,
            "probability": prob_val,
            "probability_percentage": f"{prob_pct}%",
            "risk_level": risk_level,
            "urgency": urgency
        })

    primary_prediction = predictions[0] if predictions else {"disease": "Undetermined", "probability": 0.0}

    return {
        "success": True,
        "primary_disease": primary_prediction["disease"],
        "confidence": primary_prediction["probability"],
        "confidence_percentage": primary_prediction["probability_percentage"],
        "predictions": predictions,
        "matched_symptoms": matched_symptoms,
        "input_symptoms_count": len(req.symptoms),
        "matched_features_count": len(matched_symptoms),
        "engine": "RandomForest-200 (658 Classes)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
