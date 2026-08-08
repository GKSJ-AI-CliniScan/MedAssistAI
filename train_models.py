import pandas as pd
import numpy as np
import json
import joblib
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def load_data(file_path):
    df = pd.read_csv(file_path)
    if 'Unnamed: 133' in df.columns:
        df = df.drop(columns=['Unnamed: 133'])
    return df

def train_and_evaluate():
    print("Loading data...")
    train_df = load_data('../frontend/public/data/Training.csv')
    test_df = load_data('../frontend/public/data/Testing.csv')
    
    X_train = train_df.drop(columns=['prognosis'])
    y_train = train_df['prognosis']
    X_test = test_df.drop(columns=['prognosis'])
    y_test = test_df['prognosis']
    
    feature_names = list(X_train.columns)
    with open('feature_names.json', 'w') as f:
        json.dump(feature_names, f)
        
    print("Encoding labels...")
    le = LabelEncoder()
    y_train_enc = le.fit_transform(y_train)
    y_test_enc = le.transform(y_test)
    
    joblib.dump(le, 'label_encoder.joblib')
    
    models = {
        'RandomForest': RandomForestClassifier(random_state=42, n_jobs=-1),
        'XGBoost': XGBClassifier(random_state=42, eval_metric='mlogloss', n_jobs=-1),
        'LogisticRegression': LogisticRegression(random_state=42, max_iter=1000, n_jobs=-1),
        'SVM': SVC(random_state=42, probability=True)
    }
    
    best_model = None
    best_f1 = 0
    best_name = ""
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train_enc)
        preds = model.predict(X_test)
        
        acc = accuracy_score(y_test_enc, preds)
        prec = precision_score(y_test_enc, preds, average='weighted', zero_division=0)
        rec = recall_score(y_test_enc, preds, average='weighted', zero_division=0)
        f1 = f1_score(y_test_enc, preds, average='weighted', zero_division=0)
        
        print(f"[{name}] Acc: {acc:.4f}, Prec: {prec:.4f}, Rec: {rec:.4f}, F1: {f1:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_name = name
            
    print(f"\nBest Model: {best_name} with F1: {best_f1:.4f}")
    joblib.dump(best_model, 'best_model.joblib')
    print("Model saved to best_model.joblib")

if __name__ == "__main__":
    train_and_evaluate()
