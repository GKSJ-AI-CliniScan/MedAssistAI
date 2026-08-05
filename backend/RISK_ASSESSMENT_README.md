# Risk Assessment Module - MedAssist AI

Production-ready FastAPI Risk Assessment module for the **MedAssist AI** Medical Symptom Analysis & Disease Prediction System.

This module evaluates patient health risk strictly using a **Machine Learning model** (trained and selected between **XGBoost Classifier** and **Random Forest Classifier**) trained on 14 patient-friendly clinical features from the **CDC BRFSS 2024 (Behavioral Risk Factor Surveillance System)** dataset.

---

## 📁 Module Directory Structure

```text
backend/
├── app/
│   ├── datasets/                       # Training Data
│   │   └── BRFSS2024.csv               # CDC BRFSS 2024 primary dataset (~422MB)
│   │
│   ├── models/                         # Trained ML Artifacts
│   │   └── risk_model.pkl              # Saved XGBoost / Random Forest payload
│   │
│   ├── schemas/                        # Pydantic Schemas & Data Validation
│   │   ├── __init__.py
│   │   └── patient.py                  # RiskAssessmentRequest & RiskAssessmentResponse models
│   │
│   ├── services/                       # Machine Learning Risk Pipeline
│   │   ├── __init__.py
│   │   └── risk_service.py             # Pure ML feature extraction, model loading & prediction
│   │
│   ├── utils/                          # Logging & Utilities
│   │   ├── __init__.py
│   │   └── logger.py                   # Formatted console logger setup
│   │
│   ├── routes/                         # API Endpoints & FastAPI Routers
│   │   ├── health.py                   # Health check router
│   │   └── risk_assessment.py          # /risk-assessment endpoint router
│   │
│   └── main.py                         # FastAPI App Initialization & OpenAPI metadata
│
├── scripts/
│   └── train_risk_model.py             # Automated ML training & model comparison script
│
└── tests/
    └── test_risk_assessment.py         # Unit & integration test suite
```

---

## ⚙️ Pure ML Machine Learning Architecture

The module computes patient health risk strictly through an ML inference pipeline with **zero rule-based scoring or hardcoded constants**:

### 1. Multi-Disease Composite Target Creation (`Risk_Level`)
The model is trained on a composite target derived from 7 chronic disease survey variables:
- `DIABETE4`: Diabetes status
- `CVDINFR4`: Heart Attack / Myocardial Infarction
- `CVDCRHD4`: Coronary Heart Disease / Angina
- `CVDSTRK3`: Stroke
- `CHCKDNY2`: Kidney Disease
- `CHCCOPD3`: COPD / Chronic Bronchitis
- `ASTHMA3`: Asthma

Target Labels:
- `0` (**Low Risk**): 0 chronic conditions
- `1` (**Medium Risk**): 1 chronic condition
- `2` (**High Risk**): Major cardiovascular event OR 2+ chronic conditions

### 2. Patient-Friendly Input Features (14 Features)
The API accepts 14 patient-friendly clinical and lifestyle inputs:
- `_AGE80`: Age in years (`age`)
- `_SEX`: Biological sex (`gender`: 1=Male, 0=Female)
- `_BMI5`: Body Mass Index (`bmi`)
- `GENHLTH`: General health status (`general_health`: 1=Excellent to 5=Poor)
- `PHYSHLTH`: Days physical health not good (`physical_health`: 0-30)
- `MENTHLTH`: Days mental health not good (`mental_health`: 0-30)
- `EXERANY2`: Exercise in past 30 days (`exercise`: 1=Yes, 0=No)
- `SMOKE100`: Smoked 100+ cigarettes in lifetime (`smoking`: 1=Yes, 0=No)
- `DRNKANY6`: Alcohol consumption (`alcohol`: 1=Yes, 0=No)
- `DIABETE4`: Diabetes diagnosis (`diabetes`: 1=Yes, 0=No)
- `HAVARTH4`: Arthritis diagnosis (`arthritis`: 1=Yes, 0=No)
- `ASTHMA3`: Asthma diagnosis (`asthma`: 1=Yes, 0=No)
- `CHCCOPD3`: COPD diagnosis (`copd`: 1=Yes, 0=No)
- `CHCKDNY2`: Kidney disease diagnosis (`kidney_disease`: 1=Yes, 0=No)

### 3. Dual Model Training & Automated Selection
Both **Random Forest** and **XGBoost** models are trained and evaluated:
- **Random Forest Classifier**: Accuracy `89.46%`, Macro F1 `0.8395`
- **XGBoost Classifier**: Accuracy `90.91%`, Macro F1 `0.8441`
- **Selected Model**: **XGBoost Classifier** saved to `app/models/risk_model.pkl`

---

## 📡 API Specification

### `POST /risk-assessment`

Evaluates comprehensive patient health risk via the ML model and returns prediction details, risk score, severity, risk level, and clinical recommendations.

#### Request Body Schema (`RiskAssessmentRequest`)

```json
{
  "age": 65,
  "gender": 1,
  "bmi": 28.5,
  "general_health": 3,
  "exercise": 1,
  "smoking": 0,
  "alcohol": 1,
  "diabetes": 1,
  "arthritis": 1,
  "asthma": 0,
  "copd": 0,
  "kidney_disease": 0,
  "mental_health": 2,
  "physical_health": 5
}
```

#### Response Payload Schema (`RiskAssessmentResponse`)

```json
{
  "risk_probability": 0.74,
  "risk_level": "Medium",
  "risk_score": 74,
  "severity": "Moderate",
  "recommendations": [
    "Monitor health and consult a physician if symptoms persist."
  ]
}
```

---

## 🧪 Testing & Execution

### Run ML Training Pipeline
```bash
cd backend
python scripts/train_risk_model.py
```

### Run Automated Test Suite
```bash
cd backend
python -m unittest discover -s tests
```
