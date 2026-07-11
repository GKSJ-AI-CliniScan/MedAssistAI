import pandas as pd
import ast

# =====================================
# Load Knowledge Datasets
# =====================================

description_df = pd.read_csv("datasets/symptom_Description.csv")
precaution_df = pd.read_csv("datasets/symptom_precaution.csv")
diet_df = pd.read_csv("datasets/diets.csv")
medication_df = pd.read_csv("datasets/medications.csv")
workout_df = pd.read_csv("datasets/workout_df.csv")
severity_df = pd.read_csv("datasets/disease_severity.csv")


# =====================================
# Disease Description
# =====================================

def get_description(disease):

    row = description_df[
        description_df["Disease"].str.strip().str.lower()
        == disease.strip().lower()
    ]

    if row.empty:
        return "Description not available."

    return row.iloc[0]["Description"]


# =====================================
# Disease Precautions
# =====================================

def get_precautions(disease):

    row = precaution_df[
        precaution_df["Disease"].str.strip().str.lower()
        == disease.strip().lower()
    ]

    if row.empty:
        return []

    precautions = []

    for i in range(1, 5):

        value = row.iloc[0][f"Precaution_{i}"]

        if pd.notna(value):
            precautions.append(value)

    return precautions


# =====================================
# Diet Recommendation
# =====================================

def get_diet(disease):

    row = diet_df[
        diet_df["Disease"].str.strip().str.lower()
        == disease.strip().lower()
    ]

    if row.empty:
        return []

    diet = row.iloc[0]["Diet"]

    try:
        return ast.literal_eval(diet)
    except:
        return [diet]


# =====================================
# Medication Recommendation
# =====================================

def get_medications(disease):

    row = medication_df[
        medication_df["Disease"].str.strip().str.lower()
        == disease.strip().lower()
    ]

    if row.empty:
        return []

    medicines = row.iloc[0]["Medication"]

    try:
        return ast.literal_eval(medicines)
    except:
        return [medicines]


# =====================================
# Workout Recommendation
# =====================================

def get_workout(disease):

    rows = workout_df[
        workout_df["disease"].str.strip().str.lower()
        == disease.strip().lower()
    ]

    if rows.empty:
        return []

    return rows["workout"].tolist()


# =====================================
# Disease Severity
# =====================================

def get_severity(disease):

    row = severity_df[
        severity_df["Disease"].str.strip().str.lower()
        == disease.strip().lower()
    ]

    if row.empty:
        return "Unknown", 0

    category = row.iloc[0]["Severity_Category"]
    weight = int(row.iloc[0]["Severity_Weight"])

    return category, weight


# =====================================
# Doctor Advice
# =====================================

def get_doctor_advice(severity_category):

    severity = severity_category.lower()

    if severity == "mild":

        return (
            "The condition appears to be mild. Follow the recommended precautions, maintain a healthy diet, and consult a doctor if symptoms worsen."
        )

    elif severity == "moderate":

        return (
            "Medical consultation is recommended. Follow the prescribed precautions and monitor your condition closely."
        )

    elif severity == "serious":

        return (
            "This disease may become severe if untreated. Visit a healthcare professional as soon as possible."
        )

    elif severity == "critical":

        return (
            "Seek immediate emergency medical attention. Do not delay treatment."
        )

    else:

        return (
            "Consult a qualified healthcare professional for proper diagnosis and treatment."
        )


# =====================================
# Final Recommendation
# =====================================

def generate_recommendation(disease):

    category, weight = get_severity(disease)

    return {

        "Disease": disease,

        "Description": get_description(disease),

        "Precautions": get_precautions(disease),

        "Diet": get_diet(disease),

        "Medications": get_medications(disease),

        "Workout": get_workout(disease),

        "Severity Category": category,

        "Severity Weight": weight,

        "Doctor Advice": get_doctor_advice(category)

    }