from app.core.database import get_database
from typing import List, Dict, Tuple
import math
import logging

logger = logging.getLogger(__name__)

# List of high-risk red-flag symptoms that warrant immediate escalation
RED_FLAG_SYMPTOMS = {
    "sharp chest pain",
    "shortness of breath",
    "difficulty breathing",
    "focal weakness",
    "slurring words",
    "vomiting blood",
    "blood in stool",
    "seizures",
    "fainting",
    "apnea",
    "unusual color or odor to urine",
    "blood in urine"
}

# List of high-risk diseases that require emergency attention
HIGH_RISK_DISEASES = {
    "abdominal aortic aneurysm",
    "heart attack",
    "stroke",
    "appendicitis",
    "acute kidney injury",
    "acute respiratory distress syndrome (ards)",
    "internal bleeding",
    "sepsis",
    "pulmonary embolism",
    "pneumothorax",
    "diabetic ketoacidosis"
}

def calculate_disease_score(patient_symptoms: List[str], profile: dict) -> float:
    symptom_probs = profile.get("symptom_probabilities", {})
    if not symptom_probs:
        return 0.0
        
    match_sum = 0.0
    matching_count = 0
    
    # Calculate matches
    for s in patient_symptoms:
        if s in symptom_probs:
            match_sum += symptom_probs[s]
            matching_count += 1
            
    if matching_count == 0:
        return 0.0
        
    # Calculate penalty for symptoms typical for the disease (prob > 0.4) that are absent
    penalty_sum = 0.0
    for s, prob in symptom_probs.items():
        if s not in patient_symptoms and prob > 0.4:
            penalty_sum += prob
            
    # Simple similarity index
    jaccard = match_sum / (1.0 + match_sum + 0.5 * penalty_sum)
    
    # Apply soft logarithmic multiplier based on base rate to favor more common conditions
    base_rate = profile.get("base_rate", 0.0001)
    prior_weight = 1.0 + 0.2 * math.log(base_rate / 0.00001)
    
    return jaccard * prior_weight

async def predict_diseases(patient_symptoms: List[str]) -> Tuple[List[dict], str, float, List[str]]:
    db = get_database()
    
    # Fetch all disease profiles from database
    cursor = db.disease_profiles.find()
    disease_scores = []
    
    async for profile in cursor:
        score = calculate_disease_score(patient_symptoms, profile)
        if score > 0:
            disease_scores.append((profile["disease"], score))
            
    if not disease_scores:
        # Fallback if no matching symptoms
        return [{"disease": "Healthy / No matched symptoms", "probability": 1.0}], "low", 0.0, ["Maintain a healthy diet and lifestyle."]
        
    # Sort and take top 5
    disease_scores.sort(key=lambda x: x[1], reverse=True)
    top_5 = disease_scores[:5]
    
    # Normalize scores to sum to 1.0 (probabilities)
    total_score = sum(score for _, score in top_5)
    predicted_diseases = []
    for disease, score in top_5:
        prob = score / total_score if total_score > 0 else 0.2
        predicted_diseases.append({"disease": disease, "probability": round(prob, 4)})
        
    # Determine risk score (0 to 100)
    # Base risk is matching count and average top disease confidence
    matching_red_flags = [s for s in patient_symptoms if s in RED_FLAG_SYMPTOMS]
    primary_disease = predicted_diseases[0]["disease"]
    
    risk_score = 15.0  # Base score
    risk_score += min(len(patient_symptoms) * 5, 25)  # Max +25 for symptom count
    risk_score += predicted_diseases[0]["probability"] * 30  # Max +30 for confidence
    
    # Escalation factors
    is_high_risk_disease = primary_disease in HIGH_RISK_DISEASES
    has_red_flags = len(matching_red_flags) > 0
    
    if is_high_risk_disease or has_red_flags:
        risk_score += 40.0
        risk_level = "high"
    elif risk_score >= 45.0 or len(patient_symptoms) >= 6:
        risk_level = "medium"
    else:
        risk_level = "low"
        
    # Cap risk score
    risk_score = min(round(risk_score, 2), 100.0)
    if risk_level == "high":
        risk_score = max(risk_score, 70.0) # Ensure high risk has score >= 70
        
    # Generate recommendations
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
        
    # Disease specific advice
    if primary_disease == "panic disorder":
        recommendations.append("💡 Practice slow, deep breathing exercises and grounding techniques.")
    elif primary_disease == "asthma":
        recommendations.append("💡 Ensure you have your rescue inhaler accessible and avoid known allergens/triggers.")
    elif primary_disease in ["hypertension", "diabetes"]:
        recommendations.append("💡 Monitor blood pressure/glucose levels regularly and maintain a low-sodium/low-sugar diet.")
        
    return predicted_diseases, risk_level, risk_score, recommendations
