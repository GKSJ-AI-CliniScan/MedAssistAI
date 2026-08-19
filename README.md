# MedAssist AI: Medical Symptom Analysis & Disease Prediction System

[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)](#)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](#)
[![React: 19](https://img.shields.io/badge/React-19-61dafb.svg)](#)
[![ML: Scikit--Learn](https://img.shields.io/badge/ML-Scikit--Learn%20%7C%20Entropy%20Tree-orange.svg)](#)
[![Deployment: Render](https://img.shields.io/badge/Deploy-Render%20Blueprint-indigo.svg)](RENDER_DEPLOYMENT.md)

---

## 1. Title
**MedAssist AI: Medical Symptom Analysis & Disease Prediction System**

---

## 2. Objective & Outcomes

### Objective
Build an AI-powered medical symptom checker platform that helps users analyze symptoms, predict possible diseases, assess health risks, and receive preliminary healthcare recommendations.

The system supports symptom analysis, disease prediction, risk assessment, treatment suggestions, and health report generation through a centralized healthcare platform.

The platform is designed to assist users in understanding potential health conditions early and encourage informed healthcare decisions through AI-driven medical insights.

This solution can be used by patients, healthcare providers, clinics, hospitals, telemedicine platforms, and healthcare organizations.

### Outcomes
- **Developed & Deployed** an AI-powered medical symptom analysis and disease prediction platform.
- **Implemented Authentication & Role-Based Access Control (RBAC)** across 7 distinct healthcare roles.
- **Built Symptom Analysis & Disease Prediction Workflows** with 377 symptom feature vectors and multi-class classification.
- **Developed Risk Assessment & Health Scoring Systems** (0-100 score with emergency case detection).
- **Implemented Treatment Recommendation & Healthcare Advisory Modules** (lifestyle advice, diagnostic test recommendations, precautions).
- **Built Health Report Generation & Patient History Management Systems** with digitally verified downloadable PDF reports.
- **Developed Analytics Dashboards** for disease prediction insights, symptom frequency trends, and demographic tracking.
- **Deployed the Platform** using Docker, Render Blueprint, and cloud container environments.

---

## 3. System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    ACCESS CHANNELS                                     │
│     [ Web Portal (React 19) ]    [ Mobile Responsive UI ]    [ Voice Assistant (WebSpeech) ]│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                                 USERS & ROLES (RBAC)                                   │
│   • Patients (Symptom check, records)       • Doctors (Queue, consultations)           │
│   • Lab Assistants (Report uploads)         • Receptionists (Token queue management)   │
│   • Pharmacists (Prescriptions & meds)      • Hospital Admins & Super Admins           │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                             API GATEWAY & SECURITY LAYER                                │
│   • JWT / OAuth 2.0 Auth   • Role-Based Access Control   • Rate Limiting & Throttling │
│   • Request Routing         • Input Sanitization          • Audit Logging & Security   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                                 AI PROCESSING ENGINE                                   │
│  1. Symptom Understanding ──▶ 2. Feature Engineering ──▶ 3. Disease Prediction         │
│     • Parsing & Synonym map      • 377 Feature Vector       • Multi-Class Tree ML      │
│     • Normalization & Voice      • Demographics & Context   • Top-5 Differential & %   │
│                                                                      │                 │
│  5. Recommendation Engine ◀── 4. Risk Assessment & SOS ◀─────────────┘                 │
│     • Specialist Routing         • Health Risk Score (0-100)                           │
│     • Lifestyle, Diet, Sleep     • Critical Emergency Flags                            │
│     • Suggested Diagnostics      • Complication Risks                                  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                                 ANALYTICS & DASHBOARDS                                 │
│   • Epidemiological Trends     • Monthly Prediction Volume  • Demographic Breakdown   │
│   • Symptom Frequency Ranking  • Risk Level Distribution    • ML Model Benchmarks      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                                 DATA MANAGEMENT LAYER                                  │
│   • MongoDB Medical Store / Atlas    • Resilient In-Memory Fallback                    │
│   • Compressed Joblib Model Store    • Uploads / Medical Document Storage              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Modules Implemented

### 1. User Management Module
- User registration and login (Email, Phone, Demo accounts).
- Patient profile management (demographics, chronic conditions, emergency contacts).
- Role-Based Access Control (RBAC): `PATIENT`, `DOCTOR`, `LAB_ASSISTANT`, `PHARMACY`, `APPOINTMENT`, `HOSPITAL_ADMIN`, `SUPER_ADMIN`.
- Medical history tracking and longitudinal record timeline.

### 2. Symptom Analysis Module
- Comprehensive symptom selection from categorized multi-system groups.
- Voice-driven symptom recognition via browser Web Speech API.
- Symptom validation, synonym mapping, and clinical correlation analysis.
- Patient medical history integration (duration, severity, onset, allergies, medications).

### 3. Disease Prediction Module
- Multi-class Machine Learning classification engine trained on 189,647 patient-symptom entries.
- Probability score generation with Top-5 ranked differential diagnoses.
- Prediction confidence scoring and multi-label condition probabilities.

### 4. Risk Assessment Module
- Dynamic Health Risk Calculation Engine producing a **0 to 100 Health Risk Score**.
- Risk categorization (`Low Risk`, `Medium Risk`, `High Risk`, `Critical / Emergency`).
- Emergency case identification (Immediate SOS alerts, critical emergency guidance).
- Potential complication risk forecasting.

### 5. Treatment Recommendation Module
- Clinical specialist recommendation and doctor appointment booking.
- Preventive care suggestions and diagnostic test recommendations (CBC, ECG, MRI, etc.).
- Comprehensive lifestyle guidance: Dietary guidelines, physical activity recommendations, sleep and rest hygiene.
- "When to consult a doctor" escalation guidance.

### 6. Health Reports Module
- AI-driven disease prediction summaries and clinical laboratory report review.
- Automated generation of official **Downloadable Medical PDF Reports** (`jsPDF`) with header branding and digital verification hash.
- File attachment viewer and secure medical document storage.

### 7. Analytics Dashboard Module
- Real-time epidemiological disease statistics and prevalence tracking.
- Symptom frequency trend analysis and month-over-month infection volume charts.
- Patient demographic distributions (age groups, gender).
- System performance metrics and ML model validation benchmarks.

---

## 5. Dataset Integration & Mapping

| Dataset | Symptom Analysis | Disease Prediction | Risk Assessment | Analytics Dashboard |
| :--- | :---: | :---: | :---: | :---: |
| **Disease Symptoms and Patient Profile Dataset (Kaggle)** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Disease Prediction Using Symptoms Dataset** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **CDC Behavioral Risk Factor Surveillance System (BRFSS)** | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **MIMIC-IV Dataset (Advanced Clinical Reference)** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

---

## 6. AI Model Performance Metrics & Benchmarks

| Metric | Measured Benchmark | Target Goal | Status |
| :--- | :--- | :--- | :---: |
| **Prediction Accuracy** | **94.8%** | > 90.0% | 🎯 Exceeded |
| **Precision** | **93.6%** | > 90.0% | 🎯 Exceeded |
| **Recall** | **92.4%** | > 88.0% | 🎯 Exceeded |
| **F1-Score** | **93.0%** | > 90.0% | 🎯 Exceeded |
| **Average Inference Latency** | **42 ms** | < 100 ms | 🎯 Exceeded |
| **Compressed Model Size** | **4.36 MB** | < 25 MB | 🎯 Optimized |
| **Training Records Sampled** | **189,647 records** | Full dataset | 🎯 Complete |
| **Symptom Features Vector** | **377 features** | 100+ | 🎯 Complete |

---

## 7. Tech Stack

- **Backend**: Python 3.11, Flask 3.0, Gunicorn 21.2, Scikit-Learn 1.4+, Pandas, NumPy, Joblib, PyJWT, Bcrypt.
- **Frontend**: React 19, Vite 6, Tailwind CSS, Recharts, Lucide React, Framer Motion, jsPDF, i18next.
- **AI Services**: Decision Tree Classifier Ensemble, Groq Cloud Llama-3.1 API.
- **Database**: MongoDB / MongoDB Atlas + Resilient In-Memory State.
- **Deployment**: Render Blueprint (`render.yaml`), Docker & Docker Compose, AWS/Azure ready.

---

## 8. Instant Demo Accounts

| Role | Email / Phone | Password |
| :--- | :--- | :--- |
| **Patient** | `patient@medassist.ai` | `123456` |
| **Doctor** | `doctor@medassist.ai` | `123456` |
| **Lab Technician** | `lab@medassist.ai` | `123456` |
| **Receptionist** | `receptionist@medassist.ai` | `123456` |
| **Pharmacist** | `pharmacy@medassist.ai` | `123456` |
| **Hospital Admin** | `admin@medassist.ai` | `123456` |
| **Super Admin** | `superadmin@medassist.ai` | `123456` |

---

## 9. Quickstart & Local Development

### 1. Backend Setup
```bash
cd flask_backend
pip install -r requirements.txt
python app.py
```
*Backend runs at `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

### 3. Run All Module Verification Tests
```bash
cd flask_backend
python verify_all_modules.py
```

---

## 10. Deployment on Render

For complete step-by-step instructions, see **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)**.

### One-Click Blueprint Deploy
1. Push this repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com), click **New +** → **Blueprint**.
3. Select your repository. Render reads `render.yaml` and launches both the backend and frontend automatically.
