# 🩺 MedAssistAI

MedAssistAI is an AI-powered disease prediction system that predicts possible diseases based on a patient's symptoms using Machine Learning. The project combines a **Next.js frontend** with a **FastAPI backend** powered by a trained **Random Forest** model.

---

## 🚀 Features

- Symptom-based disease prediction
- Top 3 disease predictions with confidence scores
- Disease descriptions and precautions
- FastAPI REST API
- Modern Next.js frontend
- Responsive UI

---

## 🛠️ Tech Stack

**Frontend**
- Next.js
- React.js
- Tailwind CSS

**Backend**
- FastAPI
- Python
- Scikit-learn
- Pandas
- NumPy

---

## 📂 Project Structure

```text
MED-ASSIST-AI/
│
├── app/                  # Next.js Frontend
├── public/
├── python_ai/
│   ├── datasets/
│   ├── models/
│   ├── main.py
│   └── requirements.txt
│
├── package.json
└── README.md
```

---

## ⚙️ Setup

### Backend

```bash
cd python_ai

python -m venv .venv

# Windows
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt

uvicorn main:app --reload
```

### Frontend

```bash
npm install

npm run dev
```

---

## 🌐 API

- Backend: http://127.0.0.1:8000
- API Docs: http://127.0.0.1:8000/docs
- Frontend: http://localhost:3000

---

## 📈 Current Status

✅ Machine Learning model completed

✅ FastAPI backend completed

✅ Next.js project initialized

✅ UI templates prepared

🚧 Frontend development in progress

---

## 🚀 Upcoming Features

- User authentication
- Patient profile
- Doctor dashboard
- Report generation
- MongoDB integration


---

## 👨‍💻 Team

**Team 5**

**Project:** MedAssistAI – AI-Based Medical Symptom Analysis & Disease Prediction System