# MedAssist AI: Database Architecture, User Authentication & Patient History Logic

**Project Milestone 1 Report**  
**Prepared by:** Anbarasan K (Backend Dev & Database Architect)

---

## Contents
1. **Project Description**
2. **Database Architecture & Collections**
3. **Environment & Stack Setup**
4. **Authentication & Security Design**
5. **Patient History & Consultation Logic**
6. **Resilient Local Database Fallback**
7. **API Endpoints & Verification**
8. **Conclusion & Deployment Integration**

---

## 1. Project Description
MedAssist AI is a clinical diagnostic assistant designed to analyze patient symptoms and provide prediction probability metrics for potential diseases. As the **Backend Dev & Database Architect**, my role is to build a secure, scalable, and high-performance server-side foundation. 

This includes designing the database schema (MongoDB) to support fast symptom lookups and secure patient records, implementing cryptographically secure User Authentication (JWT + PBKDF2), and programming the API logic to record and isolate patient consultation history while enforcing role-based permissions.

---

## 2. Database Architecture & Collections
The database is structured to support relational integrity using MongoDB's document-model design. It consists of five core collections:

```
                  ┌──────────────┐
                  │    users     │
                  └──────┬───────┘
                         │ 1:1
                  ┌──────▼───────┐
                  │   profiles   │
                  └──────────────┘
                         │ 1:N
                  ┌──────▼───────┐
                  │ consultations│
                  └──────────────┘
```

### 2.1 Collection Schemas
* **Users (`users`):** Stores primary credentials and authorization roles.
  * *Indexes:* `email` (Unique index to prevent duplicate accounts).
* **Patient Profiles (`profiles`):** Contains clinical and demographic info (allergies, height, weight, gender, date of birth).
  * *Indexes:* `user_id` (Unique index mapping 1:1 to users).
* **Symptoms Catalog (`symptoms`):** Alphabetical index of 377 symptoms seeded from the clinical dataset.
  * *Indexes:* `key` (Unique index for symptom identification).
* **Disease Profiles (`disease_profiles`):** Statistical conditional probability vectors for each of the 754 disease classes.
  * *Indexes:* `disease` (Unique index).
* **Consultation History (`consultations`):** Logs patient inputs, predictions, risk assessments, and emergency recommendations.

---

## 3. Environment & Stack Setup
A micro-framework stack was selected to ensure rapid execution speed, minimal runtime overhead, and clean dependency management:

* **Language:** Python 3.14
* **Web Framework:** FastAPI (Asynchronous ASGI server support, automated OpenAPI/Swagger generation).
* **ASGI Server:** Uvicorn (High-performance event-loop runner).
* **Database Driver:** Motor (Non-blocking, asynchronous MongoDB driver).
* **Testing Library:** Pytest & HTTPX (Automated REST API verification).

---

## 4. Authentication & Security Design
To secure sensitive clinical data, a multi-layer security architecture was implemented:

```
[Client Login Request] ──> [PBKDF2 Password Check] ──> [JWT Token Issued] ──> [Authorized Request Bearer Header]
```

### 4.1 Password Hashing (Zero-Binary Dependency)
Rather than relying on compiled binary wrappers (e.g. bcrypt) which can fail across operating systems, a native PBKDF2 hashing model was built:
* Uses `hashlib.pbkdf2_hmac` with a `SHA-256` back-end.
* Incorporates a random 16-byte hex-encoded salt.
* Runs **100,000 iterations** to defend against brute-force and pre-computation attacks.

### 4.2 Session Tokenization (JWT)
* Upon successful authentication, the server signs an asymmetric JSON Web Token (JWT) using the `HS256` algorithm.
* The payload encrypts `sub` (User ID), `email`, and `role`.
* Token expiration defaults to **60 minutes** for security.

---

## 5. Patient History & Consultation Logic
The consultation history backend acts as the bridge between database persistence and prediction algorithms:
1. **Diagnosis Evaluation:** When symptoms are submitted via `/api/history/check`, the backend passes symptoms to the prediction engine, which calculates disease likelihoods and assesses risk levels.
2. **Consultation Record Creation:** A consultation document is automatically created with the patient's ID, selected symptoms, top 5 predictions, overall risk score, and system recommendations.
3. **Role Isolation Policy:** 
   * Patients are strictly restricted to querying only their own consultation records.
   * Doctors and Admins bypass ownership checks to inspect any consultation record for review.

---

## 6. Resilient Local Database Fallback
To ensure that development, local testing, and staging work even without a live MongoDB instance, a **MockDatabase** engine was built:
* The connection manager (`connect_to_mongo`) attempts a connection to `localhost:27017` with a 2-second timeout.
* If MongoDB is unreachable, it logs a warning and falls back to the **local JSON file-based database**.
* The Mock Database mimics PyMongo query structures (like `find`, `find_one`, `insert_one`, `update_one`) and saves structured JSON files directly inside `backend/data/`.

---

## 7. API Endpoints & Verification
The backend API exposes a clean routing topology (`/api/auth`, `/api/profile`, `/api/symptoms`, `/api/history`) that is fully testable via Swagger.

### 7.1 Automated Testing Results
To verify implementation integrity, automated tests were run covering the core API paths. The test suite succeeded with **100% pass rates**:

```bash
platform win32 -- Python 3.14.0, pytest-9.1.1
collected 4 items

tests\test_api.py ....                                                   [100%]
======================= 4 passed in 5.59s =======================
```

---

## 8. Conclusion & Deployment Integration
All core Backend and Database goals for Milestone 1 are complete. 
* **Handover Phase:** The API schemas are fully documentable under `/docs` to allow the **Frontend Developer** to begin connecting forms.
* **Deployment Phase:** The backend code is modularized and ready to be containerized in Docker for deployment by the **Cloud Engineer**.
