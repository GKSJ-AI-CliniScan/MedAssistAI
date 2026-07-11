# MedAssist AI - Backend Documentation (Milestone 1)

Welcome to the backend service of **MedAssist AI**. This repository contains the complete implementation for the Database Architecture, User Authentication, and Patient Consultation History system.

---

## 1. Role Scope (Backend & Database Architect)
For Milestone 1, the following features have been fully implemented, tested, and pushed:
* **Database Architecture:** Resilient MongoDB integration with unique constraints and a local file-based JSON fallback system for mock development.
* **User Authentication:** Password hashing using PBKDF2 (`sha256`), secure JWT token generation/verification, and role-based permissions check dependencies.
* **Patient History Logic:** Secure storage and retrieval of disease prediction consultations, isolated per patient.

---

## 2. Database Schema (MongoDB / JSON Fallback)
The database structure is optimized for rapid symptom lookup and secure patient tracking. It is divided into five key collections:

### A. Users (`users`)
Stores user credential tokens and permissions roles.
```json
{
  "_id": "string (ObjectId)",
  "email": "string (unique)",
  "hashed_password": "string (PBKDF2-sha256)",
  "role": "string (patient | doctor | admin)",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### B. Patient Profiles (`profiles`)
Contains personal medical demographics.
```json
{
  "_id": "string (ObjectId)",
  "user_id": "string (unique, ref: users._id)",
  "first_name": "string",
  "last_name": "string",
  "date_of_birth": "string | null",
  "gender": "string | null",
  "blood_type": "string | null",
  "height": "float | null",
  "weight": "float | null",
  "allergies": "array of strings",
  "medical_conditions": "array of strings",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### C. Symptoms (`symptoms`)
Holds indexed symptom terms for the selection menus.
```json
{
  "_id": "string (ObjectId)",
  "key": "string (unique, lowercase token)",
  "display_name": "string (capitalized description)",
  "category": "string (Dermatology | Pulmonology | etc.)"
}
```

### D. Disease Profiles (`disease_profiles`)
Contains statistical models of symptoms per disease.
```json
{
  "_id": "string (ObjectId)",
  "disease": "string (unique)",
  "symptom_probabilities": {
    "symptom_key": "float (probability 0.0 - 1.0)"
  },
  "base_rate": "float",
  "occurrences": "integer"
}
```

### E. Consultations (`consultations`)
Stores patient consultation records and ML recommendations history.
```json
{
  "_id": "string (ObjectId)",
  "patient_id": "string (ref: users._id)",
  "symptoms": "array of strings",
  "predicted_diseases": [
    {
      "disease": "string",
      "probability": "float"
    }
  ],
  "risk_level": "string (low | medium | high)",
  "risk_score": "float (0.0 - 100.0)",
  "recommendations": "array of strings",
  "created_at": "ISODate"
}
```

---

## 3. Security & Authentication Flow
1. **Password Protection:** Plain passwords are never stored. They are hashed using a cryptographically random 16-byte salt and the PBKDF2 algorithm (`100,000` iterations of HMAC-SHA256).
2. **Access Security:** User log-in yields an asymmetric JWT access token containing their `user_id`, `email`, and `role` credentials.
3. **Route Security Checks:** FastAPI dependencies (`get_current_user`, `RoleChecker`) intercept incoming requests. Access is granted only to valid tokens. Additionally, patients are restricted to accessing only their own consultation records, whereas doctors and admins can review all histories.

---

## 4. API Endpoints Catalog

### Authentication (`/api/auth`)
* `POST /register` — Registers new users (creates profiles automatically for patient roles).
* `POST /login` — Authenticates credentials and returns a Bearer JWT Token.
* `GET /me` — Retrieves the active session user object.

### Patient Profile (`/api/profile`)
* `GET /` — Fetches the active patient's profile details.
* `PUT /` — Updates specific demographic or medical stats fields.

### Symptoms Catalog (`/api/symptoms`)
* `GET /` — Returns the alphabetically sorted catalog of 377 symptoms.

### Consultation History (`/api/history`)
* `POST /check` — Executes the prediction model on symptoms and saves the consultation record.
* `GET /` — Fetches the historical log of consultations for the active user.
* `GET /{id}` — Fetches details of a specific consultation record.

---

## 5. Verification & Local Execution

### Local Database Fallback
To run without a local MongoDB connection:
The database script automatically detects connection status. If a connection to `localhost:27017` fails, it falls back to a file-based local JSON repository located at `backend/data/` so that development and testing remain fully operational.

### Starting the Server
Navigate to the `backend/` directory, activate the environment, and start the app:
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```
Access the Swagger testing interface at: **`http://127.0.0.1:8000/docs`**

### Running the Test Suite
To run the automated tests:
```bash
pytest
```
All 4 test paths pass successfully.
