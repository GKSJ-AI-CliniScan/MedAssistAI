# MedAssist AI — Clinical Symptom Screening & Disease Prediction Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF.svg)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB.svg)](https://www.python.org/)

MedAssist AI is an intelligent healthcare platform that provides AI-assisted symptom screening, clinical disease predictions, risk assessment metrics, and care recommendations. Built as a monorepo, it features a high-performance **FastAPI + Machine Learning** backend and an **Interactive React 19 + Vite** frontend.

---

## 🌟 Key Features

- 🩺 **AI Symptom Screening**: Analyzes user-reported symptoms using an ensemble ML voting classifier (Random Forest + XGBoost + LightGBM).
- 📊 **Single-Purpose Results Engine**:
  - **Prediction**: Answers *"What condition might I have?"* with probability confidence scores.
  - **Risk Assessment**: Answers *"How serious is it?"* with risk level tiers, severity scores, and emergency flags.
  - **Recommendations**: Answers *"What should I do next?"* with actionable guidance, monitoring steps, self-care, and emergency triggers.
- 👨‍⚕️ **Role-Based Access Control**:
  - **Doctor Portal**: Real-time DB analytics, risk level breakdowns, appointment tracking, proportion-accurate disease distribution charts.
  - **Patient Portal**: Personalized health overview, symptom checker, diagnostic history, saved reports, appointment scheduling.
- 🔒 **Secure Authentication**: JWT Bearer token authentication with role-isolated session storage.
- ⚡ **Preloaded ML Pipeline**: Startup lazy-loading for zero-latency inference on incoming prediction requests.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Axios |
| **Backend API** | FastAPI, Pydantic v2, Uvicorn, Python 3.10+ |
| **Machine Learning** | Scikit-Learn, XGBoost, LightGBM, Joblib, NumPy |
| **Database & Auth** | SQLAlchemy, PostgreSQL (Production) / SQLite (Dev), JWT, Bcrypt |
| **Containerization** | Docker, Docker Compose |

---

## 📂 Repository Structure

```
MedAssist-AI/
├── backend/                  # FastAPI application & ML pipeline
│   ├── app/
│   │   ├── api/              # REST API routers & endpoints
│   │   ├── core/             # Authentication & database connection
│   │   ├── models/           # SQLAlchemy database schemas
│   │   ├── ml/               # Model weights, datasets, & predictor
│   │   └── services/         # Business logic services
│   ├── main.py               # FastAPI entry point
│   ├── requirements.txt      # Python dependencies
│   └── docker-compose.yml    # Docker setup
├── frontend/                 # React 19 + Vite client application
│   ├── src/
│   │   ├── components/       # UI components & layouts
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # Dashboard & Auth views
│   │   ├── routes/           # Role-based protected routes
│   │   └── services/         # API integration client
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
├── .env.example              # Monorepo environment template
├── .gitignore                # Global git ignore rules
├── LICENSE                   # MIT License
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ 
- **Python**: v3.10+
- **Git**

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> **Backend Server**: `http://127.0.0.1:8000`  
> **Interactive API Docs**: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

In a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

> **Frontend Application**: `http://localhost:5173`

---

### 3. Docker Setup (Optional)

```bash
cd backend
docker-compose up --build -d
```

---

## ⚙️ Environment Variables

Copy `.env.example` templates to create local `.env` files:

#### `backend/.env`
```env
APP_NAME="MedAssistAI Backend"
APP_VERSION="1.0.0"
DEBUG=True
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./medassistai.db
```

#### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🖼️ Screenshots

*(Add application screenshots here)*

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more details.

---

## 👥 Contributors

- **Development Team** — MedAssist AI Engineers & Architects

---
*For support or inquiries, please open an issue in the GitHub repository.*
