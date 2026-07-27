# MedAssist AI — Milestone 2: Backend Architecture & Healthcare API Integration

## Executive Summary
**MedAssist AI** is a clinical-grade healthcare diagnostic platform engineered using **FastAPI** (Python 3.10+), **SQLAlchemy ORM**, and machine learning models for symptom mapping, disease risk assessment, and clinical recommendation generation. 

This document details the backend architectural design, database schemas, security protocols, machine learning pipelines, and REST API specification delivered for **Milestone 2**.

---

## 1. System Architecture & Design Patterns

The backend follows a modular, scalable, multi-layered architecture utilizing the **Repository Pattern** and **Dependency Injection** to enforce clean separation of concerns:

```
                               ┌───────────────────────────┐
                               │     React 18 Frontend     │
                               └─────────────┬─────────────┘
                                             │ HTTP / JSON
                                             ▼
                               ┌───────────────────────────┐
                               │   FastAPI API Layer       │
                               │  (Middleware, CORS, JWT)  │
                               └─────────────┬─────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
  ┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
  │   Authentication    │         │  ML Clinical Engine │         │ Repository & Models │
  │ (Google OAuth/JWT)  │         │ (Disease/Risk/Rec)  │         │  (SQLAlchemy ORM)   │
  └─────────────────────┘         └─────────────────────┘         └──────────┬──────────┘
                                                                             │
                                                                             ▼
                                                                  ┌─────────────────────┐
                                                                  │ PostgreSQL / SQLite │
                                                                  └─────────────────────┘
```

### Key Architectural Layers:
1. **API Routers (`app/api/routers/`)**: Handle incoming HTTP requests, validate input payloads via Pydantic models, enforce JWT role-based access control, and return JSON responses.
2. **Repositories (`app/repositories/`)**: Encapsulate data access logic using SQLAlchemy ORM to communicate with PostgreSQL/SQLite database tables.
3. **ML & Inference Engines (`app/ml/`)**: Execute rule-augmented machine learning algorithms for multi-disease scoring, health score evaluation, and treatment recommendations.
4. **Data Models & Schemas (`app/models/` & `app/schemas/`)**: Strict typing with SQLAlchemy ORM tables and Pydantic validation schemas.

---

## 2. Authentication & Authorization

### 2.1 Native JWT Authentication
- **Hashing**: Passlib with bcrypt for password hashing.
- **Token Generation**: Short-lived `access_token` (JWT with HS256 algorithm) and `refresh_token` stored securely.
- **Role-Based Access Control (RBAC)**: Supports `patient`, `doctor`, and `admin` clinical roles.

### 2.2 Google OAuth 2.0 Integration
- Implemented dual-path server-side verification using Google Identity Services (GSI) ID tokens (`google.oauth2.id_token.verify_oauth2_token`).
- Automatically provisions new patient accounts upon initial sign-in, creating linked profiles (`users` and `patients` tables) and triggering welcome notifications.

---

## 3. Database Schema (SQLAlchemy ORM)

### Key Entities:
1. **Users (`users`)**:
   - `id`, `full_name`, `email`, `hashed_password`, `role`, `avatar_url`, `google_id`, `login_provider`, `is_active`, `created_at`, `updated_at`.
2. **Patients (`patients`)**:
   - `id`, `user_id` (FK), `age`, `gender`, `blood_group`, `height_cm`, `weight_kg`, `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relation`, `smoking_status`, `alcohol_consumption`, `activity_level`, `diet_type`.
3. **Medical History (`medical_histories`)**:
   - `id`, `patient_id` (FK), `condition`, `diagnosed_year`, `status`, `notes`, `created_at`.
4. **Predictions (`predictions`)**:
   - `id`, `patient_id` (FK), `symptoms_input` (JSON), `severity_input`, `duration_input`, `predicted_diseases` (JSON), `top_disease`, `top_confidence`, `created_at`.
