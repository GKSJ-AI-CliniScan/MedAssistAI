"""
MedAssist AI – Risk Assessment Engine
Evaluates patient vitals, lifestyle, and symptom severity to produce:
  • Risk Score (0–100)
  • Health Score (0–100)
  • Risk Level (Low / Medium / High / Critical)
  • Emergency Alert flag
  • Detailed risk factors breakdown
"""
import datetime
from typing import List, Dict, Any, Optional

EMERGENCY_SYMPTOMS = {
    "chest_pain", "chest pain", "shortness of breath", "shortness_of_breath",
    "difficulty breathing", "difficulty_breathing", "fainting", "seizures",
    "paralysis", "speech_difficulty", "facial_drooping", "coughing_blood",
    "suicidal_thoughts", "confusion", "irregular_heartbeat",
    "abdominal_rigidity", "rectal_bleeding", "high_fever", "jaundice",
    "blood_in_urine", "blood in urine",
}

SEVERITY_SCORE_MAP = {
    "mild": 10,
    "moderate": 25,
    "severe": 50,
    "critical": 80,
}


def assess_risk(
    symptoms: List[str],
    severity: str = "mild",
    duration: int = 3,
    patient: Optional[Any] = None,
) -> Dict[str, Any]:
    """
    Produces a comprehensive risk assessment for a patient.
    patient is a Patient ORM instance (optional – uses defaults if None).
    """
    symptom_lower = [s.lower().strip() for s in symptoms]
    factors: List[Dict[str, str]] = []
    risk_score = 0.0

    # ── 1. Emergency symptom check ──────────────────────────────────────
    emergency_matches = [s for s in symptom_lower if s in EMERGENCY_SYMPTOMS or any(e in s for e in EMERGENCY_SYMPTOMS)]
    emergency_alert = len(emergency_matches) > 0

    if emergency_alert:
        risk_score += 30
        factors.append({
            "label": "Emergency Symptoms Detected",
            "value": ", ".join(emergency_matches[:3]),
            "status": "critical",
            "color": "#ef4444",
        })

    # ── 2. Severity modifier ─────────────────────────────────────────────
    severity_score = SEVERITY_SCORE_MAP.get(severity, 10)
    risk_score += severity_score
    factors.append({
        "label": "Symptom Severity",
        "value": severity.capitalize(),
        "status": "critical" if severity_score >= 50 else "warning" if severity_score >= 25 else "normal",
        "color": "#ef4444" if severity_score >= 50 else "#f59e0b" if severity_score >= 25 else "#22c55e",
    })

    # ── 3. Duration modifier ─────────────────────────────────────────────
    if duration > 14:
        risk_score += 15
        dur_status = "warning"
        dur_color = "#f59e0b"
    elif duration > 7:
        risk_score += 8
        dur_status = "warning"
        dur_color = "#f59e0b"
    else:
        dur_status = "normal"
        dur_color = "#22c55e"
    factors.append({
        "label": "Symptom Duration",
        "value": f"{duration} day(s)",
        "status": dur_status,
        "color": dur_color,
    })

    # ── 4. Symptom count risk ────────────────────────────────────────────
    symptom_count = len(symptoms)
    if symptom_count >= 6:
        risk_score += 15
        sym_status = "warning"
        sym_color = "#f59e0b"
    elif symptom_count >= 3:
        risk_score += 5
        sym_status = "normal"
        sym_color = "#22c55e"
    else:
        sym_status = "normal"
        sym_color = "#22c55e"
    factors.append({
        "label": "Number of Symptoms",
        "value": str(symptom_count),
        "status": sym_status,
        "color": sym_color,
    })

    # ── 5. Patient vital sign risk (if patient profile available) ────────
    if patient:
        # Blood pressure
        systolic = getattr(patient, "bp_systolic", 120)
        diastolic = getattr(patient, "bp_diastolic", 80)
        if systolic >= 180 or diastolic >= 120:
            risk_score += 20
            bp_status, bp_color = "critical", "#ef4444"
        elif systolic >= 140 or diastolic >= 90:
            risk_score += 10
            bp_status, bp_color = "warning", "#f59e0b"
        else:
            bp_status, bp_color = "normal", "#22c55e"
        factors.append({
            "label": "Blood Pressure",
            "value": f"{systolic}/{diastolic} mmHg",
            "status": bp_status,
            "color": bp_color,
        })

        # Blood sugar
        sugar = getattr(patient, "fasting_sugar", 90)
        if sugar >= 200:
            risk_score += 20
            sugar_status, sugar_color = "critical", "#ef4444"
        elif sugar >= 126:
            risk_score += 10
            sugar_status, sugar_color = "warning", "#f59e0b"
        else:
            sugar_status, sugar_color = "normal", "#22c55e"
        factors.append({
            "label": "Fasting Blood Sugar",
            "value": f"{sugar} mg/dL",
            "status": sugar_status,
            "color": sugar_color,
        })

        # BMI
        bmi = getattr(patient, "bmi", 22.0)
        if bmi >= 40:
            risk_score += 15
            bmi_status, bmi_color = "critical", "#ef4444"
        elif bmi >= 30:
            risk_score += 8
            bmi_status, bmi_color = "warning", "#f59e0b"
        elif bmi < 18.5:
            risk_score += 5
            bmi_status, bmi_color = "warning", "#f59e0b"
        else:
            bmi_status, bmi_color = "normal", "#22c55e"
        factors.append({
            "label": "BMI",
            "value": f"{bmi:.1f}",
            "status": bmi_status,
            "color": bmi_color,
        })

        # Smoking
        smoking = getattr(patient, "smoking", "Non-smoker")
        if "heavy" in smoking.lower():
            risk_score += 10
            sm_status, sm_color = "critical", "#ef4444"
        elif "light" in smoking.lower() or "occasional" in smoking.lower():
            risk_score += 5
            sm_status, sm_color = "warning", "#f59e0b"
        else:
            sm_status, sm_color = "normal", "#22c55e"
        factors.append({
            "label": "Smoking Status",
            "value": smoking,
            "status": sm_status,
            "color": sm_color,
        })

        # Age
        age = getattr(patient, "age", 30)
        if age >= 65:
            risk_score += 10
            age_status, age_color = "warning", "#f59e0b"
        elif age >= 50:
            risk_score += 5
            age_status, age_color = "normal", "#22c55e"
        else:
            age_status, age_color = "normal", "#22c55e"
        factors.append({
            "label": "Age",
            "value": f"{age} years",
            "status": age_status,
            "color": age_color,
        })
    else:
        # Defaults when no patient profile
        factors.append({"label": "Blood Pressure", "value": "Not assessed", "status": "normal", "color": "#94a3b8"})
        factors.append({"label": "BMI", "value": "Not assessed", "status": "normal", "color": "#94a3b8"})

    # ── 6. Clamp risk score and derive outputs ───────────────────────────
    risk_score = min(round(risk_score, 1), 100)
    health_score = round(max(100 - risk_score, 0), 1)

    if risk_score >= 70:
        risk_level = "Critical"
        severity_indicator = "CRITICAL – Immediate Medical Attention Required"
        message = "⚠️ CRITICAL RISK: Your symptom pattern and vitals indicate a serious medical emergency. Please seek immediate medical care or call emergency services."
    elif risk_score >= 50:
        risk_level = "High"
        severity_indicator = "HIGH – Consult a Doctor Today"
        message = "🔴 HIGH RISK: Your symptoms suggest a potentially serious condition. We strongly recommend consulting a physician today."
    elif risk_score >= 25:
        risk_level = "Medium"
        severity_indicator = "MEDIUM – Monitor and Consult if Worsening"
        message = "🟡 MODERATE RISK: Your symptoms indicate a moderate health concern. Monitor closely and consult a doctor if symptoms worsen or persist beyond 3–5 days."
    else:
        risk_level = "Low"
        severity_indicator = "LOW – Self-Care Recommended"
        message = "🟢 LOW RISK: Your current symptoms appear mild. Rest, hydration, and over-the-counter remedies are recommended. Consult a doctor if symptoms persist."

    return {
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "healthScore": health_score,
        "severityIndicator": severity_indicator,
        "emergencyAlert": emergency_alert,
        "message": message,
        "factors": factors,
        "evaluatedAt": datetime.datetime.utcnow().isoformat(),
    }
