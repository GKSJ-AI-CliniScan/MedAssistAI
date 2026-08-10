from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict

import traceback
import pandas as pd
import numpy as np
import joblib
import uvicorn

# ==========================================================
# Load Model
# ==========================================================

model = joblib.load("models/catboost_model_240.pkl")
label_encoder = joblib.load("models/label_encoder_240.pkl")
feature_columns = joblib.load("models/feature_columns_240.pkl")

# ==========================================================
# Load Disease Information
# ==========================================================

disease_info_df = pd.read_csv("datasets/disease_info.csv")

disease_info_df["Disease"] = (
    disease_info_df["Disease"]
    .str.lower()
    .str.strip()
)

# Disease -> Description
description_map = dict(
    zip(
        disease_info_df["Disease"],
        disease_info_df["Description"]
    )
)

# Disease -> Precautions
precaution_map = {}

for _, row in disease_info_df.iterrows():

    precautions = []

    for col in [
        "Precaution_1",
        "Precaution_2",
        "Precaution_3",
        "Precaution_4",
    ]:

        if (
            col in disease_info_df.columns
            and pd.notna(row[col])
            and str(row[col]).strip()
        ):
            precautions.append(str(row[col]).strip())

    precaution_map[row["Disease"]] = precautions

# ==========================================================
# FastAPI App
# ==========================================================

app = FastAPI(
    title="MedAssistAI API",
    description="Disease Prediction API using CatBoost",
    version="1.0.0"
)

# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Request Model
# ==========================================================

class Patient(BaseModel):
    data: Dict[str, int]

# ==========================================================
# Home
# ==========================================================

@app.get("/")
def home():
    return {
        "message": "MedAssistAI API Running"
    }

# ==========================================================
# Health
# ==========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": True,
        "total_diseases": len(label_encoder.classes_),
        "total_features": len(feature_columns)
    }

# ==========================================================
# Prediction Endpoint
# ==========================================================

@app.post("/predict")
def predict(patient: Patient):

    try:

        # ==========================================
        # Create input dataframe
        # ==========================================

        input_df = pd.DataFrame(
            np.zeros(
                (1, len(feature_columns)),
                dtype=np.float32
            ),
            columns=feature_columns
        )

        selected_symptoms = []

        # ==========================================
        # Fill input
        # ==========================================

        for key, value in patient.data.items():

            key = key.lower().strip()

            if key in input_df.columns:

                value = int(value)

                input_df.at[0, key] = value

                if (
                    key not in ["age_group", "gender"]
                    and value == 1
                ):
                    selected_symptoms.append(key)

        # ==========================================
        # Validate symptom count
        # ==========================================

        selected_count = len(selected_symptoms)

        if selected_count < 2:
            raise HTTPException(
                status_code=400,
                detail="Please select at least 2 symptoms."
            )

        # ==========================================
        # Prediction
        # ==========================================

        probs = model.predict_proba(input_df)[0]

        valid_idx = np.where(probs > 0)[0]

        if len(valid_idx) == 0:
            raise HTTPException(
                status_code=500,
                detail="No prediction generated."
            )

        valid_idx = valid_idx[
            np.argsort(probs[valid_idx])[::-1]
        ]

        top3 = valid_idx[:3]

        best_idx = top3[0]

        disease = label_encoder.inverse_transform(
            [best_idx]
        )[0]

        confidence = round(
            float(probs[best_idx]) * 100,
            2
        )

        # ==========================================
        # Confidence Level
        # ==========================================

        if confidence >= 80:
            confidence_level = "High"
        elif confidence >= 50:
            confidence_level = "Medium"
        else:
            confidence_level = "Low"

        # ==========================================
        # Disease Information
        # ==========================================

        lookup_key = disease.lower().strip()

        description = description_map.get(
            lookup_key,
            "Description not available."
        )

        precautions = precaution_map.get(
            lookup_key,
            ["No precautions available."]
        )

        # ==========================================
        # Top Predictions
        # ==========================================

        top_predictions = []

        for idx in top3:

            top_predictions.append({

                "disease": label_encoder.inverse_transform([idx])[0],

                "probability": round(
                    float(probs[idx]) * 100,
                    2
                )

            })

        # ==========================================
        # Response
        # ==========================================

        return {

            "success": True,

            "predicted_disease": disease,

            "confidence": confidence,

            "confidence_level": confidence_level,

            "selected_symptoms": selected_symptoms,

            "description": description,

            "precautions": precautions,

            "top_predictions": top_predictions

        }

    except HTTPException:
        raise

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ==========================================================
# Run Server
# ==========================================================

if __name__ == "__main__":

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )