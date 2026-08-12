import json
import joblib
import xgboost as xgb
import numpy as np
import os
import logging

logger = logging.getLogger(__name__)

# --- 1. SET UP THE FILE PATHS ---
# This ensures Docker can find your models folder safely
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "xgb_tuned_lossguide.json")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoder.joblib")
SYMPTOMS_PATH = os.path.join(BASE_DIR, "models", "symptoms_list.json")

# --- 2. LOAD YOUR ACTUAL XGBOOST MODEL ---
try:
    booster = xgb.Booster()
    booster.load_model(MODEL_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    
    with open(SYMPTOMS_PATH, "r") as f:
        symptoms_list = json.load(f)
except Exception as e:
    logger.error(f"Failed to load ML models: {e}")
    symptoms_list = []

# List of high-risk red-flag symptoms
RED_FLAG_SYMPTOMS = {
    "sharp chest pain", "shortness of breath", "difficulty breathing",
    "focal weakness", "slurring words", "vomiting blood",
    "blood in stool", "seizures", "fainting", "apnea",
    "unusual color or odor to urine", "blood in urine"
}

# List of high-risk diseases
HIGH_RISK_DISEASES = {
    "abdominal aortic aneurysm", "heart attack", "stroke", "appendicitis",
    "acute kidney injury", "acute respiratory distress syndrome (ards)",
    "internal bleeding", "sepsis", "pulmonary embolism", "pneumothorax",
    "diabetic ketoacidosis"
}

async def predict_disease(patient_symptoms: list) -> dict:
    """
    Takes symptoms from the frontend, formats them for XGBoost, 
    and returns the prediction dictionary.
    """
    # Normalize patient symptoms to lowercase to ensure a perfect match
    patient_symptoms = [str(sym).lower().strip() for sym in patient_symptoms]
    
    # 1. Extract the EXACT feature list the model was trained on!
    # This completely bypasses the out-of-sync symptoms_list.json
    model_symptoms = booster.feature_names
    
    # Fallback just in case the model didn't save feature names
    if not model_symptoms:
        model_symptoms = symptoms_list
        
    # 2. Format patient symptoms into the binary array the model expects
    vector = [0] * len(model_symptoms)
    for i, sym in enumerate(model_symptoms):
        if sym in patient_symptoms:
            vector[i] = 1
            
    # 3. Run the XGBoost Prediction
    dmatrix = xgb.DMatrix([vector], feature_names=model_symptoms)
    probs = booster.predict(dmatrix)[0]
    
    # 4. Get the Top 5 most likely diseases using your Label Encoder
    top_5_idx = np.argsort(probs)[-5:][::-1]
    
    predicted_diseases = []
    for idx in top_5_idx:
        disease_name = label_encoder.inverse_transform([idx])[0]
        predicted_diseases.append({
            "disease": str(disease_name),
            "probability": float(probs[idx])
        })
        
    primary_disease = predicted_diseases[0]["disease"]
    
    # 5. Calculate Risk Score and Level (Your team's custom logic)
    matching_red_flags = [s for s in patient_symptoms if s in RED_FLAG_SYMPTOMS]
    
    risk_score = 15.0
    risk_score += min(len(patient_symptoms) * 5, 25)
    risk_score += predicted_diseases[0]["probability"] * 30
    
    is_high_risk_disease = primary_disease in HIGH_RISK_DISEASES
    has_red_flags = len(matching_red_flags) > 0
    
    if is_high_risk_disease or has_red_flags:
        risk_score += 40.0
        risk_level = "high"
    elif risk_score >= 45.0 or len(patient_symptoms) >= 6:
        risk_level = "medium"
    else:
        risk_level = "low"
        
    risk_score = min(round(risk_score, 2), 100.0)
    if risk_level == "high":
        risk_score = max(risk_score, 70.0)
        
    # 6. Generate Dynamic Recommendations
    recommendations = []
    if risk_level == "high":
        recommendations.append("🚨 EMERGENCY ALERT: Please seek immediate medical attention or go to the nearest emergency room.")
        if matching_red_flags:
            recommendations.append(f"Critical symptoms noted: {', '.join(matching_red_flags)}.")
    elif risk_level == "medium":
        recommendations.append("📅 Schedule an appointment with a primary care physician for further diagnostic testing.")
        recommendations.append("⚠️ Monitor symptoms closely and avoid strenuous activities.")
    else:
        recommendations.append("🏠 Rest and stay well hydrated. Monitor your symptoms over the next 24-48 hours.")
        recommendations.append("🩺 If symptoms persist or worsen, please consult a doctor.")
        
    if primary_disease == "panic disorder":
        recommendations.append("💡 Practice slow, deep breathing exercises and grounding techniques.")
    elif primary_disease == "asthma":
        recommendations.append("💡 Ensure you have your rescue inhaler accessible and avoid known allergens/triggers.")
    elif primary_disease in ["hypertension", "diabetes"]:
        recommendations.append("💡 Monitor blood pressure/glucose levels regularly and maintain a low-sodium/low-sugar diet.")
        
    # 7. Generate Suggested Tests
    suggested_tests = []
    if risk_level == "high" or has_red_flags:
        suggested_tests.extend(["Complete Blood Count (CBC)", "Comprehensive Metabolic Panel (CMP)", "ECG / EKG"])
    
    if primary_disease == "panic disorder":
        suggested_tests.append("Thyroid Function Tests (to rule out hyperthyroidism)")
    elif primary_disease == "asthma" or primary_disease == "acute bronchospasm":
        suggested_tests.extend(["Spirometry", "Peak Flow Measurement"])
    
    if not suggested_tests:
        suggested_tests.append("Basic Physical Examination")

    # Return the dictionary with the EXACT keys the React UI and PDF Generator expect
    # Convert raw decimal (0.5847) to a clean percentage (58.48)
    confidence_percentage = round(float(probs[top_5_idx[0]]) * 100, 2)

    # Return the dictionary with blanket keys to satisfy BOTH React and the PDF Generator
    return {
        "predicted_diseases": predicted_diseases,
        
        # Blanket keys for the disease name
        "disease": primary_disease,
        "predicted_disease": primary_disease,
        "prediction": primary_disease,
        
        # Blanket keys for the formatted confidence
        "confidence": confidence_percentage,
        "probability": confidence_percentage,
        
        "risk_level": risk_level,
        "risk": risk_level,
        "risk_score": risk_score,
        "recommendations": recommendations,
        "suggested_tests": suggested_tests,
        "symptoms": patient_symptoms
    }