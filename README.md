# 🩺 MedAssistAI

### AI-Based Medical Symptom Analysis & Disease Prediction System

MedAssistAI is an AI-based medical symptom analysis and disease prediction system that predicts possible diseases from user-selected symptoms using Machine Learning.

The project combines a **Next.js frontend**, **FastAPI backend**, and a trained **CatBoost disease prediction model**.

After predicting a disease, the system provides additional disease-related information including **description, precautions, medicines, diet recommendations, lifestyle recommendations, specialist information, and severity**.

> ⚠️ **Medical Disclaimer:** MedAssistAI is an educational and project demonstration system. It is not intended to replace professional medical diagnosis, medical advice, or treatment.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🩺 Symptom Analysis | Users can select symptoms through the application |
| 🤖 Disease Prediction | Predicts diseases using a trained CatBoost model |
| 🧠 240 Diseases | Supports prediction across 240 disease classes |
| 🔬 377 Symptoms | Uses 377 binary symptom features |
| 📋 Disease Information | Displays information about the predicted disease |
| ⚠️ Precautions | Provides precautionary information |
| 💊 Medicines | Displays medicine-related information |
| 🥗 Diet Recommendations | Provides diet-related recommendations |
| 🏃 Lifestyle Recommendations | Provides lifestyle recommendations |
| 👨‍⚕️ Specialist | Suggests the relevant medical specialist |
| 🔴 Severity | Displays the recorded severity level |
| 🔗 REST API | Frontend communicates with the FastAPI backend |
| 🌐 Deployment | Frontend and backend are deployed separately |

---

## 🤖 Machine Learning

The disease prediction module was developed using a large disease-symptom dataset.

### Dataset

- **240 diseases**
- **377 symptom features**
- Binary symptom representation
- More than **150,000 records** used during model development

### Models Evaluated

Several machine learning models were trained and compared:

- Naive Bayes
- Logistic Regression
- K-Nearest Neighbors
- Decision Tree
- Random Forest
- Extra Trees
- CatBoost
- Additional ensemble and deep-learning approaches

### Model Performance

| Model | Accuracy |
|---|---:|
| Naive Bayes | 86.60% |
| CatBoost | 86.30% |
| Logistic Regression | 86.25% |
| KNN | 82.82% |
| Random Forest | 75.90% |
| Extra Trees | 74.03% |
| Decision Tree | 13.72% |

**CatBoost was selected as the final model for application integration.**

## 🔄 Prediction Workflow

**User**  
↓  
**Select Symptoms**  
↓  
**Next.js Frontend**  
↓  
**FastAPI REST API**  
↓  
**Feature Processing**  
↓  
**CatBoost Model**  
↓  
**Predicted Disease**  
↓  
**Disease Information Dataset**  
↓  
**Description + Precautions + Medicines**  
**Diet + Lifestyle + Specialist + Severity**  
↓  
**Display Results**

---

## 🏗️ Tech Stack

### **Frontend**

- Next.js
- React
- Tailwind CSS
- JavaScript

### **Backend**

- Python
- FastAPI
- Uvicorn
- REST API

### **Machine Learning**

- Python
- Pandas
- NumPy
- Scikit-learn
- CatBoost
- Joblib
- Matplotlib
- Jupyter Notebook

### **Development Tools**

- Google Colab
- Visual Studio Code
- Git
- GitHub

### **Deployment**

- **Vercel** – Frontend
- **Render** – Backend and Machine Learning Model

---

## 🌐 Deployment

The final MedAssistAI application was deployed using separate platforms for the frontend and backend.

### **Frontend – Vercel**

The Next.js frontend is deployed on Vercel.

Vercel was selected because it provides convenient hosting and deployment support for Next.js applications.

The frontend communicates with the deployed FastAPI backend through REST API requests.

### **Backend – Render**

The FastAPI backend and trained CatBoost model are deployed on Render.

The backend deployment includes:

- FastAPI application
- Trained CatBoost model
- Feature-column configuration
- Label encoder
- Disease information dataset
- Required Python dependencies

The backend receives the symptoms submitted by the user, processes the input features, passes them to the CatBoost model, and returns the predicted disease and related information.

### **Deployment Architecture**

**User**  
↓  
**Vercel – Next.js Frontend**  
↓  
**REST API Request**  
↓  
**Render – FastAPI Backend**  
↓  
**Feature Processing**  
↓  
**CatBoost Model**  
↓  
**Disease Prediction**  
↓  
**Disease Information**  
↓  
**API Response**  
↓  
**Vercel Frontend**  
↓  
**Display Results**

---

## 🌐 Live Application

### **MedAssistAI / HealthAssistAI**

🔗 https://healthassistai-one.vercel.app/

---

## 📁 Project Structure

    MedAssist-AI/
    │
    ├── backend/
    │   ├── ml/
    │   │   ├── datasets/
    │   │   ├── notebooks/
    │   │   └── saved_models/
    │   │
    │   ├── app/
    │   ├── requirements.txt
    │   └── ...
    │
    ├── frontend/
    │   ├── app/
    │   ├── components/
    │   ├── public/
    │   └── ...
    │
    ├── docs/
    │   ├── Milestone Reports
    │   └── Project Documentation
    │
    └── README.md

---

## 📊 Project Status

- ✅ Dataset preparation completed
- ✅ EDA completed
- ✅ 240-disease dataset prepared
- ✅ Multiple ML models evaluated
- ✅ CatBoost model selected
- ✅ Disease prediction module integrated
- ✅ Disease information dataset integrated
- ✅ Frontend and backend integrated
- ✅ REST API implemented
- ✅ Application deployed
- ✅ End-to-end testing completed
- ✅ Final project demonstration completed

---

## ⚕️ Medical Disclaimer

This application is developed for **educational, research, and project demonstration purposes only**.

The predicted disease and associated information should not be considered a medical diagnosis or a substitute for professional medical advice.

Users should consult a qualified healthcare professional for proper diagnosis, treatment, and medical guidance.