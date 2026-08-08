# 🩺 MedAssist AI

## 🤖 Machine Learning Pipeline & System Integration

<p align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-ML-189A3D?style=for-the-badge)
![LightGBM](https://img.shields.io/badge/LightGBM-ML-8BC34A?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</p>

---

## 📌 Overview

**MedAssist AI** is an AI-powered healthcare platform designed to assist patients and healthcare professionals through symptom screening, disease prediction, risk assessment, personalized recommendations, health reports, appointments, and analytics.

The application combines a **React frontend**, **FastAPI backend**, **PostgreSQL database**, and **machine learning pipeline** to provide an integrated healthcare management workflow.

This repository contains the backend and machine learning work completed for **Milestone 3**, including the ML pipeline, backend API development, healthcare modules, and system integration.

---

# 🚀 Key Features

| Module | Description |
|---|---|
| 🔐 Authentication | JWT-based authentication and role-based authorization |
| 👤 Patient Management | Patient profile and patient information management |
| 👨‍⚕️ Doctor Management | Doctor profile and availability management |
| 📅 Appointments | Appointment scheduling and status management |
| 🧬 Symptom Dictionary | Supported symptom management |
| 🧠 Disease Prediction | AI-based disease prediction from symptoms |
| ⚠️ Risk Assessment | Health risk evaluation |
| 📊 Severity Analysis | Severity and emergency assessment |
| 📋 Health Reports | Medical report history and report management |
| 📈 Analytics | System and disease prediction analytics |
| 🐳 Docker | Containerization and deployment support |

---

# 🧠 Disease Prediction Pipeline

The disease prediction system follows the complete workflow below:

```text
User Symptoms
      ↓
Symptom Validation
      ↓
Preprocessing
      ↓
Feature Extraction
      ↓
Voting Classifier
      ↓
Disease Class Prediction
      ↓
Disease Name Mapping
      ↓
Risk Assessment
      ↓
Severity Analysis
      ↓
Medical Recommendation
      ↓
Health Report

🛠️ Technology Stack

| Technology               | Purpose                          |
| ------------------------ | -------------------------------- |
| 🐍 **Python 3.10+**      | Backend and ML development       |
| ⚡ **FastAPI**            | REST API development             |
| 🗄️ **PostgreSQL**       | Database management              |
| 🔗 **SQLAlchemy**        | ORM and database operations      |
| 📦 **Pydantic**          | Request and response validation  |
| 🔐 **JWT**               | Authentication and authorization |
| 🧠 **Scikit-learn**      | Machine learning                 |
| 🚀 **XGBoost**           | Machine learning model           |
| 💡 **LightGBM**          | Machine learning model           |
| 🤖 **Voting Classifier** | Ensemble disease prediction      |
| ⚙️ **Uvicorn**           | FastAPI application server       |
| 🐳 **Docker**            | Containerization                 |
| 📖 **Swagger / OpenAPI** | API testing and documentation    |


📂 Complete Backend Structure
backend/
│
├── app/
│   │
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── disease_mapping.py
│   │   ├── extracted_features.py
│   │   ├── model_loader.py
│   │   ├── predictor.py
│   │   ├── preprocessing.py
│   │   ├── risk_assessment.py
│   │   └── severity_analysis.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── doctor.py
│   │   ├── appointment.py
│   │   ├── report.py
│   │   └── symptom.py
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── home.py
│   │   ├── patient.py
│   │   ├── doctor.py
│   │   ├── appointment.py
│   │   ├── symptom.py
│   │   ├── prediction_router.py
│   │   ├── report_router.py
│   │   └── analytics_router.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user_schema.py
│   │   ├── patient_schema.py
│   │   ├── doctor_schema.py
│   │   ├── appointment_schema.py
│   │   ├── symptom_schema.py
│   │   ├── prediction_schema.py
│   │   └── report_schema.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   ├── patient_service.py
│   │   ├── doctor_service.py
│   │   ├── appointment_service.py
│   │   ├── symptom_service.py
│   │   ├── prediction_service.py
│   │   ├── report_service.py
│   │   ├── analytics_service.py
│   │   ├── health_risk_service.py
│   │   └── recommendation_service.py
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── auth_handler.py
│   │   ├── jwt_handler.py
│   │   ├── role_checker.py
│   │   └── logger.py
│   │
│   ├── config/
│   │   └── settings.py
│   │
│   ├── database/
│   │   ├── database.py
│   │   ├── init_db.py
│   │   └── session.py
│   │
│   └── main.py
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .gitignore
└── README.md

🔌 Backend API Modules
🔐 Authentication
POST /auth/register
POST /auth/login
GET  /auth/me
Provides user registration, login, JWT token generation, and authenticated user information.
Supports:
Patient
Doctor
Admin

👤 Patient Operations
GET /patient/profile
PUT /patient/profile
GET /patient/all
Provides patient profile management and authorized patient information access.

👨‍⚕️ Doctor Operations
GET /doctor/profile
PUT /doctor/profile
GET /doctor/all
Provides doctor profile management, availability updates, and doctor listing.

📅 Appointments
POST /appointments
GET  /appointments/my
PUT  /appointments/{id}/status
GET  /appointments/all
Patients can schedule appointments, while doctors and administrators can manage appointment status and monitor appointments according to their roles.

🧬 Symptom Dictionary
GET  /symptoms
POST /symptoms
Provides the supported symptom list used by the disease prediction system.
Administrators can add new symptoms when required.

🧠 Disease Prediction
POST /predict
Processes patient symptoms through the machine learning pipeline and returns the predicted disease together with health assessment information.

📋 Health Reports
GET /reports/my
GET /reports/patient/{patient_id}
GET /reports/{id}
PUT /reports/{id}/notes
GET /reports/{id}/download
Provides:
Patient report history
Detailed medical reports
Doctor notes
Medical recommendations
Printable report downloads

📊 Analytics & Monitoring
GET /analytics/summary
GET /analytics/diseases
Provides system overview statistics and disease prediction distribution.

🔐 Authentication & Authorization
MedAssist AI uses JWT-based authentication.
After successful login:

User Login
    ↓
Credentials Validation
    ↓
JWT Access Token
    ↓
Role Verification
    ↓
Protected API Access
Role-based authorization ensures that users can access only the functionality permitted for their role.

🗄️ Database
The backend uses PostgreSQL with SQLAlchemy ORM.
The database manages:
Users
Patients
Doctors
Appointments
Symptoms
Health Reports

🐳 Docker Support
Docker configuration is included through:
Dockerfile
docker-compose.yml
Build and run:
docker compose up --build
Stop:
docker compose down

📖 API Documentation
The backend provides interactive Swagger/OpenAPI documentation.
After starting the backend:
http://127.0.0.1:8000/docs
Swagger can be used to test and verify all backend endpoints.

🧪 Testing & Validation

The backend was tested through Swagger/OpenAPI and application workflows.

Testing includes:

✅ Authentication
✅ JWT authorization
✅ Patient operations
✅ Doctor operations
✅ Appointment management
✅ Symptom management
✅ Disease prediction
✅ Disease name mapping
✅ Risk assessment
✅ Severity analysis
✅ Health reports
✅ Report downloading
✅ Analytics


👥 Team
MedAssist AI
Team: Team 2
Developer / Backend: SAI KIRAN
