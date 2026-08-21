# 🩺 MedAssist AI

### AI-Powered Healthcare Assistance & Disease Prediction Platform

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Framework-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?logo=sqlalchemy&logoColor=white)
![Scikit--learn](https://img.shields.io/badge/Scikit--learn-ML-F7931E?logo=scikitlearn&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-ML-189FDD?logo=xgboost&logoColor=white)
![LightGBM](https://img.shields.io/badge/LightGBM-ML-9ACD32?logo=lightgbm&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Container-2496ED?logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?logo=swagger&logoColor=black)

---

# 📌 Overview

**MedAssist AI** is an AI-powered healthcare platform designed to assist patients and healthcare professionals through symptom screening, disease prediction, risk assessment, personalized recommendations, health reports, appointments, and analytics.

The application combines a **React frontend**, **FastAPI backend**, **PostgreSQL database**, and **Machine Learning pipeline** to provide an integrated healthcare management workflow.

This repository contains the **backend and machine learning implementation completed for Milestone 3**, including:

- Machine Learning pipeline
- Backend REST APIs
- Healthcare management modules
- Authentication and authorization
- Database integration
- Disease prediction
- Risk and severity assessment
- Health reports
- Analytics
- Docker support

---
# 🚀 Deployment

MedAssist AI has been successfully deployed and is available as a live web application for demonstration and evaluation.

🌐 **Live Website:** https://medassistai-frontend.vercel.app

### Deployment Platforms

| Component | Platform |
|---|---|
| 🎨 **Frontend** | Vercel |
| ⚙️ **Backend** | Render |
| 🤖 **Machine Learning / AI Support** | Hugging Face |

### Deployment Status

✅ Frontend deployment completed successfully on Vercel.  
✅ Backend deployment completed successfully on Render.  
✅ Machine Learning components and model-related resources were integrated with the deployed application.  
✅ The complete application was tested after deployment for the major healthcare workflows.

The deployed application provides access to the implemented MedAssist AI features, including patient registration and login, symptom analysis, disease prediction, risk and severity assessment, health reports, appointments, doctor workflows, and administrative functionality.

### Internship Evaluation Deployment

The deployed version and corresponding project updates have also been completed in the **internship project branch for evaluation and milestone purposes**.

This version is being maintained in the internship repository until the project evaluation and marks are completed.

---

# 🚀 Key Features

| Module | Description |
|---|---|
| 🔐 **Authentication** | JWT-based authentication and role-based authorization |
| 👤 **Patient Management** | Patient profile and information management |
| 👨‍⚕️ **Doctor Management** | Doctor profiles and availability management |
| 📅 **Appointments** | Appointment scheduling and status management |
| 🧬 **Symptom Dictionary** | Management of supported symptoms |
| 🧠 **Disease Prediction** | AI-based disease prediction from symptoms |
| ⚠️ **Risk Assessment** | Health risk evaluation |
| 📊 **Severity Analysis** | Severity and emergency assessment |
| 📋 **Health Reports** | Medical report history and management |
| 📈 **Analytics** | System and disease prediction analytics |
| 🐳 **Docker** | Containerization and deployment support |

---

# 🧠 Disease Prediction Pipeline

The disease prediction system follows a complete machine learning and healthcare assessment workflow:

```text
                User Symptoms
                      │
                      ▼
              Symptom Validation
                      │
                      ▼
                Preprocessing
                      │
                      ▼
              Feature Extraction
                      │
                      ▼
             Voting Classifier
                      │
                      ▼
             Disease Prediction
                      │
                      ▼
             Disease Name Mapping
                      │
                      ▼
               Risk Assessment
                      │
                      ▼
              Severity Analysis
                      │
                      ▼
          Medical Recommendation
                      │
                      ▼
                Health Report
```

---

# 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| 🐍 **Python 3.10+** | Backend and Machine Learning development |
| ⚡ **FastAPI** | REST API development |
| ⚛️ **React 19** | Frontend development |
| 🗄️ **PostgreSQL** | Database management |
| 🔗 **SQLAlchemy** | ORM and database operations |
| 📦 **Pydantic** | Request and response validation |
| 🔐 **JWT** | Authentication and authorization |
| 🧠 **Scikit-learn** | Machine Learning |
| 🚀 **XGBoost** | Machine Learning model |
| 💡 **LightGBM** | Machine Learning model |
| 🤖 **Voting Classifier** | Ensemble disease prediction |
| ⚙️ **Uvicorn** | FastAPI application server |
| 🐳 **Docker** | Containerization |
| 📖 **Swagger / OpenAPI** | API testing and documentation |

---

# 📂 Project Structure

```text
MedAssistAI/
│
├── backend/
│   ├── app/
│   │   ├── config/
│   │   ├── database/
│   │   ├── ml/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── render.yaml
│   ├── requirements.txt
│   └── tests
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── constants/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── routes/
    │   ├── services/
    │   └── styles/
    │
    ├── package.json
    ├── vite.config.js
    ├── vercel.json
    └── README.md
```

---

# 🔌 Backend API

## 🔐 Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Authenticate user and generate JWT |
| `GET` | `/auth/me` | Get authenticated user information |

### Supported Roles

- 👤 Patient
- 👨‍⚕️ Doctor
- 🛡️ Admin

---

## 👤 Patient Management

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/patient/profile` | Get patient profile |
| `PUT` | `/patient/profile` | Update patient profile |
| `GET` | `/patient/all` | Get authorized patient information |

---

## 👨‍⚕️ Doctor Management

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/doctor/profile` | Get doctor profile |
| `PUT` | `/doctor/profile` | Update doctor profile and availability |
| `GET` | `/doctor/all` | Get available doctors |

---

## 📅 Appointment Management

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/appointments` | Schedule an appointment |
| `GET` | `/appointments/my` | View user's appointments |
| `PUT` | `/appointments/{id}/status` | Update appointment status |
| `GET` | `/appointments/all` | View all appointments |

Patients can schedule appointments, while doctors and administrators can manage appointment status and monitor appointments according to their roles.

---

## 🧬 Symptom Dictionary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/symptoms` | Retrieve supported symptoms |
| `POST` | `/symptoms` | Add a new symptom |

The symptom dictionary provides the supported symptoms used by the disease prediction system.

Administrators can add new symptoms when required.

---

## 🧠 Disease Prediction

### `POST /predict`

Processes patient symptoms through the complete Machine Learning pipeline and returns:

- Predicted disease
- Risk assessment
- Severity assessment
- Medical recommendations
- Health report information

---

## 📋 Health Reports

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reports/my` | Get patient's report history |
| `GET` | `/reports/patient/{patient_id}` | Get reports for a patient |
| `GET` | `/reports/{id}` | Get detailed report |
| `PUT` | `/reports/{id}/notes` | Add or update doctor notes |
| `GET` | `/reports/{id}/download` | Download printable report |

### Reports Include

- Patient health information
- Predicted disease
- Risk assessment
- Severity analysis
- Medical recommendations
- Doctor notes
- Report history

---

## 📊 Analytics & Monitoring

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/analytics/summary` | System overview statistics |
| `GET` | `/analytics/diseases` | Disease prediction distribution |

Analytics provide insights into system usage and disease prediction patterns.

---

# 🔐 Authentication & Authorization

MedAssist AI uses **JWT-based authentication** combined with **role-based authorization**.

```text
             User Login
                  │
                  ▼
        Credential Validation
                  │
                  ▼
          JWT Access Token
                  │
                  ▼
          Role Verification
                  │
                  ▼
          Protected API Access
```

Role-based authorization ensures that users can access only the functionality permitted for their role.

---

# 🗄️ Database

The backend uses **PostgreSQL** with **SQLAlchemy ORM**.

### Database Entities

- 👤 Users
- 🧑‍⚕️ Patients
- 👨‍⚕️ Doctors
- 📅 Appointments
- 🧬 Symptoms
- 📋 Health Reports

---

# 🐳 Docker Support

Docker configuration is provided through:

```text
Dockerfile
docker-compose.yml
```

### Build and Run

```bash
docker compose up --build
```

### Stop Containers

```bash
docker compose down
```

---

# 📖 API Documentation

MedAssist AI provides interactive **Swagger / OpenAPI documentation**.

After starting the backend, open:

```text
http://127.0.0.1:8000/docs
```

Swagger can be used to:

- Test API endpoints
- Verify request and response schemas
- Test authentication
- Test JWT-protected routes
- Validate backend workflows

---

# 🧪 Testing & Validation

The backend was tested through **Swagger/OpenAPI** and application workflows.

### Testing Coverage

- ✅ Authentication
- ✅ JWT authorization
- ✅ Patient operations
- ✅ Doctor operations
- ✅ Appointment management
- ✅ Symptom management
- ✅ Disease prediction
- ✅ Disease name mapping
- ✅ Risk assessment
- ✅ Severity analysis
- ✅ Health reports
- ✅ Report downloading
- ✅ Analytics

---


# 🚀 Future Enhancements

Potential future improvements include:

- 🔮 Advanced disease prediction models
- 🧠 Explainable AI for prediction results
- 📱 Mobile application
- 💬 AI healthcare assistant
- 📊 Advanced healthcare analytics
- 🔔 Appointment notifications
- ☁️ Cloud deployment
- 🔒 Enhanced security and auditing

---


# 👥 Team

## MedAssist AI

**Team:** Team 2

**Developer / Backend:** SAI KIRAN


