import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = BASE_DIR / "backend/ml/saved_models/catboost_model.pkl"
FEATURE_PATH = BASE_DIR / "backend/ml/saved_models/feature_columns1.pkl"
ENCODER_PATH = BASE_DIR / "backend/ml/saved_models/label_encoder_h.pkl"

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_PATH)
label_encoder = joblib.load(ENCODER_PATH)

print("================================")
print("CATBOOST VERIFICATION")
print("================================")

print("\nModel features:", len(model.feature_names_))
print("Saved feature columns:", len(feature_columns))

print("\nModel classes:", len(model.classes_))
print("Encoder classes:", len(label_encoder.classes_))

print("\nFirst 10 model features:")
print(model.feature_names_[:10])

print("\nFirst 10 saved features:")
print(feature_columns[:10])

print("\nFirst 10 model classes:")
print(model.classes_[:10])

print("\nFirst 10 encoder classes:")
print(label_encoder.classes_[:10])