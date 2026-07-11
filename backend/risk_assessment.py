import pandas as pd

# ===============================
# Load Datasets
# ===============================

disease_df = pd.read_csv("datasets/disease_severity.csv")
symptom_df = pd.read_csv("datasets/Symptom-severity.csv")


# ===============================
# Disease Score
# ===============================

def calculate_disease_score(predicted_disease):

    row = disease_df[
        disease_df["Disease"].str.strip().str.lower()
        ==
        predicted_disease.strip().lower()
    ]

    if row.empty:
        return 0

    return int(row.iloc[0]["Severity_Weight"])


# ===============================
# Symptom Score
# ===============================

def calculate_symptom_score(selected_symptoms):

    total_score = 0

    for symptom in selected_symptoms:

        row = symptom_df[
            symptom_df["Symptom"].str.strip().str.lower()
            ==
            symptom.strip().lower()
        ]

        if not row.empty:
            total_score += int(row.iloc[0]["weight"])

    return total_score


# ===============================
# Age Score
# ===============================

def calculate_age_score(age):

    if age <= 18:
        return 2

    elif age <= 40:
        return 4

    elif age <= 60:
        return 7

    else:
        return 10


# ===============================
# Medical History Score
# ===============================

def calculate_medical_history_score(history):

    score = 0

    for disease in history:

        disease = disease.strip().lower()

        if disease in [
            "diabetes",
            "hypertension",
            "heart disease",
            "asthma"
        ]:
            score += 5

    return min(score, 20)


# ===============================
# Lifestyle Score
# ===============================

def calculate_lifestyle_score(lifestyle):

    score = 0

    if lifestyle["smoking"]:
        score += 5

    if lifestyle["alcohol"]:
        score += 5

    if not lifestyle["exercise"]:
        score += 5

    if lifestyle["sleep"] == "poor":
        score += 3

    if lifestyle["recent_travel"]:
        score += 1

    if lifestyle["high_risk_job"]:
        score += 1

    return min(score, 20)


# ===============================
# Final Risk Score
# ===============================

def calculate_final_risk_score(
    disease,
    symptoms,
    age,
    history,
    lifestyle
):

    disease_score = calculate_disease_score(disease)

    symptom_score = calculate_symptom_score(symptoms)

    age_score = calculate_age_score(age)

    history_score = calculate_medical_history_score(history)

    lifestyle_score = calculate_lifestyle_score(lifestyle)

    total_score = (
        disease_score
        + symptom_score
        + age_score
        + history_score
        + lifestyle_score
    )

    total_score = min(total_score, 100)

    if total_score <= 30:
        risk = "LOW"

    elif total_score <= 60:
        risk = "MEDIUM"

    elif total_score <= 80:
        risk = "HIGH"

    else:
        risk = "CRITICAL"

    return {
        "Disease Score": disease_score,
        "Symptom Score": symptom_score,
        "Age Score": age_score,
        "Medical History Score": history_score,
        "Lifestyle Score": lifestyle_score,
        "Total Risk Score": total_score,
        "Risk Level": risk
    }