🧠 MedAssist AI

Medical Symptom Analysis & Disease Prediction System

An AI-powered healthcare platform that delivers rapid, data-driven symptom evaluation, disease risk prediction, and clinical guidance — built with a Next.js frontend, a FastAPI machine learning microservice, and a 200-tree Random Forest diagnostic model trained on 60,000+ clinical records across 658 disease classes.

🔗 Live App: https://medassist-ai-platform.onrender.com/

✨ Overview

MedAssist AI takes a patient's reported symptoms, vitals, and uploaded medical reports/scans and returns a ranked, explainable differential diagnosis — complete with risk classification, urgency guidance, and specialist recommendations. The platform combines a real-time search-driven content layer for diseases and medications with a full patient dashboard for tracking medications, health insights, and diagnostic history.

🚀 Key Features
AI Symptom Checker — Dual-mode diagnostic flow: an instant all-in-one form or a guided 4-step wizard (Info → Vitals → Lifestyle → Symptoms)
Random Forest Diagnostic Engine — 200-tree model trained on 60,000 samples across 377 symptom features and 658 disease classes
Dynamic Content Routing — Real-time fuzzy search resolving instantly to structured, on-demand pages for any disease or medication
Report & Scan Parsing — OCR-based extraction from uploaded medical reports and scans
Medication Tracker — Dosage/frequency logging, pill-compliance calendar, and drug-interaction alerts
Health Insights — LLM-generated wellness suggestions from historical blood pressure, blood sugar, and weight trends
Clinical Action Suite — Client-side PDF report generation, one-tap sharing, and dashboard record saving
Secure Authentication — Firebase Auth with Google OAuth login
📊 Model Performance
Metric	Score
Top-1 Accuracy	80.77%
Top-3 Accuracy	93.62%
Top-5 Accuracy	96.72%

Benchmarked against Decision Tree, Random Forest, XGBoost, Gradient Boosting, and LightGBM — Random Forest (200 estimators) selected for production.

🛠️ Tech Stack

Frontend: Next.js 16 (App Router, Turbopack), React 19, TypeScript, TailwindCSS v4, Framer Motion Backend / ML: Python 3.11, FastAPI, Uvicorn, Scikit-learn, XGBoost, LightGBM, Joblib Data & Auth: Firebase Auth / Firestore, Pandas, NumPy Documents: ReportLab, jsPDF Infra: Docker, Docker Compose, GitHub, Render Cloud

🗺️ Project Milestones
Milestone	Focus	Status
1	Core framework setup, data preprocessing & EDA, baseline Decision Tree	✅ Completed
2	ML model benchmarking (5 classifiers) & production model selection	✅ Completed
3	UI/UX overhaul, dual-mode symptom checker, FastAPI ↔ Next.js integration	✅ Completed
4	Cloud deployment on Render, GitHub sync, Firebase Auth in production	✅ Completed
📂 Project Structure
medassist-ai/
├── src/app/(public)/[category]/[title]/   # Dynamic content routing (diseases/medications)
├── src/app/dashboard/                     # Patient dashboard (symptom checker, meds, insights, reports)
├── ml_backend/                            # FastAPI ML microservice
│   ├── app.py                             # /predict and /health endpoints
│   ├── best_model.joblib                  # Trained Random Forest model
│   ├── label_encoder.joblib               # 658-class label encoder
│   └── feature_names.json                 # 377-feature schema
├── docker-compose.yml
└── render.yaml
⚙️ Getting Started
bash
# Clone the repository
git clone https://github.com/<your-username>/medassist-ai.git
cd medassist-ai

# Install frontend dependencies
npm install

# Set up the ML backend
cd ml_backend
pip install -r requirements.txt

# Run with Docker Compose (recommended)
docker compose up --build

The frontend runs on http://localhost:3000 and the ML microservice on http://localhost:8000.

Environment Variables

Create a .env.local file with your Firebase and API keys (see .env.example):

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
GROQ_API_KEY=
☁️ Deployment

Deployed on Render using a multi-stage Docker build pipeline, with authorized domains and Google OAuth configured in Firebase Console. Also supports Vercel (frontend) + Hugging Face Spaces (ML microservice) and AWS EC2 via Docker Compose.

⚠️ Disclaimer

MedAssist AI is an educational/informational tool and is not a substitute for professional medical diagnosis or treatment. Always consult a qualified healthcare provider for medical concerns.

👤 TEAM MEMBER

Mohammad Aleem Qurammi 