5. **Risk Assessments (`risk_assessments`)**:
   - `id`, `prediction_id` (FK), `risk_score`, `risk_level`, `health_score`, `emergency_alert`, `factors_json` (JSON).
6. **Recommendations (`recommendations`)**:
   - `id`, `prediction_id` (FK), `lifestyle` (JSON), `diet` (JSON), `exercise` (JSON), `water_intake`, `sleep`, `follow_up`, `doctor`, `medicines` (JSON), `disclaimer`.
7. **Notifications (`notifications`)**:
   - `id`, `user_id` (FK), `title`, `message`, `type`, `read`, `created_at`.

---

## 4. Machine Learning & Clinical Algorithms

### 4.1 Multi-Disease Prediction Model (`app/ml/predictor.py`)
- Analyzes inputted symptom codes against a medical symptom-disease database of 1,200+ clinical conditions.
- Computes match percentage based on symptom weightings, duration escalation factor, and severity multipliers:
  $$\text{Match Score} = \left( \frac{\sum w_{\text{matched}}}{\sum w_{\text{total}}} \right) \times \text{Severity Factor} \times \text{Duration Multiplier}$$
- Returns ranked top-matching conditions with confidence percentage and matched/unmatched symptom indicators.

### 4.2 Clinical Risk Engine (`app/ml/risk_engine.py`)
- Evaluates individual disease risk scores (Low, Medium, High, Critical).
- Calculates an **Overall Health Score** (0–100%) taking into account age, lifestyle factors (smoking, alcohol, activity), and symptom duration.
- Triggers **Emergency Alerts** if critical indicators (e.g., severe chest pain, extreme shortness of breath) are flagged.

### 4.3 Treatment Recommendation Engine (`app/ml/recommendation_engine.py`)
- Dynamically generates clinical action plans:
  - Specialized Doctor Referral (e.g., Pulmonologist, Cardiologist, General Practitioner).
  - Dietary adjustments and hydration targets.
  - Medication guidance and lifestyle protocol.
  - Medical disclaimers complying with clinical AI governance standards.

---

## 5. RESTful API Specification

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/api/auth/register` | `POST` | Register new user account | No |
| `/api/auth/login` | `POST` | Authenticate user & return JWT token | No |
| `/api/auth/google` | `POST` | Verify Google ID token & authenticate/register | No |
| `/api/symptoms` | `GET` | List all symptoms / Search by query | No |
| `/api/symptoms/body-parts` | `GET` | Get categorized body parts | No |
| `/api/predictions/analyze` | `POST` | Perform ML symptom analysis & save results | Yes (JWT) |
| `/api/predictions/history` | `GET` | Retrieve past prediction history for patient | Yes (JWT) |
| `/api/predictions/{id}` | `GET` | Get detailed clinical analysis by ID | Yes (JWT) |
| `/api/patients/me` | `GET / PUT` | Fetch/Update current patient profile | Yes (JWT) |
| `/api/patients/me/medical-history` | `GET / POST` | Fetch or add medical history entry | Yes (JWT) |
| `/api/dashboard/stats` | `GET` | Get live clinical metrics for dashboard | No |
| `/api/notifications` | `GET` | List user notifications | Yes (JWT) |

---

## 6. Verification & Automated Testing

- **Database Auto-Migration**: Custom auto-migration module (`migrate_db.py`) automatically updates SQLite/PostgreSQL schema columns on server initialization.
- **FastAPI OpenAPI Documentation**: Interactive Swagger UI auto-generated at `/api/docs` and Redoc at `/api/redoc`.
- **Backend Test Suite**: Tested using Pytest (`tests/test_main.py`) verifying health checks, authentication endpoints, and prediction pipeline execution.

---

## 7. Conclusion & Next Steps
Milestone 2 delivers a robust, secure, and production-ready backend architecture for **MedAssist AI**. The system seamlessly connects ML prediction models with a RESTful FastAPI backend and database persistence layer.

*Submitted by: Yamini Lakshmi Kantamsetti*
