"""
Training & Evaluation Script for MedAssist AI Risk Assessment Module.

Dataset: BRFSS 2024 (Behavioral Risk Factor Surveillance System)
Target Creation: Composite Risk_Level derived from multiple chronic disease indicators:
- DIABETE4 (Diabetes)
- CVDINFR4 (Heart Attack / Myocardial Infarction)
- CVDCRHD4 (Coronary Heart Disease / Angina)
- CVDSTRK3 (Stroke)
- CHCKDNY2 (Kidney Disease)
- CHCCOPD3 (COPD / Chronic Bronchitis)
- ASTHMA3 (Asthma)

Target Labels:
- 0: Low Risk
- 1: Medium Risk
- 2: High Risk

Models Trained & Compared:
1. Random Forest Classifier
2. XGBoost Classifier

The better performing model (based on Macro F1 Score) is automatically saved to app/models/risk_model.pkl.
"""

import os
import sys
import time
import joblib
import numpy as np
import pandas as pd
import xgboost as xgb

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "app", "datasets", "BRFSS2024.csv")
MODEL_DIR = os.path.join(BASE_DIR, "app", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "risk_model.pkl")

CHRONIC_DISEASE_COLS = [
    "DIABETE4",  # Diabetes
    "CVDINFR4",  # Heart Attack
    "CVDCRHD4",  # Coronary Heart Disease
    "CVDSTRK3",  # Stroke
    "CHCKDNY2",  # Kidney Disease
    "CHCCOPD3",  # COPD / Chronic Bronchitis
    "ASTHMA3",   # Asthma
]

FEATURE_COLS = [
    "_AGE80",    # Age in years (18-80)
    "_SEX",      # Sex (1=Male, 2=Female)
    "_BMI5",     # Body Mass Index (*100)
    "GENHLTH",   # General health (1=Excellent to 5=Poor)
    "PHYSHLTH",  # Physical health days not good (1-30, 88=0)
    "MENTHLTH",  # Mental health days not good (1-30, 88=0)
    "EXERANY2",  # Physical activity in past 30 days (1=Yes, 2=No)
    "SMOKE100",  # Smoked 100+ cigarettes (1=Yes, 2=No)
    "DRNKANY6",  # Alcohol consumption past 30 days (1=Yes, 2=No)
    "DIABETE4",  # Diabetes status
    "CHCKDNY2",  # Kidney disease
    "ASTHMA3",   # Asthma
    "CHCCOPD3",  # COPD
    "HAVARTH4",  # Arthritis (1=Yes, 2=No)
]


