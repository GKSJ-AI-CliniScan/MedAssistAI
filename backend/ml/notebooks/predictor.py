import joblib
import pandas as pd
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "ml" / "saved_models" / "catboost_model.pkl"
FEATURE_PATH = BASE_DIR / "ml" / "saved_models" / "feature_columns1.pkl"
ENCODER_PATH = BASE_DIR / "ml" / "saved_models" / "label_encoder_h.pkl"

DISEASE_INFO_PATH = BASE_DIR / "ml" / "datasets" / "diseases_detailed.csv"


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_PATH)
label_encoder = joblib.load(ENCODER_PATH)


# ============================================================
# LOAD DISEASE INFORMATION
# ============================================================

disease_info = pd.read_csv(DISEASE_INFO_PATH)

# Normalize disease names for matching
disease_info["Disease"] = (
    disease_info["Disease"]
    .astype(str)
    .str.strip()
    .str.lower()
)


# ============================================================
# PREDICT DISEASE
# ============================================================

def predict_disease(symptoms):

    sample = pd.DataFrame(
        0,
        index=[0],
        columns=feature_columns
    )

    for symptom in symptoms:

        symptom = symptom.lower().strip()

        if symptom in feature_columns:
            sample.loc[0, symptom] = 1

    prediction = model.predict(sample)

    class_index = int(prediction[0][0])

    disease = label_encoder.inverse_transform(
        [class_index]
    )[0]

    return disease


# ============================================================
# GET DISEASE INFORMATION
# ============================================================

def get_disease_information(disease):

    disease = disease.lower().strip()

    result = disease_info[
        disease_info["Disease"] == disease
    ]

    if result.empty:
        return None

    return result.iloc[0].to_dict()


# ============================================================
# COMPLETE PREDICTION
# ============================================================

def predict_with_information(symptoms):

    disease = predict_disease(symptoms)

    information = get_disease_information(disease)

    return {
        "predicted_disease": disease,
        "information": information
    }