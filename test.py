import xgboost as xgb
import joblib
import pandas as pd
import numpy as np

print("Loading MedAssist AI files...")

# ---------------------------------------------------------
# 1. Load the AI Brain and Dictionaries
# ---------------------------------------------------------
# Load the XGBoost model
model = xgb.Booster()
model.load_model("disease_prediction_xgb.json")

# Load the dictionaries
le = joblib.load("label_encoder.pkl")
feature_cols = joblib.load("feature_columns.pkl")

# ---------------------------------------------------------
# 2. Simulate User Input (The Frontend Handoff)
# ---------------------------------------------------------
# ---------------------------------------------------------
# 2. Simulate User Input (Interactive CLI)
# ---------------------------------------------------------
print("\n" + "="*50)
print("Welcome to MedAssist AI Diagnostic Terminal")
print("="*50)

# 1. Ask the user for input
raw_input = input("\nEnter symptoms separated by commas\n(e.g., high_fever, headache, muscle_pain): ")

# 2. Split the string into a list and clean up accidental spaces
# We use split(",") so the user can type spaces after commas without breaking it
user_symptoms = [symptom.strip() for symptom in raw_input.split(",")]

print(f"\n[System] Analyzing reported symptoms: {user_symptoms}...")
# ---------------------------------------------------------
# 3. Translate Symptoms for the AI
# ---------------------------------------------------------
# Create a blank patient record with 0 for all 377 symptoms
patient_data = {col: 0 for col in feature_cols}

# Flip the 0 to a 1 for the symptoms the user actually has
for symptom in user_symptoms:
    if symptom in patient_data:
        patient_data[symptom] = 1
    else:
        print(f"Warning: Symptom '{symptom}' not recognized by the AI.")

# Convert to a DataFrame and compress to uint8 (just like we did in Colab!)
df_patient = pd.DataFrame([patient_data]).astype(np.uint8)
dpatient = xgb.DMatrix(df_patient)

# ---------------------------------------------------------
# 4. Generate the Prediction
# ---------------------------------------------------------
# The model outputs a massive list of 754 probabilities
probabilities = model.predict(dpatient)[0]

# Sort the probabilities to find the Top 3 highest scores
top_3_indices = np.argsort(probabilities)[::-1][:5]

# ---------------------------------------------------------
# 5. Display the Results for the Mentor
# ---------------------------------------------------------
print("\n=== MedAssist AI: Top 3 Predictions ===")
for rank, index in enumerate(top_3_indices, start=1):
    # Translate the ID number back to the English disease name
    disease_name = le.inverse_transform([index])[0]
    
    # Get the probability percentage
    confidence = probabilities[index] * 100
    
    print(f"#{rank}: {disease_name} ({confidence:.2f}%)")