from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import numpy as np
import joblib
import uvicorn

# ==========================================================
# Load Model
# ==========================================================

model = joblib.load("models/disease_prediction_model.pkl")
label_encoder = joblib.load("models/label_encoder.pkl")
feature_columns = joblib.load("models/feature_columns.pkl")

# ==========================================================
# Load Datasets
# ==========================================================

description_df = pd.read_csv("datasets/symptom_Description.csv")
precaution_df = pd.read_csv("datasets/symptom_precaution.csv")

description_df["Disease"] = (
    description_df["Disease"]
    .str.lower()
    .str.strip()
)

precaution_df["Disease"] = (
    precaution_df["Disease"]
    .str.lower()
    .str.strip()
)

description_map = dict(
    zip(description_df["Disease"], description_df["Description"])
)

precaution_map = (
    precaution_df
    .set_index("Disease")
    .apply(lambda x: x.dropna().tolist(), axis=1)
    .to_dict()
)

# ==========================================================
# FastAPI App
# ==========================================================

app = FastAPI(
    title="MedAssistAI API",
    description="Disease Prediction API using Random Forest",
    version="1.0.0"
)

# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Request Model
# ==========================================================

class Patient(BaseModel):
    data: dict

# ==========================================================
# Home
# ==========================================================

@app.get("/")
def home():
    return {
        "message": "MedAssistAI API Running"
    }

# ==========================================================
# Health Check
# ==========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True
    }

# ==========================================================
# Prediction Endpoint
# ==========================================================

@app.post("/predict")
def predict(patient: Patient):

    try:

        # Create empty input
        input_df = pd.DataFrame(
            np.zeros((1, len(feature_columns))),
            columns=feature_columns
        )

        selected_symptoms = []

        # Fill input
        for key, value in patient.data.items():

            key = key.lower().strip()

            if key in input_df.columns:

                input_df.loc[0, key] = value

                if (
                    key not in ["age_group", "gender"]
                    and value == 1
                ):
                    selected_symptoms.append(key)
        # Count selected symptoms
        selected_count = sum(
        value
        for key, value in patient.data.items()
        if key not in ["age_group", "gender"]
        )

        if selected_count < 2:
            return {
                "error": "Please select at least 2 symptoms for an accurate prediction."
            }

        # Predict probabilities
        probs = model.predict_proba(input_df)[0]

        # Diseases having probability > 0
        valid_idx = np.where(probs > 0)[0]

        # Sort descending
        valid_idx = valid_idx[
            np.argsort(probs[valid_idx])[::-1]
        ]

        # Keep top 3
        top3 = valid_idx[:3]

        # Best prediction
        best_idx = top3[0]

        disease = label_encoder.inverse_transform([best_idx])[0]

        confidence = round(
            float(probs[best_idx] * 100),
            2
        )

        # Confidence Level
        if confidence >= 80:
            confidence_level = "High"

        elif confidence >= 50:
            confidence_level = "Medium"

        else:
            confidence_level = "Low"

        # Lookup key
        lookup_key = disease.lower()

        # Top Predictions
        top_predictions = []

        for idx in top3:

            top_predictions.append({

                "disease": label_encoder.inverse_transform([idx])[0],

                "probability": round(
                    float(probs[idx] * 100),
                    2
                )

            })

        return {

            "predicted_disease": disease,

            "confidence": confidence,

            "confidence_level": confidence_level,

            "selected_symptoms": selected_symptoms,

            "description": description_map.get(
                lookup_key,
                "Description not available."
            ),

            "precautions": precaution_map.get(
                lookup_key,
                ["No precautions available."]
            ),

            "top_predictions": top_predictions

        }

    except Exception as e:

        return {
            "error": str(e)
        }

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