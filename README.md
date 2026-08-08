# MedAssist AI

## Milestone 1 Submission

### Team Member
**Tahura Shaikh**

## Project Title
MedAssist AI: Medical Symptom Analysis & Disease Prediction System

## Work Completed

### Frontend
- Added frontend source code
- Added project configuration files

### Data Analysis
- Loaded and analyzed three medical datasets
- Removed duplicate records
- Standardized datasets
- Performed Exploratory Data Analysis (EDA)

### Machine Learning
- Built a Decision Tree Classifier
- Evaluated model performance
- Saved trained model and feature information

### Documentation
- Added Milestone 1 Project Report

## Technologies Used
- Python
- Jupyter Notebook
- Pandas
- NumPy
- Scikit-learn
- HTML/CSS
- Next.js

---

# Milestone 2 Submission

## Machine Learning Model Development

### Dataset Preparation
- Used the cleaned Dataset 2 as the source dataset for machine learning development.
- Analyzed disease class distribution and identified severely underrepresented rare disease classes.
- Created `dataset2_training.csv` by removing extremely rare disease classes and applying stratified sampling.
- Prepared a manageable and representative dataset containing approximately 60,000 samples, 377 symptom features, and 658 disease classes.
- Performed an 80:20 train-test split for model training and evaluation.

### Machine Learning Models
- Built and evaluated five classification models:
  - Decision Tree Classifier
  - Random Forest Classifier
  - XGBoost Classifier
  - Gradient Boosting Classifier
  - LightGBM Classifier
- Compared the performance of all models based on classification accuracy.
- Evaluated Random Forest using Top-1, Top-3, and Top-5 accuracy.
- Tested Random Forest with 100 and 200 trees.

### Model Performance

| Model | Accuracy |
|---|---|
| Decision Tree | 73.88% |
| Random Forest (100 Trees) | 80.38% |
| Random Forest (200 Trees) | **80.77%** |
| XGBoost | 76.77% |
| Gradient Boosting | 4.57% |
| LightGBM | 0.5% |

### Final Model Selection

**Random Forest Classifier with 200 Trees** was selected as the final machine learning model for MedAssist AI because it achieved the highest confirmed Top-1 accuracy among all five evaluated models.

- **Top-1 Accuracy:** 80.77%
- **Top-3 Accuracy:** 93.62%
- **Top-5 Accuracy:** 96.72%

The selected Random Forest model will be used for integration into the MedAssist AI disease prediction system.

### Machine Learning Documentation
- Added Machine Learning Model Evaluation Report.
- Documented dataset preparation and rare disease class handling.
- Documented the performance comparison of all five machine learning models.
- Documented the final Random Forest model selection and Top-K accuracy results.

---
# Milestone 3 Submission

## UI/UX, Testing & Improvements

### Work Completed
- Improved UI/UX and web page designs.
- Improved and reviewed datasets.
- Performed end-to-end application testing.
- Fixed bugs and integration issues.
- Improved disease prediction and Knowledge Base workflow.
- Enhanced overall application usability and performance.

### Remaining Work
- Final testing and bug fixing.
- Final documentation and deployment.

## Milestone Status

- **Milestone 1:** Completed
- **Milestone 2:** Completed
- **Milestone 3:** Completed
