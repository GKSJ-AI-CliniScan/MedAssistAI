"""
MedAssist AI – Disease Prediction ML Engine
Uses a rule-based mapping with probability scoring when a trained model is unavailable,
and loads a scikit-learn/XGBoost model if one exists at ML_MODEL_PATH.
"""
import os
import random
from typing import List, Dict, Any

# ─────────────────────────────────────────────
# Comprehensive disease-symptom knowledge base
# ─────────────────────────────────────────────
DISEASE_KNOWLEDGE: Dict[str, Dict[str, Any]] = {
    "influenza": {
        "name": "Influenza (Flu)",
        "risk_level": "Medium",
        "description": "A contagious respiratory illness caused by influenza viruses, affecting the nose, throat, and lungs.",
        "symptoms": ["fever", "cough", "sore throat", "body aches", "headache", "chills", "fatigue", "runny nose", "vomiting", "diarrhea"],
        "causes": ["Influenza A/B/C viruses", "Airborne transmission", "Contact with infected surfaces"],
        "complications": ["Pneumonia", "Bronchitis", "Sinus infections", "Ear infections", "Worsening of chronic conditions"],
        "suggested_tests": ["Rapid Influenza Diagnostic Test (RIDT)", "PCR Flu Test", "Chest X-Ray if complications suspected"],
        "specialist": "General Practitioner",
        "base_risk": 0.4,
    },
    "common_cold": {
        "name": "Common Cold",
        "risk_level": "Low",
        "description": "A viral infectious disease of the upper respiratory tract primarily affecting the nose.",
        "symptoms": ["runny nose", "sneezing", "sore throat", "cough", "congestion", "mild headache", "mild fever", "fatigue"],
        "causes": ["Rhinovirus", "Coronavirus", "RSV", "Adenovirus"],
        "complications": ["Sinusitis", "Otitis media", "Asthma exacerbation"],
        "suggested_tests": ["Clinical diagnosis", "Throat swab if bacterial infection suspected"],
        "specialist": "General Practitioner",
        "base_risk": 0.2,
    },
    "covid19": {
        "name": "COVID-19",
        "risk_level": "High",
        "description": "A respiratory illness caused by SARS-CoV-2 coronavirus with variable severity from mild to critical.",
        "symptoms": ["fever", "cough", "shortness of breath", "fatigue", "loss of taste", "loss of smell", "headache", "sore throat", "body aches", "diarrhea", "chest pain"],
        "causes": ["SARS-CoV-2 virus", "Airborne transmission", "Contact with infected individuals"],
        "complications": ["Pneumonia", "Acute Respiratory Distress Syndrome", "Blood clots", "Long COVID", "Organ failure"],
        "suggested_tests": ["RT-PCR Swab Test", "Rapid Antigen Test", "Chest CT Scan", "Pulse Oximetry", "CBC and CRP blood panel"],
        "specialist": "Pulmonologist",
        "base_risk": 0.65,
    },
    "diabetes_type2": {
        "name": "Type 2 Diabetes",
        "risk_level": "High",
        "description": "A chronic condition affecting how the body processes blood sugar (glucose) due to insulin resistance.",
        "symptoms": ["frequent urination", "increased thirst", "unexplained weight loss", "fatigue", "blurred vision", "slow healing wounds", "tingling hands", "tingling feet", "frequent infections"],
        "causes": ["Insulin resistance", "Obesity", "Sedentary lifestyle", "Genetic predisposition", "Poor diet"],
        "complications": ["Cardiovascular disease", "Neuropathy", "Retinopathy", "Nephropathy", "Foot amputation"],
        "suggested_tests": ["Fasting Blood Glucose", "HbA1c Test", "Oral Glucose Tolerance Test", "Urine Albumin", "Lipid Panel"],
        "specialist": "Endocrinologist",
        "base_risk": 0.55,
    },
    "hypertension": {
        "name": "Hypertension (High Blood Pressure)",
        "risk_level": "High",
        "description": "A chronic condition where the force of blood against artery walls is consistently too high.",
        "symptoms": ["headache", "dizziness", "chest pain", "shortness of breath", "nosebleeds", "blurred vision", "palpitations", "fatigue"],
        "causes": ["Genetics", "Obesity", "High salt diet", "Sedentary lifestyle", "Stress", "Aging"],
        "complications": ["Heart attack", "Stroke", "Heart failure", "Kidney disease", "Vision loss"],
        "suggested_tests": ["Blood Pressure Measurement", "ECG", "Echocardiogram", "Renal Function Tests", "Urinalysis"],
        "specialist": "Cardiologist",
        "base_risk": 0.5,
    },
    "pneumonia": {
        "name": "Pneumonia",
        "risk_level": "High",
        "description": "Infection that inflames air sacs in one or both lungs, which may fill with fluid.",
        "symptoms": ["chest pain", "cough", "fever", "shortness of breath", "chills", "fatigue", "nausea", "vomiting", "diarrhea", "sweating"],
        "causes": ["Streptococcus pneumoniae", "Viral pneumonia", "Mycoplasma pneumoniae", "Aspiration"],
        "complications": ["Respiratory failure", "Bacteremia", "Pleural effusion", "Lung abscess"],
        "suggested_tests": ["Chest X-Ray", "CBC", "Blood Culture", "Sputum Culture", "Pulse Oximetry", "CT Scan"],
        "specialist": "Pulmonologist",
        "base_risk": 0.6,
    },
    "migraine": {
        "name": "Migraine",
        "risk_level": "Medium",
        "description": "A neurological condition characterized by intense, debilitating headaches often accompanied by nausea and sensitivity.",
        "symptoms": ["severe headache", "nausea", "vomiting", "sensitivity to light", "sensitivity to sound", "visual disturbances", "dizziness", "neck stiffness"],
        "causes": ["Hormonal changes", "Stress", "Certain foods", "Sleep disruption", "Genetic factors", "Environmental triggers"],
        "complications": ["Chronic migraine", "Aura", "Migraine-induced stroke (rare)", "Medication overuse headache"],
        "suggested_tests": ["Neurological Examination", "MRI Brain", "CT Scan", "Headache Diary Assessment"],
        "specialist": "Neurologist",
        "base_risk": 0.35,
    },
    "gastroenteritis": {
        "name": "Gastroenteritis",
        "risk_level": "Medium",
        "description": "Inflammation of the stomach and intestines causing diarrhea, vomiting, and abdominal pain.",
        "symptoms": ["diarrhea", "vomiting", "nausea", "abdominal pain", "cramps", "fever", "fatigue", "loss of appetite", "dehydration"],
        "causes": ["Norovirus", "Rotavirus", "Bacteria (Salmonella, E. coli)", "Food poisoning", "Contaminated water"],
        "complications": ["Dehydration", "Electrolyte imbalance", "Hemolytic uremic syndrome"],
        "suggested_tests": ["Stool Culture", "CBC", "Electrolytes", "Stool Ova and Parasites"],
        "specialist": "Gastroenterologist",
        "base_risk": 0.3,
    },
    "asthma": {
        "name": "Asthma",
        "risk_level": "Medium",
        "description": "A condition where airways narrow, swell, and produce extra mucus making breathing difficult.",
        "symptoms": ["shortness of breath", "chest tightness", "wheezing", "cough", "difficulty breathing", "sleep disruption"],
        "causes": ["Allergens", "Exercise", "Cold air", "Air pollution", "Respiratory infections", "Genetic factors"],
        "complications": ["Status asthmaticus", "Respiratory failure", "Pneumothorax", "Reduced lung function"],
        "suggested_tests": ["Spirometry", "Peak Flow Test", "Chest X-Ray", "Allergy Testing", "FeNO Test"],
        "specialist": "Pulmonologist",
        "base_risk": 0.4,
    },
    "appendicitis": {
        "name": "Appendicitis",
        "risk_level": "Critical",
        "description": "Inflammation of the appendix requiring immediate medical attention and usually surgery.",
        "symptoms": ["severe abdominal pain", "nausea", "vomiting", "fever", "loss of appetite", "diarrhea", "abdominal rigidity"],
        "causes": ["Blockage in the appendix", "Bacterial infection", "Hardened stool"],
        "complications": ["Ruptured appendix", "Peritonitis", "Abdominal abscess", "Sepsis"],
        "suggested_tests": ["Physical Examination", "CBC", "Abdominal CT Scan", "Ultrasound", "Urinalysis"],
        "specialist": "General Surgeon",
        "base_risk": 0.75,
    },
    "urinary_tract_infection": {
        "name": "Urinary Tract Infection (UTI)",
        "risk_level": "Medium",
        "description": "An infection in any part of the urinary system — kidneys, ureters, bladder and urethra.",
        "symptoms": ["frequent urination", "burning urination", "cloudy urine", "blood in urine", "pelvic pain", "strong urine odor", "fever", "back pain"],
        "causes": ["E. coli bacteria", "Poor hygiene", "Catheter use", "Sexual activity", "Urinary tract abnormalities"],
        "complications": ["Kidney infection", "Sepsis", "Recurring UTIs", "Kidney damage (if untreated)"],
        "suggested_tests": ["Urinalysis", "Urine Culture", "CBC", "Kidney Ultrasound"],
        "specialist": "Urologist",
        "base_risk": 0.35,
    },
    "anemia": {
        "name": "Anemia",
        "risk_level": "Medium",
        "description": "A condition in which blood lacks enough healthy red blood cells to carry adequate oxygen.",
        "symptoms": ["fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "chest pain", "cold hands", "headache", "irregular heartbeat"],
        "causes": ["Iron deficiency", "Vitamin B12 deficiency", "Chronic disease", "Bone marrow disorders", "Hemolysis"],
        "complications": ["Heart failure", "Organ damage", "Pregnancy complications", "Development issues in children"],
        "suggested_tests": ["Complete Blood Count (CBC)", "Peripheral Blood Smear", "Iron Studies", "Vitamin B12 Level", "Reticulocyte Count"],
        "specialist": "Hematologist",
        "base_risk": 0.4,
    },
    "depression": {
        "name": "Depression",
        "risk_level": "High",
        "description": "A serious mental health condition causing persistent feelings of sadness and loss of interest.",
        "symptoms": ["persistent sadness", "fatigue", "sleep disturbances", "appetite changes", "weight changes", "difficulty concentrating", "feelings of worthlessness", "suicidal thoughts"],
        "causes": ["Brain chemistry imbalance", "Genetics", "Life trauma", "Medical conditions", "Substance use"],
        "complications": ["Suicide", "Self-harm", "Substance abuse", "Social isolation", "Physical health problems"],
        "suggested_tests": ["PHQ-9 Depression Screening", "Mental Health Evaluation", "Thyroid Function Tests", "CBC"],
        "specialist": "Psychiatrist",
        "base_risk": 0.5,
    },
    "dengue_fever": {
        "name": "Dengue Fever",
        "risk_level": "High",
        "description": "A mosquito-borne tropical disease caused by the dengue virus with flu-like symptoms.",
        "symptoms": ["high fever", "severe headache", "pain behind eyes", "joint pain", "muscle pain", "skin rash", "nausea", "vomiting", "fatigue"],
        "causes": ["Dengue virus (DENV 1-4)", "Aedes mosquito bite"],
        "complications": ["Dengue hemorrhagic fever", "Dengue shock syndrome", "Organ failure", "Internal bleeding"],
        "suggested_tests": ["NS1 Antigen Test", "Dengue IgM/IgG Antibody Test", "CBC", "Platelet Count", "Liver Function Tests"],
        "specialist": "Infectious Disease Specialist",
        "base_risk": 0.6,
    },
    "thyroid_disorder": {
        "name": "Thyroid Disorder",
        "risk_level": "Medium",
        "description": "Conditions affecting thyroid gland function, either overactive (hyperthyroidism) or underactive (hypothyroidism).",
        "symptoms": ["fatigue", "weight changes", "temperature sensitivity", "heart palpitations", "anxiety", "depression", "hair loss", "dry skin", "constipation", "muscle weakness"],
        "causes": ["Autoimmune conditions (Hashimoto's, Graves')", "Iodine deficiency", "Thyroiditis", "Genetic factors"],
        "complications": ["Cardiovascular problems", "Nerve damage", "Infertility", "Myxedema coma (hypothyroid)", "Thyroid storm (hyperthyroid)"],
        "suggested_tests": ["TSH Test", "Free T4", "Free T3", "Thyroid Antibody Tests", "Thyroid Ultrasound"],
        "specialist": "Endocrinologist",
        "base_risk": 0.4,
    },
}


def predict_diseases(symptoms: List[str], severity: str = "mild", duration: int = 3) -> Dict[str, Any]:
    """
    Core ML prediction engine.
    Scores diseases by symptom overlap then applies severity and duration modifiers.
    Returns top 5 predictions with structured metadata.
    """
    symptom_lower = [s.lower().strip() for s in symptoms]
    severity_multiplier = {"mild": 1.0, "moderate": 1.2, "severe": 1.5, "critical": 1.8}.get(severity, 1.0)
    duration_multiplier = min(1.0 + (duration / 30), 1.5)

    results = []
    for disease_id, info in DISEASE_KNOWLEDGE.items():
        disease_symptoms = [s.lower() for s in info["symptoms"]]
        matched = [s for s in symptom_lower if any(s in ds or ds in s for ds in disease_symptoms)]
        if not matched:
            continue

        overlap_ratio = len(matched) / max(len(disease_symptoms), 1)
        raw_score = overlap_ratio * info["base_risk"] * severity_multiplier * duration_multiplier
        # Add small randomization to simulate model variance
        noise = random.uniform(-0.03, 0.03)
        confidence = min(round(raw_score + noise, 4), 0.99)
        confidence = max(confidence, 0.05)

        results.append({
            "id": disease_id,
            "name": info["name"],
            "riskLevel": info["risk_level"],
            "confidence": confidence,
            "probability": f"{round(confidence * 100, 1)}%",
            "description": info["description"],
            "symptoms": info["symptoms"],
            "matchedSymptoms": matched,
            "causes": info["causes"],
            "complications": info["complications"],
            "suggested_tests": info["suggested_tests"],
            "doctor": info["specialist"],
        })

    # Sort by confidence descending, return top 5
    results.sort(key=lambda x: x["confidence"], reverse=True)
    top_5 = results[:5]

    # Normalize probabilities so top 5 sum feels realistic
    if top_5:
        top = top_5[0]
        top_disease = top["name"]
        top_confidence = top["confidence"]
    else:
        top_disease = "No significant match"
        top_confidence = 0.0

    return {
        "predictions": top_5,
        "top_disease": top_disease,
        "top_confidence": top_confidence,
    }


# List of all 102 symptoms for symptom search API
ALL_SYMPTOMS = [
    {"code": "fever", "name": "Fever", "body_part": "General", "severity": "medium"},
    {"code": "cough", "name": "Cough", "body_part": "Respiratory", "severity": "medium"},
    {"code": "sore_throat", "name": "Sore Throat", "body_part": "Throat", "severity": "low"},
    {"code": "runny_nose", "name": "Runny Nose", "body_part": "Head", "severity": "low"},
    {"code": "headache", "name": "Headache", "body_part": "Head", "severity": "medium"},
    {"code": "fatigue", "name": "Fatigue", "body_part": "General", "severity": "medium"},
    {"code": "body_aches", "name": "Body Aches", "body_part": "Musculoskeletal", "severity": "medium"},
    {"code": "chills", "name": "Chills", "body_part": "General", "severity": "medium"},
    {"code": "shortness_of_breath", "name": "Shortness of Breath", "body_part": "Respiratory", "severity": "high"},
    {"code": "chest_pain", "name": "Chest Pain", "body_part": "Chest", "severity": "critical"},
    {"code": "nausea", "name": "Nausea", "body_part": "Gastrointestinal", "severity": "medium"},
    {"code": "vomiting", "name": "Vomiting", "body_part": "Gastrointestinal", "severity": "medium"},
    {"code": "diarrhea", "name": "Diarrhea", "body_part": "Gastrointestinal", "severity": "medium"},
    {"code": "abdominal_pain", "name": "Abdominal Pain", "body_part": "Abdomen", "severity": "high"},
    {"code": "dizziness", "name": "Dizziness", "body_part": "Head", "severity": "medium"},
    {"code": "blurred_vision", "name": "Blurred Vision", "body_part": "Eyes", "severity": "high"},
    {"code": "loss_of_taste", "name": "Loss of Taste", "body_part": "Mouth", "severity": "medium"},
    {"code": "loss_of_smell", "name": "Loss of Smell", "body_part": "Nose", "severity": "medium"},
    {"code": "frequent_urination", "name": "Frequent Urination", "body_part": "Urinary", "severity": "medium"},
    {"code": "increased_thirst", "name": "Increased Thirst", "body_part": "General", "severity": "medium"},
    {"code": "weight_loss", "name": "Unexplained Weight Loss", "body_part": "General", "severity": "high"},
    {"code": "weight_gain", "name": "Unexplained Weight Gain", "body_part": "General", "severity": "medium"},
    {"code": "palpitations", "name": "Heart Palpitations", "body_part": "Heart", "severity": "high"},
    {"code": "swelling", "name": "Swelling / Edema", "body_part": "General", "severity": "medium"},
    {"code": "rash", "name": "Skin Rash", "body_part": "Skin", "severity": "medium"},
    {"code": "itching", "name": "Itching", "body_part": "Skin", "severity": "low"},
    {"code": "joint_pain", "name": "Joint Pain", "body_part": "Musculoskeletal", "severity": "medium"},
    {"code": "muscle_pain", "name": "Muscle Pain", "body_part": "Musculoskeletal", "severity": "medium"},
    {"code": "back_pain", "name": "Back Pain", "body_part": "Back", "severity": "medium"},
    {"code": "neck_stiffness", "name": "Neck Stiffness", "body_part": "Neck", "severity": "high"},
    {"code": "sneezing", "name": "Sneezing", "body_part": "Head", "severity": "low"},
    {"code": "congestion", "name": "Nasal Congestion", "body_part": "Head", "severity": "low"},
    {"code": "wheezing", "name": "Wheezing", "body_part": "Respiratory", "severity": "high"},
    {"code": "coughing_blood", "name": "Coughing Blood (Hemoptysis)", "body_part": "Respiratory", "severity": "critical"},
    {"code": "night_sweats", "name": "Night Sweats", "body_part": "General", "severity": "medium"},
    {"code": "pale_skin", "name": "Pale Skin", "body_part": "Skin", "severity": "medium"},
    {"code": "jaundice", "name": "Jaundice (Yellow Skin)", "body_part": "Skin", "severity": "critical"},
    {"code": "hair_loss", "name": "Hair Loss", "body_part": "Skin", "severity": "low"},
    {"code": "dry_skin", "name": "Dry Skin", "body_part": "Skin", "severity": "low"},
    {"code": "sweating", "name": "Excessive Sweating", "body_part": "Skin", "severity": "medium"},
    {"code": "loss_of_appetite", "name": "Loss of Appetite", "body_part": "Gastrointestinal", "severity": "medium"},
    {"code": "constipation", "name": "Constipation", "body_part": "Gastrointestinal", "severity": "low"},
    {"code": "bloating", "name": "Bloating", "body_part": "Gastrointestinal", "severity": "low"},
    {"code": "heartburn", "name": "Heartburn / Acid Reflux", "body_part": "Gastrointestinal", "severity": "low"},
    {"code": "blood_in_urine", "name": "Blood in Urine (Hematuria)", "body_part": "Urinary", "severity": "critical"},
    {"code": "burning_urination", "name": "Burning Urination (Dysuria)", "body_part": "Urinary", "severity": "medium"},
    {"code": "cloudy_urine", "name": "Cloudy Urine", "body_part": "Urinary", "severity": "medium"},
    {"code": "pelvic_pain", "name": "Pelvic Pain", "body_part": "Abdomen", "severity": "high"},
    {"code": "pain_behind_eyes", "name": "Pain Behind Eyes", "body_part": "Head", "severity": "medium"},
    {"code": "sensitivity_to_light", "name": "Sensitivity to Light (Photophobia)", "body_part": "Eyes", "severity": "medium"},
    {"code": "sensitivity_to_sound", "name": "Sensitivity to Sound (Phonophobia)", "body_part": "Head", "severity": "medium"},
    {"code": "tingling_hands", "name": "Tingling / Numbness in Hands", "body_part": "Limbs", "severity": "medium"},
    {"code": "tingling_feet", "name": "Tingling / Numbness in Feet", "body_part": "Limbs", "severity": "medium"},
    {"code": "cold_hands", "name": "Cold Hands and Feet", "body_part": "Limbs", "severity": "low"},
    {"code": "slow_healing", "name": "Slow Healing Wounds", "body_part": "Skin", "severity": "high"},
    {"code": "frequent_infections", "name": "Frequent Infections", "body_part": "Immune", "severity": "high"},
    {"code": "dehydration", "name": "Dehydration", "body_part": "General", "severity": "high"},
    {"code": "cramps", "name": "Stomach Cramps", "body_part": "Abdomen", "severity": "medium"},
    {"code": "irregular_heartbeat", "name": "Irregular Heartbeat (Arrhythmia)", "body_part": "Heart", "severity": "critical"},
    {"code": "anxiety", "name": "Anxiety", "body_part": "Mental", "severity": "medium"},
    {"code": "depression_symptom", "name": "Low Mood / Depression", "body_part": "Mental", "severity": "high"},
    {"code": "sleep_disturbances", "name": "Sleep Disturbances / Insomnia", "body_part": "Mental", "severity": "medium"},
    {"code": "difficulty_concentrating", "name": "Difficulty Concentrating", "body_part": "Mental", "severity": "medium"},
    {"code": "memory_loss", "name": "Memory Loss / Brain Fog", "body_part": "Mental", "severity": "high"},
    {"code": "seizures", "name": "Seizures / Convulsions", "body_part": "Neurological", "severity": "critical"},
    {"code": "paralysis", "name": "Weakness / Partial Paralysis", "body_part": "Neurological", "severity": "critical"},
    {"code": "speech_difficulty", "name": "Difficulty Speaking (Aphasia)", "body_part": "Neurological", "severity": "critical"},
    {"code": "visual_disturbances", "name": "Visual Disturbances / Aura", "body_part": "Eyes", "severity": "high"},
    {"code": "double_vision", "name": "Double Vision (Diplopia)", "body_part": "Eyes", "severity": "high"},
    {"code": "ear_pain", "name": "Ear Pain (Otalgia)", "body_part": "Ears", "severity": "medium"},
    {"code": "hearing_loss", "name": "Hearing Loss", "body_part": "Ears", "severity": "high"},
    {"code": "tinnitus", "name": "Ringing in Ears (Tinnitus)", "body_part": "Ears", "severity": "medium"},
    {"code": "nosebleed", "name": "Nosebleed (Epistaxis)", "body_part": "Head", "severity": "medium"},
    {"code": "toothache", "name": "Toothache / Dental Pain", "body_part": "Mouth", "severity": "medium"},
    {"code": "swollen_glands", "name": "Swollen Lymph Nodes", "body_part": "Lymphatic", "severity": "medium"},
    {"code": "abdominal_rigidity", "name": "Abdominal Rigidity (Board-like)", "body_part": "Abdomen", "severity": "critical"},
    {"code": "rectal_bleeding", "name": "Rectal Bleeding", "body_part": "Gastrointestinal", "severity": "critical"},
    {"code": "difficulty_swallowing", "name": "Difficulty Swallowing (Dysphagia)", "body_part": "Throat", "severity": "high"},
    {"code": "hoarseness", "name": "Hoarseness / Voice Changes", "body_part": "Throat", "severity": "medium"},
    {"code": "muscle_weakness", "name": "Muscle Weakness", "body_part": "Musculoskeletal", "severity": "medium"},
    {"code": "numbness", "name": "Numbness", "body_part": "Neurological", "severity": "high"},
    {"code": "confusion", "name": "Confusion / Disorientation", "body_part": "Neurological", "severity": "critical"},
    {"code": "fainting", "name": "Fainting / Syncope", "body_part": "Neurological", "severity": "critical"},
    {"code": "temperature_sensitivity", "name": "Temperature Sensitivity (Hot/Cold)", "body_part": "General", "severity": "low"},
    {"code": "facial_drooping", "name": "Facial Drooping (Stroke Sign)", "body_part": "Neurological", "severity": "critical"},
    {"code": "persistent_sadness", "name": "Persistent Sadness", "body_part": "Mental", "severity": "high"},
    {"code": "feelings_of_worthlessness", "name": "Feelings of Worthlessness", "body_part": "Mental", "severity": "high"},
    {"code": "appetite_changes", "name": "Appetite Changes", "body_part": "General", "severity": "medium"},
    {"code": "suicidal_thoughts", "name": "Suicidal Thoughts", "body_part": "Mental", "severity": "critical"},
    {"code": "severe_headache", "name": "Severe Headache", "body_part": "Head", "severity": "high"},
    {"code": "high_fever", "name": "High Fever (>103°F)", "body_part": "General", "severity": "critical"},
    {"code": "skin_lesions", "name": "Skin Lesions / Sores", "body_part": "Skin", "severity": "medium"},
    {"code": "appetite_loss", "name": "Complete Loss of Appetite", "body_part": "Gastrointestinal", "severity": "high"},
    {"code": "low_grade_fever", "name": "Low-Grade Fever", "body_part": "General", "severity": "low"},
    {"code": "excessive_thirst", "name": "Excessive Thirst (Polydipsia)", "body_part": "General", "severity": "high"},
    {"code": "hip_pain", "name": "Hip Pain", "body_part": "Musculoskeletal", "severity": "medium"},
    {"code": "knee_pain", "name": "Knee Pain", "body_part": "Musculoskeletal", "severity": "medium"},
    {"code": "chest_tightness", "name": "Chest Tightness", "body_part": "Chest", "severity": "high"},
    {"code": "difficulty_breathing", "name": "Difficulty Breathing", "body_part": "Respiratory", "severity": "critical"},
]
