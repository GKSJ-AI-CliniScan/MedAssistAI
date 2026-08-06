# MedAssist AI - Medical Symptom Analysis & Patient Risk Assessment System

Production-ready medical application backend providing patient health risk assessment and symptom analysis services.

---

## 🚀 Overview

MedAssist AI refactors patient risk evaluation into a modular, production-ready **Service-Based Architecture**. It integrates CDC BRFSS Machine Learning risk prediction with internal outputs from the Disease Prediction API (`POST /api/history/check`) through a clinical **Decision Layer**.

---

## 📁 Repository Structure

```text
MedAssist AI/
├── backend/
│   ├── app/
│   │   ├── config/                     # Application settings & endpoints
│   │   ├── models/                     # Trained XGBoost ML artifacts
│   │   ├── routes/                     # FastAPI API routers (/risk-assessment)
│   │   ├── schemas/                    # Pydantic request & response models
│   │   ├── services/                   # Service layer (risk_service, prediction_client, decision_engine, preprocessing)
│   │   └── utils/                      # Logging & utility modules
│   ├── scripts/                        # Model training scripts
│   ├── tests/                          # Automated unit and integration test suite
│   ├── RISK_ASSESSMENT_README.md       # Detailed Risk Assessment Module Documentation
│   └── requirements.txt
└── README.md                           # Main Project Readme
```

---

## ⚡ Quickstart & Verification

### 1. Run Automated Test Suite
```bash
cd backend
python -m unittest discover -s tests
```

### 2. Start Local Development Server
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
Access Interactive Swagger Documentation: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 📚 Detailed Documentation

For full architectural details, service responsibilities, and API schemas, see the [Risk Assessment Module Readme](backend/RISK_ASSESSMENT_README.md).
