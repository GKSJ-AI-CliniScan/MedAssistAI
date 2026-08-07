# MedAssistAI Backend

MedAssistAI is a production-ready, AI-powered healthcare FastAPI backend application for disease prediction, health risk assessment, symptom severity analysis, medical recommendations, report generation, and healthcare system analytics.

The system supports three user roles:
- **Patient**: Register/login, manage health profile, submit symptoms for AI disease prediction, view risk level & emergency severity, download formatted health reports, schedule doctor appointments.
- **Doctor**: Manage professional profile & availability, review patient prediction reports, attach clinical notes, manage scheduled appointments.
- **Admin**: System-wide monitoring, user management, appointment oversight, disease distribution & health analytics.

---

## Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (with SQLAlchemy ORM & automatic SQLite dev fallback)
- **Authentication**: JWT (JSON Web Tokens) with OAuth2 Bearer scheme & Passlib (bcrypt)
- **Machine Learning**: Scikit-Learn, XGBoost, LightGBM (`voting_classifier_rf_xgb_lgb.pkl` ensemble model)
- **Validation**: Pydantic v2
- **Containerization**: Docker & Docker Compose
- **Documentation**: Swagger UI (`/docs`) & ReDoc (`/redoc`)

---

## Project Structure

```
backend/
├── .env
├── .gitignore
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── README.md
│
└── app/
    ├── main.py
    │
    ├── config/
    │   └── settings.py
    │
    ├── database/
    │   ├── database.py
    │   ├── session.py
    │   └── init_db.py
    │
    ├── models/
    │   ├── user.py
    │   ├── patient.py
    │   ├── doctor.py
    │   ├── appointment.py
    │   ├── symptom.py
    │   ├── report.py
    │   └── __init__.py
    │
    ├── schemas/
    │   ├── user_schema.py
    │   ├── patient_schema.py
    │   ├── doctor_schema.py
    │   ├── appointment_schema.py
    │   ├── symptom_schema.py
    │   ├── prediction_schema.py
    │   ├── report_schema.py
    │   └── __init__.py
    │
    ├── routers/
    │   ├── home.py
    │   ├── auth.py
    │   ├── patient.py
    │   ├── doctor.py
    │   ├── appointment.py
    │   ├── symptom.py
    │   ├── prediction_router.py
    │   ├── report_router.py
    │   ├── analytics_router.py
    │   └── __init__.py
    │
    ├── services/
    │   ├── user_service.py
    │   ├── patient_service.py
    │   ├── doctor_service.py
    │   ├── appointment_service.py
    │   ├── symptom_service.py
    │   ├── prediction_service.py
    │   ├── recommendation_service.py
    │   ├── health_risk_service.py
    │   ├── report_service.py
    │   ├── analytics_service.py
    │   └── __init__.py
    │
    ├── ml/
    │   ├── voting_classifier_rf_xgb_lgb.pkl
    │   ├── model_loader.py
    │   ├── preprocessing.py
    │   ├── predictor.py
    │   ├── risk_assessment.py
    │   ├── severity_analysis.py
    │   └── __init__.py
    │
    └── utils/
        ├── auth_handler.py
        ├── jwt_handler.py
        ├── password.py
        ├── role_checker.py
        ├── logger.py
        └── __init__.py
```

---

## Setup & Local Installation

### 1. Prerequisites
- Python 3.11 or higher
- PostgreSQL (optional for local testing; SQLite fallback enabled by default)

### 2. Environment Setup
Create a virtual environment and install dependencies:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Run Application Locally
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger API documentation will be available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Running with Docker & Docker Compose

To start the complete production stack (FastAPI Backend + PostgreSQL database):
```bash
docker-compose up --build -d
```
The backend container will automatically wait for PostgreSQL healthchecks before initializing database tables and serving requests on port 8000.

---

## Internship Milestones Completed

### Milestone 1: Authentication, Core Database Models & CRUD APIs
- **Auth**: User registration, login, password hashing (bcrypt), JWT access tokens, role-based authorization (`patient`, `doctor`, `admin`).
- **Models**: `User`, `Patient`, `Doctor`, `Appointment`, `Symptom`, `Report` with foreign key constraints & relationships.
- **APIs**: User auth, patient profile CRUD, doctor directory & availability, appointment scheduling, symptom catalog lookup.

### Milestone 2: ML Model Integration & Disease Prediction Pipeline
- Integrated real trained ensemble model (`voting_classifier_rf_xgb_lgb.pkl` combining RandomForest, XGBoost, and LightGBM).
- **Preprocessing**: Symptom normalization & mapping to 377 model features.
- **Prediction**: Confidence percentage calculation, risk level assessment (Low/Medium/High), symptom severity scoring & emergency detection.
- **API**: `POST /predict`.

### Milestone 3: Recommendation Engine, Health Reports & Analytics
- **Recommendation Engine**: Categorized treatment suggestions, precautions, and lifestyle guidelines.
- **Health Reports**: Report auto-saving, retrieval, doctor clinical notes attachment, printable formatted `.txt` report download.
- **Analytics**: System overview counters, appointment breakdown, disease distribution stats.

### Milestone 4: Production Deployment & Verification
- Multi-stage Docker containerization and Docker Compose orchestration.
- 100% end-to-end automated test suites executed across all milestone features.
