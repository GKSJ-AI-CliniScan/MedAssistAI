# MedAssist AI – Milestone 3 (Machine Learning Pipeline & System Integration)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-15B058?logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io/)
[![LightGBM](https://img.shields.io/badge/LightGBM-4A90E2?logo=lightgbm&logoColor=white)](https://lightgbm.readthedocs.io/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

> **Individual Submission Repository**  
> This repository documents my individual contributions to **Milestone 3** of the MedAssist AI project, focusing on the end-to-end Machine Learning pipeline optimization, ensemble modeling, and full-system integration.

---

## 🌟 Project Overview

This repository contains my individual contributions to **Milestone 3** of the **MedAssist AI** clinical symptom screening and disease prediction platform.

In this milestone, my primary responsibilities encompassed:
- **Dataset Analysis**: Diagnosing root causes of low accuracy and class imbalance issues from earlier milestones.
- **Data Preprocessing**: Implementing robust feature preparation, stratified train-test splits, single-sample class handling, and downsampling techniques.
- **Model Development & Optimization**: Building and training Random Forest, XGBoost, Gradient Boosting, and LightGBM classifiers.
- **Hyperparameter Tuning**: Fine-tuning model parameters across cross-validation folds to maximize predictive power.
- **Model Evaluation**: Rigorously evaluating models across multidimensional clinical metrics (Accuracy, Precision, Recall, F1, Macro F1, Top-3 Accuracy, and Rare Disease sensitivity).
- **Ensemble Learning Experimentation**: Constructing and calibrating a high-accuracy Voting Classifier ensemble.
- **Full System Integration**: Connecting the Machine Learning pipeline with the FastAPI backend and React 19 + Vite frontend.
- **End-to-End Validation**: Conducting comprehensive system testing across authentication, symptom screening, predictive analytics, and automated reporting.

---

## 💼 My Contributions

| Area | Contribution |
| :--- | :--- |
| **Dataset Analysis** | Investigated causes of low accuracy from previous milestones, identified severe class imbalance and sparse feature representations. |
| **Data Preprocessing** | Engineered feature vectors, handled single-sample classes, configured balanced train-test splits, and applied downsampling. |
| **Machine Learning** | Developed, trained, and compared Random Forest, XGBoost, Gradient Boosting, and LightGBM classifiers. |
| **Hyperparameter Tuning** | Tuned learning rates, tree depths, estimators, and regularization parameters to boost generalization performance. |
| **Model Evaluation** | Compared models using Accuracy, Precision, Recall, F1, Macro F1, Top-3 Accuracy, and Rare Disease metrics. |
| **Ensemble Learning** | Engineered the final soft-voting ensemble classifier combining top-performing tree-based algorithms. |
| **System Integration** | Integrated the React frontend, FastAPI backend, JWT authentication, analytics dashboards, reporting engine, and ML pipeline. |
| **Testing & Validation** | Performed end-to-end validation across the complete user flow from symptom submission to inference and report generation. |

---

## 📂 Repository Structure

```
MedAssistAI/
├── Milestone 1/
│   ├── Milestone 1 Report.pdf          # Milestone 1 submission & analysis report
│   ├── apply_severity.py               # Severity weighting & scoring logic
│   ├── evaluate_and_test.py            # Baseline model evaluation script
│   ├── models/                         # Trained ML model weights & label encoders
│   │   ├── best_model.pkl
│   │   ├── label_encoder.pkl
│   │   └── random_forest_model.pkl
│   ├── notebooks/                      # Exploratory Data Analysis & baseline training
│   │   ├── 01_Data_Exploration.ipynb
│   │   └── 02_Model_Training.ipynb
│   ├── processed_data/                 # Cleaned, mapped, and weighted datasets
│   │   ├── final_dataset.csv
│   │   └── weighted_final_dataset.csv
│   └── frontend/                       # Interactive React 19 + Vite client dashboard
│       ├── public/                     # Static assets & SVG icons
│       ├── src/
│       │   ├── components/             # Reusable UI components & chart widgets
│       │   ├── context/                # AuthContext & session state providers
│       │   ├── hooks/                  # Custom hooks (auth, reports, symptoms)
│       │   ├── pages/                  # Screening, prediction, risk & analytics views
│       │   ├── routes/                 # Protected route definitions
│       │   └── services/               # API integration client & mock services
│       ├── package.json                # Frontend dependencies
│       └── vite.config.js              # Vite build configuration
│
├── Milestone 2/
│   ├── Milestone 2 Report.pdf          # Milestone 2 progress & comparative report
│   ├── data_processing.ipynb           # Advanced feature engineering & preprocessing
│   ├── gradient_boosting.ipynb         # Gradient Boosting hyperparameter search
│   ├── model_training.ipynb            # Model comparison & validation experiments
│   └── xg_boost.ipynb                  # XGBoost classifier tuning & benchmarking
│
├── LICENSE                             # MIT License
└── README.md                           # Individual submission documentation
```

---

## 🔄 Machine Learning Workflow

```
Dataset Analysis
       │
       ▼
Data Preprocessing
       │
       ▼
Random Forest
       │
       ▼
XGBoost
       │
       ▼
Gradient Boosting
       │
       ▼
LightGBM
       │
       ▼
Model Evaluation
       │
       ▼
Voting Classifier
       │
       ▼
System Integration
       │
       ▼
End-to-End Testing
```

---

## 🤖 Models Developed

| Model | Purpose |
| :--- | :--- |
| **Random Forest** | Robust baseline ensemble model for non-linear feature interactions |
| **XGBoost** | High-performance gradient boosting model optimized for tabular data |
| **Gradient Boosting** | Comparative sequential ensemble analysis |
| **LightGBM** | Lightweight histogram-based boosting framework for fast training |
| **Voting Classifier** | Final deployed ensemble combining probabilistic confidence outputs |

---

## 📊 Final Performance

### Model Accuracy Comparison

| Model | Accuracy |
| :--- | :---: |
| Random Forest | 76.91% |
| XGBoost | 79.96% |
| LightGBM | 66.29% |
| **Voting Classifier (Deployed)** | **82.95%** |

### Voting Classifier Comprehensive Metrics

| Metric | Score |
| :--- | :---: |
| **Precision** | **87.92%** |
| **Recall** | **82.95%** |
| **F1 Score** | **84.76%** |
| **Macro F1** | **0.6034** |
| **Top-3 Accuracy** | **92.69%** |

<details>
<summary><b>🔍 Performance Highlights & Observations</b></summary>

- **Top-3 Diagnostic Coverage**: Achieving **92.69%** Top-3 accuracy ensures that the true clinical condition is ranked within the top 3 differential diagnoses in over 9 out of 10 cases.
- **Precision-Recall Balance**: The **87.92%** Precision minimizes false alarms in clinical screening while the **82.95%** Recall ensures consistent condition identification.
- **Ensemble Superiority**: The soft-voting ensemble outperformed every individual classifier by **+2.99% to +16.66%**, proving the effectiveness of probabilistic consensus.
</details>

---

## 🛠️ Technologies Used

| Category | Technologies |
| :--- | :--- |
| **Machine Learning & Data Science** | Python 3.10+, Scikit-learn, XGBoost, LightGBM, Pandas, NumPy, Joblib |
| **Backend & API Integration** | FastAPI, Pydantic, Uvicorn, SQLAlchemy, JWT Authentication |
| **Frontend & UI Engineering** | React 19, Vite, Tailwind CSS, Axios, Lucide Icons |

---

## 🚀 Quick Start Guide

<details>
<summary><b>Click to expand setup instructions</b></summary>

### Prerequisites
- **Python**: v3.10+
- **Node.js**: v18+
- **Git**

### 1. Machine Learning & Backend Environment

```bash
# Clone the repository
git clone https://github.com/GKSJ-AI-CliniScan/MedAssistAI.git
cd MedAssistAI

# Create and activate virtual environment
python -m venv venv

# Windows (PowerShell):
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install scikit-learn xgboost lightgbm pandas numpy joblib
```

### 2. Frontend Development Server

```bash
# Navigate to frontend directory
cd "Milestone 1/frontend"

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

> **Frontend UI**: `http://localhost:5173`

</details>

---

## 🎓 Key Learning Outcomes

- **Machine Learning Pipeline Engineering**: Designed reproducible data pipelines from raw symptom matrices to serialized production model artifacts.
- **Advanced Preprocessing & Imbalance Handling**: Mastered stratified data splitting, downsampling, and rare clinical class representation.
- **Hyperparameter Optimization**: Applied systematic grid and random search strategies across tree-based ensembles.
- **Ensemble & Voting Architectures**: Leveraged soft voting to aggregate probabilistic confidence scores from heterogeneous models.
- **Rigorous Multidimensional Evaluation**: Evaluated models beyond raw accuracy using Macro F1, Precision-Recall curves, and Top-K clinical accuracy.
- **Full-Stack System Integration**: Bridged ML inference engines with FastAPI asynchronous endpoints and interactive React frontend workflows.
- **API Architecture & Security**: Implemented JWT-based session security and role-isolated access layers.
- **End-to-End System Testing**: Executed comprehensive validation pipelines ensuring zero regression across the integrated tech stack.

---

## 👤 Author

```text
Sanvi Sawant
Machine Learning Pipeline Development & System Integration
MedAssist AI – Milestone 3
```

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more details.
