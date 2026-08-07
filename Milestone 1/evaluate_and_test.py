import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score

def evaluate_model():
    print("=" * 60)
    print("1. LOADING DATASET & MODEL")
    print("=" * 60)
    
    # Load the NEW weighted dataset
    data_path = "processed_data/weighted_final_dataset.csv"
    if not os.path.exists(data_path):
        print(f"[ERROR] Dataset not found at {data_path}")
        return
    
    df = pd.read_csv(data_path)
    print(f"Dataset Loaded. Shape: {df.shape}")
    
    X = df.drop("prognosis", axis=1)
    y = df["prognosis"]
    
    model_path = "models/best_model.pkl"
    encoder_path = "models/label_encoder.pkl"
    
    if not os.path.exists(model_path) or not os.path.exists(encoder_path):
        print("[ERROR] Model or Encoder missing!")
        return
        
    model = joblib.load(model_path)
    encoder = joblib.load(encoder_path)
    print("[OK] Model & Label Encoder loaded successfully!")

    print("\n" + "=" * 60)
    print("2. EVALUATING ACCURACY")
    print("=" * 60)
    
    # Safely define is_encoded here so the entire function can use it
    test_pred_raw = model.predict(X.iloc[[0]])
    is_encoded = isinstance(test_pred_raw[0], (int, np.integer))
    
    if is_encoded:
        y_numeric = encoder.transform(y)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_numeric, test_size=0.2, random_state=42, stratify=y_numeric
        )
    else:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    train_acc = accuracy_score(y_train, y_train_pred)
    test_acc = accuracy_score(y_test, y_test_pred)
    
    print(f"Training Set Accuracy: {train_acc * 100:.2f}%")
    print(f"Testing Set Accuracy : {test_acc * 100:.2f}%")
    
    print("\n" + "=" * 60)
    print("3. TESTING WITH MANUAL SYMPTOM INPUTS")
    print("=" * 60)
    
    # Load severity weights to fix the "Hardcoded 1" bug
    severity_path = "datasets/Symptom-severity.csv"
    severity_dict = {}
    if os.path.exists(severity_path):
        sev_df = pd.read_csv(severity_path)
        sev_df['Symptom'] = sev_df['Symptom'].str.replace(' ', '_').str.lower()
        severity_dict = dict(zip(sev_df['Symptom'], sev_df['weight']))
    
    test_cases = [
        ["itching", "skin_rash"], 
        ["continuous_sneezing", "shivering", "chills"],    
        ["joint_pain", "vomiting", "yellowish_skin"],      
        ["headache", "chest_pain", "fast_heart_rate"],     
    ]
    
    all_symptoms = list(X.columns)
    
    for i, symptoms in enumerate(test_cases, 1):
        input_vector = pd.DataFrame(0, index=[0], columns=all_symptoms)
        
        valid_symptoms = []
        invalid_symptoms = []
        for s in symptoms:
            if s in all_symptoms:
                # INJECT THE ACTUAL CLINICAL WEIGHT
                weight = severity_dict.get(s, 1) 
                input_vector[s] = weight
                valid_symptoms.append(f"{s} (wt:{weight})")
            else:
                invalid_symptoms.append(s)
                
        print(f"Test Case {i}:")
        print(f"  Input Symptoms: {valid_symptoms}")
        if invalid_symptoms:
            print(f"  [WARNING] Unknown symptoms ignored: {invalid_symptoms}")
            
        probabilities = model.predict_proba(input_vector)[0]
        top_3_indices = np.argsort(probabilities)[::-1][:3]
        
        print("  Top 3 Predictions:")
        for idx in top_3_indices:
            if is_encoded:
                disease_name = encoder.inverse_transform([idx])[0]
            else:
                disease_name = model.classes_[idx]
                
            confidence = probabilities[idx] * 100
            print(f"  - {disease_name.upper()}: {confidence:.2f}%")
        print("\n")

if __name__ == "__main__":
    evaluate_model()