def load_and_preprocess_data(dataset_path: str):
    """
    Loads BRFSS2024 dataset, constructs multi-disease composite target,
    and preprocesses patient feature columns.
    """
    print(f"Loading BRFSS2024 dataset from: {dataset_path}...")
    start_time = time.time()

    # Load required columns
    all_req_cols = list(set(FEATURE_COLS + CHRONIC_DISEASE_COLS))
    df = pd.read_csv(dataset_path, usecols=all_req_cols, low_memory=False)
    print(f"Dataset loaded in {time.time() - start_time:.2f}s. Initial Shape: {df.shape}")

    # Build binary flags for chronic diseases (1 = Has condition, 0 = No)
    # BRFSS coding: 1 = Yes, others = No/Not reported
    is_diab = (df["DIABETE4"] == 1.0).astype(int)
    is_infar = (df["CVDINFR4"] == 1.0).astype(int)
    is_chd = (df["CVDCRHD4"] == 1.0).astype(int)
    is_stroke = (df["CVDSTRK3"] == 1.0).astype(int)
    is_kidney = (df["CHCKDNY2"] == 1.0).astype(int)
    is_copd = (df["CHCCOPD3"] == 1.0).astype(int)
    is_asthma = (df["ASTHMA3"] == 1.0).astype(int)

    # Major severe cardiovascular event
    has_cardio_event = (is_infar | is_stroke | is_chd)

    # Total chronic condition count per patient
    total_chronic_count = is_diab + is_infar + is_chd + is_stroke + is_kidney + is_copd + is_asthma

    # Construct Composite Risk_Level Target:
    # 2 (High Risk)   : Major cardiovascular event OR 2+ chronic diseases
    # 1 (Medium Risk) : Exactly 1 chronic disease
    # 0 (Low Risk)    : 0 chronic diseases
    target_series = np.where(
        (has_cardio_event == 1) | (total_chronic_count >= 2), 2,
        np.where(total_chronic_count == 1, 1, 0)
    )

    y = pd.Series(target_series, name="Risk_Level")
    X = df[FEATURE_COLS].copy()

    print("\nComposite Target 'Risk_Level' Distribution:")
    print(f"  0 (Low Risk)   : {(y == 0).sum()} ({(y == 0).mean() * 100:.1f}%)")
    print(f"  1 (Medium Risk): {(y == 1).sum()} ({(y == 1).mean() * 100:.1f}%)")
    print(f"  2 (High Risk)  : {(y == 2).sum()} ({(y == 2).mean() * 100:.1f}%)")

    # Feature Preprocessing:

    # 1. Age (_AGE80): 18-99 -> 18-99, invalid -> NaN
    X["_AGE80"] = np.where(X["_AGE80"].between(18, 99), X["_AGE80"], np.nan)

    # 2. Sex (_SEX): 1=Male, 2=Female -> Male=1, Female=0
    X["_SEX"] = np.where(X["_SEX"] == 1, 1, np.where(X["_SEX"] == 2, 0, np.nan))

    # 3. BMI (_BMI5): Stored as BMI * 100 -> divide by 100
    X["_BMI5"] = np.where(X["_BMI5"].between(1000, 9000), X["_BMI5"] / 100.0, np.nan)

    # 4. General Health (GENHLTH): 1-5 -> 1-5, invalid -> NaN
    X["GENHLTH"] = np.where(X["GENHLTH"].between(1, 5), X["GENHLTH"], np.nan)

    # 5. Physical Health Days (PHYSHLTH): 88=0, 1-30 -> 1-30, invalid -> NaN
    X["PHYSHLTH"] = np.where(X["PHYSHLTH"] == 88, 0, np.where(X["PHYSHLTH"].between(1, 30), X["PHYSHLTH"], np.nan))

    # 6. Mental Health Days (MENTHLTH): 88=0, 1-30 -> 1-30, invalid -> NaN
    X["MENTHLTH"] = np.where(X["MENTHLTH"] == 88, 0, np.where(X["MENTHLTH"].between(1, 30), X["MENTHLTH"], np.nan))

    # 7. Binary Yes/No fields: EXERANY2, SMOKE100, DRNKANY6, CHCKDNY2, ASTHMA3, CHCCOPD3, HAVARTH4
    binary_cols = ["EXERANY2", "SMOKE100", "DRNKANY6", "CHCKDNY2", "ASTHMA3", "CHCCOPD3", "HAVARTH4"]
    for col in binary_cols:
        X[col] = np.where(X[col] == 1, 1, np.where(X[col] == 2, 0, np.nan))

    # 8. Diabetes (DIABETE4): 1=Yes -> 1, others -> 0
    X["DIABETE4"] = np.where(X["DIABETE4"] == 1, 1, np.where(X["DIABETE4"].isin([2, 3, 4]), 0, np.nan))

    return X, y


