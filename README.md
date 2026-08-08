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

#🛠️ Technology Stack
Technology	Purpose
🐍 Python 3.10+	Backend and Machine Learning development
⚡ FastAPI	REST API development
⚛️ React 19	Frontend development
🗄️ PostgreSQL	Database management
🔗 SQLAlchemy	ORM and database operations
📦 Pydantic	Request and response validation
🔐 JWT	Authentication and authorization
🧠 Scikit-learn	Machine Learning
🚀 XGBoost	Machine Learning model
💡 LightGBM	Machine Learning model
🤖 Voting Classifier	Ensemble disease prediction
⚙️ Uvicorn	FastAPI application server
🐳 Docker	Containerization
📖 Swagger / OpenAPI	API testing and documentation
| 💡 **LightGBM** | Machine Learning model |
| 🤖 **Voting Classifier** | Ensemble disease prediction |
| ⚙️ **Uvicorn** | FastAPI application server |
| 🐳 **Docker** | Containerization |
| 📖 **Swagger / OpenAPI** | API testing and documentation |
