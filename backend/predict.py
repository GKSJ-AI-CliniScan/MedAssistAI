import pandas as pd
import joblib


# ==========================
# Load Model
# ==========================

model = joblib.load("backend/disease_prediction_model.pkl")
label_encoder = joblib.load("backend/label_encoder.pkl")


# ==========================
# Load Dataset
# ==========================

df = pd.read_csv("datasets/Training_Clean.csv")

symptom_columns = list(df.columns[:-1])


# ==========================
# Disease Prediction Function
# ==========================

def predict_disease(selected_symptoms):

    # Create Feature Vector
    input_vector = [0] * len(symptom_columns)

    for symptom in selected_symptoms:

        if symptom in symptom_columns:

            index = symptom_columns.index(symptom)
            input_vector[index] = 1

    # Predict Disease
    prediction = model.predict([input_vector])

    predicted_disease = label_encoder.inverse_transform(prediction)[0]

    # Confidence Score
    probabilities = model.predict_proba([input_vector])[0]

    confidence = round(max(probabilities) * 100, 2)

    # Top 3 Predictions
    top3 = probabilities.argsort()[-3:][::-1]

    other_diseases = []

    for index in top3:

        disease = label_encoder.inverse_transform([index])[0]

        probability = round(probabilities[index] * 100, 2)

        other_diseases.append({
            "Disease": disease,
            "Probability": probability
        })

    # Return Result
    return {
        "Selected Symptoms": selected_symptoms,
        "Predicted Disease": predicted_disease,
        "Confidence Score": confidence,
        "Other Possible Diseases": other_diseases
    }


# ==========================
# Testing (Temporary)
# ==========================

if __name__ == "__main__":

    symptoms = [
        "high_fever",
        "vomiting",
        "headache"
    ]

    result = predict_disease(symptoms)

    print(result)