🩺 MedAssistAI

 AI-Based Medical Symptom Analysis & Disease Prediction System

MedAssistAI is an AI-powered healthcare application that predicts possible diseases based on user symptoms using Machine Learning. The application combines a Random Forest Classifier with a FastAPI backend to provide disease predictions along with healthcare recommendations such as disease descriptions, precautions, diet plans, medications, and workout suggestions.

The project is designed with a modular architecture, making it scalable, maintainable, and easy to integrate with modern web applications.

📌 Project Overview

Healthcare diagnosis often requires expert consultation, which may not always be immediately available. MedAssistAI assists users by analyzing symptoms and predicting the most probable disease using Machine Learning. Along with prediction, the system provides essential healthcare recommendations to improve awareness before consulting a medical professional.

🎯 Objectives

- Predict diseases from user symptoms using Machine Learning.
- Provide healthcare recommendations.
- Improve dataset quality through preprocessing.
- Build a scalable backend using FastAPI.
- Develop REST APIs for frontend integration.
- Create a user-friendly healthcare assistance platform.

✨ Features

- Symptom-Based Disease Prediction
- Machine Learning Powered Diagnosis
- Disease Description
- Precaution Recommendations
- Diet Recommendations
- Medication Suggestions
- Workout Recommendations
- Duplicate Dataset Detection
- Dataset Cleaning
- Model Training
- Model Evaluation
- Cross Validation
- FastAPI REST APIs
- Interactive Swagger Documentation

🛠️ Technology Stack

Programming Language
- Python

Machine Learning
- Scikit-learn
- Random Forest Classifier
- Pandas
- NumPy

Backend
- FastAPI
- Uvicorn

Frontend
- Next.js
- React.js

Version Control
- Git
- GitHub

 📂 Project Structure

MedAssistAI/
│
├── backend/
│   ├── main.py                     # FastAPI Backend
│   ├── train_model.py              # Machine Learning Model Training
│   ├── recommendation.py           # Recommendation Engine
│   ├── disease_info.py             # Disease Information Module
│   ├── disease_prediction.pkl      # Trained Model
│   └── label_encoder.pkl           # Label Encoder
│
├── datasets/
│   ├── Training.csv
│   ├── symptom_Description.csv
│   ├── symptom_precaution.csv
│   ├── diets.csv
│   ├── medications.csv
│   ├── workout_df.csv
│   └── Training_Clean.csv
│
├── check_duplicates.py             # Duplicate Record Detection
├── remove_duplicates.py            # Dataset Cleaning
├── cross_validation.py             # 5-Fold Cross Validation
│
├── README.md
└── LICENSE

 📊 Dataset

The project utilizes healthcare datasets containing disease-related information.

The datasets include:

- Disease and Symptom Mapping
- Disease Descriptions
- Precaution Recommendations
- Diet Suggestions
- Medication Information
- Workout Recommendations

🧹 Data Preprocessing

To improve the quality of the Machine Learning model, the dataset undergoes preprocessing before training.

The preprocessing steps include:

- Dataset Collection
- Duplicate Detection
- Duplicate Removal
- Dataset Cleaning
- Feature Preparation
- Data Validation

These steps ensure that the training data is clean, consistent, and suitable for building an accurate prediction model.

 🤖 Machine Learning Workflow

Dataset Collection
        │
        ▼
Duplicate Detection
        │
        ▼
Duplicate Removal
        │
        ▼
Clean Dataset Generation
        │
        ▼
Model Training
        │
        ▼
Model Evaluation
        │
        ▼
Cross Validation
        │
        ▼
Model Serialization (.pkl)
        │
        ▼
FastAPI Integration
        │
        ▼
Disease Recommendation API

📈 Model Evaluation

The Machine Learning model was evaluated using multiple performance metrics.

Evaluation metrics include:

- Accuracy
- Precision
- Recall
- F1-Score
- Confusion Matrix
- 5-Fold Cross Validation

These metrics help validate the reliability and consistency of the prediction model.


🌐 Backend Development

The backend is implemented using FastAPI.

The trained Machine Learning model is integrated into REST APIs that provide healthcare recommendations based on predicted diseases.

🔗 API Endpoints

Home Endpoint

GET /

Returns a welcome message indicating that the backend service is running successfully.

Disease Recommendation Endpoint

GET /recommendation/{disease}

Example:
GET /recommendation/Diabetes

Returns:

- Disease Name
- Description
- Precautions
- Diet Recommendations
- Medication Suggestions
- Workout Recommendations

⚙️ Installation & Setup

Clone Repository

bash
git clone https://github.com/GKSJ-AI-CliniScan/MedAssistAI.git

Backend Setup

bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload

Frontend Setup

```bash
npm install

npm run dev
```

🧪 API Testing

After starting the backend server, the API can be tested using Swagger UI.

Backend Server
http://127.0.0.1:8000

Swagger Documentation
http://127.0.0.1:8000/docs

Frontend
http://localhost:3000

📌 Milestone 1 Progress

The following tasks have been successfully completed:

- ✅ Project Setup
- ✅ Dataset Collection
- ✅ Data Preprocessing
- ✅ Duplicate Detection
- ✅ Duplicate Removal
- ✅ Machine Learning Model Training
- ✅ Model Evaluation
- ✅ Cross Validation
- ✅ Disease Information Module
- ✅ Recommendation Module
- ✅ FastAPI Backend Development
- ✅ API Integration
- ✅ Swagger API Testing
- ✅ GitHub Version Control

 🚀 Future Enhancements

- Integrate multiple healthcare datasets.
- Improve prediction accuracy using larger datasets.
- Add patient authentication.
- Develop patient profile management.
- Build doctor dashboard.
- Generate downloadable medical reports.
- Integrate MongoDB.
- Deploy the application on cloud platforms.
- Develop a mobile application.

👨‍💻 Team

Project Name: MedAssistAI

Domain: Artificial Intelligence & Healthcare

Team: GKSJ-AI-CliniScan (Team 5)

📄 License

This project is licensed under the MIT License.

🙏 Acknowledgements

This project was developed using open-source technologies and libraries, including:

- FastAPI
- Scikit-learn
- Pandas
- NumPy
- React.js
- Next.js
- GitHub

We also acknowledge the publicly available healthcare datasets used for research and educational purposes.