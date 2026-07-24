DISEASE_SEVERITY = {
    # --- High: life-threatening, organ-damaging, or needs emergency/urgent care ---
    "heart attack": "High",
    "stroke": "High",
    "sepsis": "High",
    "pneumonia": "High",
    "gastrointestinal hemorrhage": "High",
    "acute pancreatitis": "High",
    "cholecystitis": "High",
    "sickle cell crisis": "High",
    "spontaneous abortion": "High",
    "hyperemesis gravidarum": "High",
    "diverticulitis": "High",
    "abdominal aortic aneurysm": "High",
    "appendicitis": "High",
    "pulmonary embolism": "High",
    "pneumothorax": "High",
    "diabetic ketoacidosis": "High",
    "acute kidney injury": "High",

    # --- Medium: needs medical attention, can worsen without treatment ---
    "acute bronchitis": "Medium",
    "bronchitis": "Medium",
    "infectious gastroenteritis": "Medium",
    "noninfectious gastroenteritis": "Medium",
    "gout": "Medium",
    "strep throat": "Medium",
    "injury to the arm": "Medium",
    "injury to the leg": "Medium",
    "liver disease": "Medium",
    "spinal stenosis": "Medium",
    "obstructive sleep apnea (osa)": "Medium",
    "acute bronchiolitis": "Medium",
    "urinary tract infection": "Medium",
    "multiple sclerosis": "Medium",
    "acute stress reaction": "Medium",
    "panic disorder": "Medium",
    "drug reaction": "Medium",
    "depression": "Medium",
    "pyogenic skin infection": "Medium",
    "personality disorder": "Medium",
    "otitis media": "Medium",
    "problem during pregnancy": "Medium",
    "esophagitis": "Medium",
    "peripheral nerve disorder": "Medium",
    "hypoglycemia": "Medium",
    "concussion": "Medium",
    "complex regional pain syndrome": "Medium",
    "anxiety": "Medium",
    "asthma": "Medium",
    "flu": "Medium",
    "marijuana abuse": "Medium",
    "benign prostatic hyperplasia (bph)": "Medium",

    # --- Low: usually self-limiting or manageable at home ---
    "common cold": "Low",
    "allergy": "Low",
    "seasonal allergies (hay fever)": "Low",
    "cystitis": "Low",
    "vulvodynia": "Low",
    "nose disorder": "Low",
    "spondylosis": "Low",
    "conjunctivitis due to allergy": "Low",
    "vaginal cyst": "Low",
    "fungal infection of the hair": "Low",
    "sprain or strain": "Low",
    "arthritis of the hip": "Low",
    "bursitis": "Low",
    "eczema": "Low",
    "dental caries": "Low",
    "chronic constipation": "Low",
    "sebaceous cyst": "Low",
    "psoriasis": "Low",
    "developmental disability": "Low",
    "vaginitis": "Low",
    "actinic keratosis": "Low",
    "degenerative disc disease": "Low",
    "macular degeneration": "Low",
    "contact dermatitis": "Low",
}

SEVERITY_SCORE = {
    "High": 50,
    "Medium": 30,
    "Low": 10,
}

# Medical conditions that increase risk when combined with any diagnosis
RISK_MODIFYING_CONDITIONS = {
    "diabetes",
    "hypertension",
    "heart disease",
    "asthma",
    "obesity",
    "chronic kidney disease",
}


def calculate_risk(data):
    score = 0

    # 1. Disease severity — the primary driver of risk
    disease_key = (data.predicted_disease or "").lower().strip()
    severity = DISEASE_SEVERITY.get(disease_key, "Medium")  # unknown disease -> assume Medium, don't silently ignore
    score += SEVERITY_SCORE[severity]

    # 2. Prediction confidence — a confident high-severity prediction matters more
    if data.prediction_confidence is not None:
        if data.prediction_confidence >= 0.7:
            score += 15
        elif data.prediction_confidence >= 0.4:
            score += 5

    # 3. Age — older patients are more vulnerable to complications
    if data.age >= 60:
        score += 20
    elif data.age >= 40:
        score += 10

    # 4. Existing medical conditions — each relevant condition raises risk
    conditions = {c.lower().strip() for c in data.medical_conditions}
    matching_conditions = conditions & RISK_MODIFYING_CONDITIONS
    score += 10 * len(matching_conditions)

    # 5. Blood pressure — standard clinical thresholds (AHA/ACC staging)
    bp_flag = None
    if data.systolic_bp is not None and data.diastolic_bp is not None:
        if data.systolic_bp >= 180 or data.diastolic_bp >= 120:
            score += 30
            bp_flag = "Hypertensive Crisis"
        elif data.systolic_bp >= 140 or data.diastolic_bp >= 90:
            score += 15
            bp_flag = "High Blood Pressure"
        elif data.systolic_bp < 90 or data.diastolic_bp < 60:
            score += 15
            bp_flag = "Low Blood Pressure"

    # 6. Blood sugar — standard clinical thresholds (mg/dL)
    sugar_flag = None
    if data.blood_sugar_level is not None:
        if data.blood_sugar_level >= 250:
            score += 25
            sugar_flag = "Very High Blood Sugar"
        elif data.blood_sugar_level >= 126:
            score += 15
            sugar_flag = "High Blood Sugar"
        elif data.blood_sugar_level < 70:
            score += 20
            sugar_flag = "Low Blood Sugar (Hypoglycemia)"

    # Classify total score
    if score >= 70:
        risk_level = "High"
    elif score >= 40:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    recommendations = []
    if risk_level == "High":
        recommendations.append("Seek immediate medical attention.")
    elif risk_level == "Medium":
        recommendations.append("Consult a doctor soon.")
    else:
        recommendations.append("Rest and monitor your symptoms.")

    return {
        "disease_severity": severity,
        "risk_score": score,
        "risk_level": risk_level,
        "recommendations": recommendations,
        "blood_pressure_flag": bp_flag,
        "blood_sugar_flag": sugar_flag,
    }