# 🏥 MedAssist AI
### Medical Symptom Analysis & Disease Prediction System

A production-quality, full-stack AI Healthcare Platform built with **React**, **FastAPI**, **PostgreSQL**, **Redis**, and **Machine Learning**.

---

## 📋 Features

| Feature | Description |
|---|---|
| 🔐 Authentication | JWT Access + Refresh Tokens, bcrypt, RBAC (Patient/Doctor/Admin) |
| 🩺 Symptom Analysis | 102 searchable symptoms with body-part filtering |
| 🤖 Disease Prediction | AI engine predicting Top 5 diseases with confidence scores |
| ⚠️ Risk Assessment | Multi-factor risk scoring (BP, BMI, Sugar, Smoking, Age) |
| 💊 Recommendations | Personalized lifestyle, diet, exercise, and medication guidance |
| 📄 PDF Reports | Downloadable clinical AI diagnostic summary reports |
| 📊 Analytics | Monthly trends, disease distribution, health score tracking |
| 🔔 Notifications | Real-time alerts for analysis results and emergencies |

---

## 🏗️ Tech Stack

**Frontend:** React, TailwindCSS, Framer Motion, Chart.js, Axios, React Router v6

**Backend:** Python 3.12, FastAPI, Pydantic V2, SQLAlchemy, Alembic

**Database:** PostgreSQL (production), SQLite (development fallback)

**Cache:** Redis

**ML:** Scikit-learn / XGBoost compatible engine with rule-based fallback

**Reports:** ReportLab PDF generation

**Infrastructure:** Docker, Docker Compose, Nginx

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL + Redis + Backend + Frontend)
docker compose up --build

# Frontend: http://localhost:80
# Backend API: http://localhost:8000/api
# API Docs: http://localhost:8000/api/docs
```

### Option 2: Local Development

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy environment template
copy .env.example .env
# Edit .env with your database credentials

# Run backend (SQLite auto-fallback if no PostgreSQL)
python run.py
# OR
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

---

## 🧪 Running Tests

```bash
cd backend
pytest tests/ -v
```

The test suite uses SQLite in-memory database — no external services required.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/patients/me` | Get patient profile |
| PUT | `/api/patients/me` | Update patient profile |
| GET | `/api/symptoms/` | List all 102 symptoms |
| POST | `/api/predictions/analyze` | Run full AI analysis |
| GET | `/api/predictions/history` | Prediction history |
| POST | `/api/reports/generate/{id}` | Generate PDF report |
| GET | `/api/reports/{id}/download` | Download PDF |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/analytics` | Analytics data |
| GET | `/api/notifications/` | Notifications list |
| GET | `/api/health` | Health check |

**Full Swagger docs:** `http://localhost:8000/api/docs`

---

## 📁 Project Structure

```
MedAssist-AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py              # JWT auth dependency
│   │   │   └── routers/             # All API routers
│   │   ├── core/
│   │   │   ├── config.py            # Settings
│   │   │   ├── database.py          # SQLAlchemy engine
│   │   │   └── security.py          # JWT + bcrypt
│   │   ├── ml/
│   │   │   ├── predictor.py         # Disease prediction engine
│   │   │   ├── risk_engine.py       # Risk assessment engine
│   │   │   └── recommendation_engine.py  # Treatment recommendations
│   │   ├── models/                  # SQLAlchemy ORM models (12 tables)
│   │   ├── repositories/            # Data access layer
│   │   ├── schemas/                 # Pydantic schemas
│   │   ├── services/
│   │   │   └── report_generator.py  # ReportLab PDF generator
│   │   └── main.py                  # FastAPI application
│   ├── tests/
│   │   └── test_main.py             # Comprehensive Pytest suite
│   ├── requirements.txt
│   ├── Dockerfile.backend
│   └── .env.example
├── src/
│   ├── services/
│   │   ├── api.js                   # Axios client (JWT + auto-refresh)
│   │   ├── authService.js           # Auth service
│   │   ├── patientService.js        # Patient profile service
│   │   └── medicalService.js        # Medical services
│   └── pages/                       # All React pages
├── docker-compose.yml
├── Dockerfile.frontend
├── nginx.conf
└── .env
```

---

## ⚕️ Medical Disclaimer

This application is for educational and preliminary screening purposes only. It does NOT constitute medical advice, diagnosis, or treatment. Always consult a licensed physician.

---

© 2024 MedAssist AI – Powered by Artificial Intelligence