def train_and_evaluate_models():
    """
    Trains Random Forest and XGBoost models, evaluates metrics,
    compares performance, and saves the winning model to risk_model.pkl.
    """
    X, y = load_and_preprocess_data(DATASET_PATH)
    

    print("\nSplitting dataset into Train (80%) and Test (20%)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print("Imputing missing values with median strategy...")
    imputer = SimpleImputer(strategy="median")
    X_train_imp = imputer.fit_transform(X_train)
    X_test_imp = imputer.transform(X_test)
    # Save cleaned dataset
    X_all_imp = pd.DataFrame(
        imputer.transform(X),
        columns=X.columns
    )

    X_all_imp["Risk_Level"] = y.values

    cleaned_path = os.path.join(
        BASE_DIR,
        "app",
        "datasets",
        "BRFSS2024_Cleaned.csv"
    )

    X_all_imp.to_csv(cleaned_path, index=False)

    print(f"Cleaned dataset saved to: {cleaned_path}")

    # --- Model 1: Random Forest Classifier ---
    print("\n" + "=" * 60)
    print("TRAINING MODEL 1: Random Forest Classifier")
    print("=" * 60)
    rf_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        min_samples_split=10,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    start_rf = time.time()
    rf_model.fit(X_train_imp, y_train)
    rf_time = time.time() - start_rf
    print(f"Random Forest training completed in {rf_time:.2f}s")

    y_pred_rf = rf_model.predict(X_test_imp)
    acc_rf = accuracy_score(y_test, y_pred_rf)
    prec_rf = precision_score(y_test, y_pred_rf, average="macro", zero_division=0)
    rec_rf = recall_score(y_test, y_pred_rf, average="macro", zero_division=0)
    f1_rf = f1_score(y_test, y_pred_rf, average="macro", zero_division=0)
    cm_rf = confusion_matrix(y_test, y_pred_rf)

    print(f"Random Forest Accuracy : {acc_rf:.4f}")
    print(f"Random Forest Precision: {prec_rf:.4f} (macro)")
    print(f"Random Forest Recall   : {rec_rf:.4f} (macro)")
    print(f"Random Forest F1-Score : {f1_rf:.4f} (macro)")
    print("\nRandom Forest Confusion Matrix:")
    print(cm_rf)
    print("\nRandom Forest Classification Report:")
    print(classification_report(y_test, y_pred_rf, target_names=["Low", "Medium", "High"]))

    # --- Model 2: XGBoost Classifier ---
    print("\n" + "=" * 60)
    print("TRAINING MODEL 2: XGBoost Classifier")
    print("=" * 60)
    xgb_model = xgb.XGBClassifier(
        n_estimators=150,
        max_depth=6,
        learning_rate=0.1,
        eval_metric="mlogloss",
        random_state=42,
        n_jobs=-1,
    )
    start_xgb = time.time()
    xgb_model.fit(X_train_imp, y_train)
    xgb_time = time.time() - start_xgb
    print(f"XGBoost training completed in {xgb_time:.2f}s")

    y_pred_xgb = xgb_model.predict(X_test_imp)
    acc_xgb = accuracy_score(y_test, y_pred_xgb)
    prec_xgb = precision_score(y_test, y_pred_xgb, average="macro", zero_division=0)
    rec_xgb = recall_score(y_test, y_pred_xgb, average="macro", zero_division=0)
    f1_xgb = f1_score(y_test, y_pred_xgb, average="macro", zero_division=0)
    cm_xgb = confusion_matrix(y_test, y_pred_xgb)

    print(f"XGBoost Accuracy : {acc_xgb:.4f}")
    print(f"XGBoost Precision: {prec_xgb:.4f} (macro)")
    print(f"XGBoost Recall   : {rec_xgb:.4f} (macro)")
    print(f"XGBoost F1-Score : {f1_xgb:.4f} (macro)")
    print("\nXGBoost Confusion Matrix:")
    print(cm_xgb)
    print("\nXGBoost Classification Report:")
    print(classification_report(y_test, y_pred_xgb, target_names=["Low", "Medium", "High"]))

    # --- Automatic Model Selection ---
    print("\n" + "=" * 60)
    print("AUTOMATIC MODEL SELECTION & COMPARISON")
    print("=" * 60)
    print(f"Random Forest Macro F1 Score: {f1_rf:.4f}")
    print(f"XGBoost       Macro F1 Score: {f1_xgb:.4f}")

    if f1_xgb >= f1_rf:
        winning_name = "XGBoost Classifier"
        winning_model = xgb_model
        winning_metrics = {
            "accuracy": acc_xgb,
            "precision": prec_xgb,
            "recall": rec_xgb,
            "f1_score": f1_xgb,
        }
    else:
        winning_name = "Random Forest Classifier"
        winning_model = rf_model
        winning_metrics = {
            "accuracy": acc_rf,
            "precision": prec_rf,
            "recall": rec_rf,
            "f1_score": f1_rf,
        }

    print(f"\n[SELECTED MODEL] {winning_name} (Macro F1 = {winning_metrics['f1_score']:.4f})")

    # Save winning model payload
    os.makedirs(MODEL_DIR, exist_ok=True)
    model_payload = {
        "model": winning_model,
        "imputer": imputer,
        "model_name": winning_name,
        "feature_cols": FEATURE_COLS,
        "target_labels": {0: "Low", 1: "Medium", 2: "High"},
        "metrics": winning_metrics,
    }

    joblib.dump(model_payload, MODEL_PATH)
    print(f"Saved winning model artifact to: {MODEL_PATH}")


if __name__ == "__main__":
    train_and_evaluate_models()

