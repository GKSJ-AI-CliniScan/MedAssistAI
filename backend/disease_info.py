import pandas as pd

# Load datasets
description_df = pd.read_csv("datasets/symptom_Description.csv")
precaution_df = pd.read_csv("datasets/symptom_precaution.csv")
diet_df = pd.read_csv("datasets/diets.csv")
medication_df = pd.read_csv("datasets/medications.csv")
workout_df = pd.read_csv("datasets/workout_df.csv")

def get_description(disease):
    row = description_df[description_df["Disease"] == disease]
    if not row.empty:
        return row.iloc[0]["Description"]
    return "Description not found"

def get_precautions(disease):
    row = precaution_df[precaution_df["Disease"] == disease]
    if not row.empty:
        return row.iloc[0].tolist()[1:]
    return []

def get_diet(disease):
    row = diet_df[diet_df["Disease"] == disease]
    if not row.empty:
        return row.iloc[0]["Diet"]
    return "No diet found"

def get_medication(disease):
    row = medication_df[medication_df["Disease"] == disease]
    if not row.empty:
        return row.iloc[0]["Medication"]
    return "No medication found"

def get_workout(disease):
    row = workout_df[workout_df["disease"] == disease]
    if not row.empty:
        return row.iloc[0]["workout"]
    return "No workout found"

# Test
disease = "Diabetes"

print("Disease:", disease)
print("Description:", get_description(disease))
print("Precautions:", get_precautions(disease))
print("Diet:", get_diet(disease))
print("Medication:", get_medication(disease))
print("Workout:", get_workout(disease))