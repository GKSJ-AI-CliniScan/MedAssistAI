# Risk Assessment Module - MedAssist AI

Production-ready FastAPI Risk Assessment module for the **MedAssist AI** Medical Symptom Analysis & Patient Health Risk Assessment System.

This module evaluates patient health risk using a **modular, service-based architecture**. It combines an **XGBoost Classifier Machine Learning model** (trained on 14 CDC BRFSS features) with internal outputs from the **Disease Prediction API** (`POST /api/history/check`) through a dedicated **Clinical Decision Layer**.

---

## 📁 Module Directory Structure

```text
backend/
├── app/
│   ├── config/                         # System Configuration & Settings
│   │   ├── __init__.py
│   │   └── settings.py                 # API URLs, timeouts, model artifact paths
│   │
│   ├── datasets/                       # Training Data
│   │   └── BRFSS2024.csv               # CDC BRFSS 2024 primary dataset (~422MB)
│   │
│   ├── models/                         # Trained ML Artifacts
│   │   └── risk_model.pkl              # Saved XGBoost ML model payload
│   │
│   ├── routes/                         # API Endpoints & FastAPI Routers
│   │   ├── health.py                   # Health check router
│   │   └── risk_assessment.py          # /risk-assessment endpoint router
│   │
│   ├── schemas/                        # Pydantic Schemas & Data Validation
│   │   ├── __init__.py
│   │   ├── patient.py                  # RiskAssessmentRequest (BRFSS + symptoms)
│   │   └── response.py                 # RiskAssessmentResponse (strict public API output)
│   │
│   ├── services/                       # Modular Service Architecture
│   │   ├── __init__.py
│   │   ├── decision_engine.py          # Decision Layer combining ML + Disease outputs
│   │   ├── prediction_client.py        # Resilient HTTP client for Disease Prediction API
│   │   ├── preprocessing.py            # BRFSS feature mapping & artifact loader
│   │   └── risk_service.py             # XGBoost ML risk model inference
│   │
│   ├── utils/                          # Logging & Utilities
│   │   ├── __init__.py
│   │   └── logger.py                   # Structured logger setup
│   │
│   └── main.py                         # FastAPI App Initialization & OpenAPI metadata
│
├── scripts/
│   └── train_risk_model.py             # Automated ML training & model comparison script
│
└── tests/
    └── test_risk_assessment.py         # Comprehensive unit & integration test suite
```

---

## ⚙️ Service-Based Architecture

```text
               Patient Request (Symptoms + BRFSS Features)
                                 │
                                 ▼
                     POST /risk-assessment API
                                 │
          ┌──────────────────────┴──────────────────────┐
          │                                             │
          ▼                                             ▼
  PredictionClient                              RiskService & Preprocessing
  Calls POST /api/history/check                 Preprocesses 14 BRFSS features
  Receives:                                     Runs XGBoost ML Model
    - predicted_disease                         Receives:
    - prediction_confidence                       - ml_risk_probability
          │                                             │
          └──────────────────────┬──────────────────────┘
                                 │
                                 ▼
                           DecisionEngine
            (Combines ML risk & Disease output internally)
            Calculates:
              - risk_score
              - risk_level
              - severity
              - emergency_alert
              - recommendations
                                 │
                                 ▼
             Final RiskAssessmentResponse (Strict Schema)
             (Hides predicted_disease & prediction_confidence)
```

### Module Responsibilities

1. **`prediction_client.py`**:
   - Calls `POST /api/history/check` with patient symptoms.
   - Extracts `predicted_disease` and `prediction_confidence`.
   - Handles network errors and timeouts gracefully with default fallbacks `("Unknown", 0.0)`.

2. **`preprocessing.py`**:
   - Loads and caches `risk_model.pkl` artifact.
   - Maps 14 patient-friendly request fields into CDC BRFSS column names (`_AGE80`, `_SEX`, `_BMI5`, `GENHLTH`, `PHYSHLTH`, `MENTHLTH`, `EXERANY2`, `SMOKE100`, `DRNKANY6`, `DIABETE4`, `HAVARTH4`, `ASTHMA3`, `CHCCOPD3`, `CHCKDNY2`).
   - Transforms features using saved `imputer`.

3. **`risk_service.py`**:
   - Executes `model.predict_proba()` and `model.predict()` on the trained XGBoost model.
   - Computes ML `risk_probability` strictly from patient BRFSS features.

4. **`decision_engine.py` (Decision Layer)**:
   - Combines ML risk probability with internal disease prediction outputs.
   - Does **not** change the ML `risk_probability` prediction.
   - Evaluates `emergency_alert` status, composite `risk_score` (0-100), `risk_level` ('High', 'Medium', 'Low'), `severity` ('Mild', 'Moderate', 'Severe', 'Critical'), and synthesizes clinical `recommendations`.

---

## 📡 API Specification

### `POST /risk-assessment`

Evaluates comprehensive patient health risk via the service architecture. Accepts patient symptoms and 14 CDC BRFSS features, and returns the final risk evaluation payload.

#### Request Payload Schema (`RiskAssessmentRequest`)

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
  "physical_health": 5,
  "symptoms": ["chest_pain", "shortness_of_breath"]
}
```

#### Response Payload Schema (`RiskAssessmentResponse`)

```json
{
  "risk_probability": 0.87,
  "risk_score": 87,
  "risk_level": "High",
  "severity": "Severe",
  "emergency_alert": true,
  "recommendations": [
    "URGENT: Seek immediate emergency medical care or visit the nearest emergency department.",
    "Consult a healthcare professional or specialist immediately for comprehensive diagnostic evaluation."
  ]
}
```

*Note: Internal disease prediction parameters (`predicted_disease` and `prediction_confidence`) are processed strictly inside the Decision Layer and are **not** exposed in the public API response.*

---

## 🧪 Testing & Verification Guide

### Method 1: Run Automated Test Suite
Runs all 11 unit & integration tests covering preprocessing, ML inference, Disease Prediction API resilience, Decision Layer evaluation, and API schema compliance:

```bash
cd backend
python -m unittest discover -s tests
```

### Method 2: Start Development Server & Interactive OpenAPI Docs
1. Launch the FastAPI server:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --port 8000
   ```
2. Open Swagger UI in browser: **http://localhost:8000/docs**
3. Navigate to `POST /risk-assessment`, click **Try it out**, paste a request payload, and click **Execute**.

### Method 3: Test via PowerShell / cURL Command
With the server running on `localhost:8000`:

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/risk-assessment" -Method Post -ContentType "application/json" -Body '{
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
  "physical_health": 5,
  "symptoms": ["chest_pain", "shortness_of_breath"]
}'
```
