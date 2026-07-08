# 🩺 MedAssistAI

MedAssistAI is an AI-powered disease prediction system that predicts possible diseases based on a patient's symptoms using Machine Learning. The project consists of a **Next.js frontend** and a **FastAPI backend** that serves the trained machine learning model.

---

## 🚀 Features

- Symptom-based disease prediction
- Random Forest Machine Learning model
- Top 3 disease predictions with confidence scores
- Disease description
- Recommended precautions
- FastAPI REST API
- Modern Next.js frontend
- Responsive UI generated using Stitch

---

## 🛠 Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- FastAPI
- Python
- Pandas
- NumPy
- Scikit-learn
- Joblib
- Uvicorn

---

## 📂 Project Structure

```
MED-ASSIST-AI/
│
├── app/                           # Next.js App Router
│
├── public/                        # Static assets
│
├── python_ai/                     # AI Backend
│   │
│   ├── datasets/
│   │   ├── final_master_dataset_41_diseases.csv
│   │   ├── symptom_Description.csv
│   │   └── symptom_precaution.csv
│   │
│   ├── models/
│   │   ├── disease_prediction_model.pkl
│   │   ├── feature_columns.pkl
│   │   └── label_encoder.pkl
│   │
│   ├── .venv/                     # Python Virtual Environment
│   ├── __pycache__/
│   ├── main.py                    # FastAPI Server
│   └── requirements.txt
│
├── .next/                         # Next.js Build Files
├── node_modules/                  # Node Dependencies
│
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── favicon.jpeg
├── jsconfig.json
├── LICENSE
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
└── README.md
```

---

## 📊 Machine Learning Pipeline

The disease prediction model was developed using the following workflow:

- Dataset collection from multiple sources
- Dataset preprocessing
- Dataset merging
- Data filtering and cleaning
- Feature engineering
- Model training
- Model evaluation
- Model selection
- Model serialization using Joblib
- FastAPI deployment

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/MedAssistAI.git

cd MedAssistAI
```

---

## 📦 Backend Setup (FastAPI)

Navigate to the backend directory.

```bash
cd backend
```

Create a virtual environment (recommended).

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run the FastAPI server.

```bash
uvicorn main:app --reload
```

The backend server will start at:

```
http://127.0.0.1:8000
```

---

## 💻 Frontend Setup (Next.js)

Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

## ▶️ Running the Complete Project

### Terminal 1 (Backend)

```bash
cd python_ai

.\.venv\Scripts\Activate.ps1

uvicorn main:app --reload
```

### Terminal 2 (Frontend)

```bash
cd frontend

npm install

npm run dev
```

Now open:

```
Frontend
http://localhost:3000

Backend
http://127.0.0.1:8000

```

---

## 📡 API Endpoints

### Home

```
GET /
```

Returns API status.

---

### Health Check

```
GET /health
```

Returns server health information.

---

### Disease Prediction

```
POST /predict
```

Example Request

```json
{
  "data": {
    "age_group": 2,
    "gender": 1,
    "fever": 1,
    "cough": 1,
    "headache": 1
  }
}
```

Example Response

```json
{
  "predicted_disease": "Common Cold",
  "confidence": 91.45,
  "confidence_level": "High",
  "selected_symptoms": [
    "fever",
    "cough",
    "headache"
  ],
  "description": "...",
  "precautions": [
    "...",
    "...",
    "..."
  ],
  "top_predictions": [
    {
      "disease": "Common Cold",
      "probability": 91.45
    },
    {
      "disease": "Influenza",
      "probability": 6.81
    },
    {
      "disease": "COVID-19",
      "probability": 1.74
    }
  ]
}
```

---

## 📁 Model Files

The backend loads the following serialized files:

```
models/
│
├── disease_prediction_model.pkl
├── label_encoder.pkl
└── feature_columns.pkl
```

---

## 📈 Current Progress

- ✅ Dataset collection
- ✅ Dataset preprocessing
- ✅ Dataset merging
- ✅ Data filtering
- ✅ Feature engineering
- ✅ Machine Learning model training
- ✅ Model evaluation
- ✅ Best model selection
- ✅ Model serialization
- ✅ FastAPI backend
- ✅ REST API endpoints
- ✅ Next.js project setup
- ✅ UI templates using Stitch

### 🚧 Upcoming Features

- User authentication
- Patient history
- Doctor dashboard
- Report generation
- PDF export
- Database integration
- Deployment
- Chatbot support

---

## 👨‍💻 Team

**Team 5**

**Project:** MedAssistAI

AI-Based Medical Symptom Analysis & Disease Prediction System

---

