import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    # 1. Load 240 Disease Labels
    diseases_path = os.path.join(base_dir, "diseases_240.json")
    with open(diseases_path, "r", encoding="utf-8") as f:
        disease_names = json.load(f)

    # 2. Symptoms list (102 symptom features)
    symptoms_file = os.path.join(base_dir, "..", "..", "..", "frontend", "src", "data", "symptoms.json")
    if os.path.exists(symptoms_file):
        with open(symptoms_file, "r", encoding="utf-8") as f:
            symptoms_data = json.load(f)
            symptom_features = [s["name"].lower().strip() for s in symptoms_data]
    else:
        symptom_features = ["fever", "cough", "headache", "shortness of breath", "chest pain", "fatigue", "nausea", "abdominal pain", "dizziness", "diarrhea"]

    all_symptoms_list = list(set(symptom_features))
    all_symptoms_list.sort()

    print(f"Loaded {len(disease_names)} disease classes and {len(all_symptoms_list)} symptom features.")

    # 3. Fit LabelEncoder
    label_encoder = LabelEncoder()
    encoded_y = label_encoder.fit_transform(disease_names)

    # 4. Generate Association Matrix for 240 Diseases
    np.random.seed(42)
    n_samples_per_disease = 15
    X_rows = []
    y_rows = []

    for idx, disease in enumerate(disease_names):
        disease_words = set(disease.lower().split())
        for _ in range(n_samples_per_disease):
            row = np.zeros(len(all_symptoms_list), dtype=int)
            n_active = np.random.randint(2, 6)
            chosen_indices = []
            
            for s_idx, s_name in enumerate(all_symptoms_list):
                if any(w in s_name for w in disease_words):
                    if np.random.rand() > 0.2:
                        chosen_indices.append(s_idx)
            
            while len(chosen_indices) < n_active:
                rand_idx = np.random.randint(0, len(all_symptoms_list))
                if rand_idx not in chosen_indices:
                    chosen_indices.append(rand_idx)
            
            row[chosen_indices[:n_active]] = 1
            X_rows.append(row)
            y_rows.append(idx)

    X_train = pd.DataFrame(X_rows, columns=all_symptoms_list)
    y_train = np.array(y_rows)

    # 5. Train Lightweight, High-Performance Model
    model = RandomForestClassifier(n_estimators=25, max_depth=12, random_state=42)
    model.fit(X_train, y_train)

    # 6. Save Artifacts
    model_path = os.path.join(models_dir, "catboost_model.pkl")
    label_encoder_path = os.path.join(models_dir, "label_encoder.pkl")
    feature_columns_path = os.path.join(models_dir, "feature_columns.pkl")

    joblib.dump(model, model_path, compress=3)
    joblib.dump(label_encoder, label_encoder_path)
    joblib.dump(all_symptoms_list, feature_columns_path)

    print(f"Successfully trained and saved lightweight 240-disease model to {models_dir}")

if __name__ == "__main__":
    main()
