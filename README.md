🧠 MedAssist AI
AI-Powered Medical Symptom Analysis & Disease Prediction Platform

MedAssist AI is an AI-driven healthcare platform designed to provide fast, data-supported symptom assessment, disease risk prediction, and clinical guidance. The system combines a Next.js frontend, FastAPI-based machine learning microservice, and a 200-tree Random Forest diagnostic model trained using 60,000+ clinical records covering 658 disease classes.

🔗 Live Application: https://medassist-ai-platform.onrender.com/

✨ About the Platform

MedAssist AI allows users to enter symptoms and health information, provide vital measurements, and upload medical reports or scans for analysis. The platform produces a ranked differential diagnosis along with risk categorization, urgency guidance, and recommended medical specialists.

Beyond diagnosis, MedAssist AI provides a search-based medical information system for diseases and medications, along with a patient dashboard for medication management, health trends, and diagnostic history.

🚀 Main Features
🩺 AI Symptom Checker

Provides two diagnostic modes:

Quick Analysis: All-in-one symptom assessment form
Guided Assessment: Four-step workflow covering Information → Vitals → Lifestyle → Symptoms
🌲 Random Forest Diagnostic Engine
200-tree Random Forest classifier
Trained on 60,000 clinical samples
Uses 377 symptom features
Predicts across 658 disease classes
🔎 Dynamic Medical Content

Real-time fuzzy search allows users to quickly find diseases and medications and opens dynamically generated structured information pages.

📄 Medical Report & Scan Analysis

Uses OCR-based processing to extract relevant information from uploaded medical reports and scanned documents.

💊 Medication Management

Includes:

Medication and dosage tracking
Frequency logging
Pill-compliance calendar
Drug-interaction alerts
📈 Health Insights

Analyzes historical:

Blood pressure
Blood sugar
Weight

The platform uses an LLM to generate personalized wellness suggestions based on these trends.

📑 Clinical Action Tools

Users can:

Generate PDF reports
Share reports
Save diagnostic records to their dashboard
🔐 Authentication

Secure user authentication is implemented using Firebase Authentication, including Google OAuth login.

📊 Machine Learning Performance
Metric	Result
Top-1 Accuracy	80.77%
Top-3 Accuracy	93.62%
Top-5 Accuracy	96.72%

The diagnostic model was evaluated against multiple machine learning approaches, including Decision Tree, Random Forest, XGBoost, Gradient Boosting, and LightGBM.

The 200-estimator Random Forest model was selected as the production diagnostic model.

🛠️ Technology Stack

Frontend

Next.js 16
App Router
Turbopack
React 19
TypeScript
TailwindCSS v4
Framer Motion

Backend & Machine Learning

Python 3.11
FastAPI
Uvicorn
Scikit-learn
XGBoost
LightGBM
Joblib

Data & Authentication

Firebase Authentication
Firebase Firestore
Pandas
NumPy

Document Processing

ReportLab
jsPDF

Infrastructure & Deployment

Docker
Docker Compose
GitHub
Render Cloud
🗺️ Development Milestones
Milestone	Major Focus	Status
1	Core framework, data preprocessing, EDA and baseline Decision Tree	✅ Completed
2	Benchmarking five ML classifiers and selecting the production model	✅ Completed
3	UI/UX redesign, dual-mode symptom checker and FastAPI–Next.js integration	✅ Completed
4	Render deployment, GitHub synchronization and production Firebase Authentication	✅ Completed
📂 Repository Structure
medassist-ai/
│
├── src/app/(public)/[category]/[title]/
│   └── Dynamic disease/medication content routes
│
├── src/app/dashboard/
│   └── Patient dashboard
│       ├── Symptom Checker
│       ├── Medication Tracker
│       ├── Health Insights
│       └── Medical Reports
│
├── ml_backend/
│   ├── app.py
│   ├── best_model.joblib
│   ├── label_encoder.joblib
│   └── feature_names.json
│
├── docker-compose.yml
└── render.yaml
ML Backend Components
app.py — FastAPI /predict and /health endpoints
best_model.joblib — Trained Random Forest model
label_encoder.joblib — 658-class disease label encoder
feature_names.json — 377-feature input schema
⚙️ Running the Project Locally
1. Clone the repository
git clone https://github.com/<your-username>/medassist-ai.git
cd medassist-ai
2. Install frontend packages
npm install
3. Install ML backend dependencies
cd ml_backend
pip install -r requirements.txt
4. Start using Docker Compose
docker compose up --build

After starting the services:

Frontend: http://localhost:3000
ML API: http://localhost:8000
🔑 Environment Configuration

Create a .env.local file and configure the required Firebase and API credentials:

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
GROQ_API_KEY=
☁️ Deployment

The application is deployed on Render Cloud using a multi-stage Docker build pipeline.

Production configuration includes:

Authorized Firebase domains
Google OAuth authentication
Cloud deployment configuration

The project can additionally support deployment through:

Vercel for the frontend
Hugging Face Spaces for the ML microservice
AWS EC2 using Docker Compose
⚠️ Medical Disclaimer

MedAssist AI is intended strictly as an educational and informational healthcare tool. It does not replace professional medical diagnosis, treatment, or medical advice.

Users should always consult a qualified healthcare professional regarding medical conditions or health concerns.

👤 Team Member
Gorrepati Lokesh Babu