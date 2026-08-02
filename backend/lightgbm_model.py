import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from lightgbm import LGBMClassifier

print("=" * 60)
print("Training LightGBM...")
print("=" * 60)

df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")
# Features and Target
X = df.drop("diseases", axis=1)
y = df["diseases"]

# Rename feature columns for LightGBM
X.columns = X.columns.str.replace(r'[^A-Za-z0-9_]', '_', regex=True)

encoder = LabelEncoder()
y = encoder.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

model = LGBMClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("\n==============================")
print("LIGHTGBM RESULTS")
print("==============================")
print("Accuracy :", accuracy_score(y_test, y_pred) * 100, "%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

import joblib

joblib.dump(
    model,
    "backend/lightgbm_model.pkl"
)

joblib.dump(
    encoder,
    "backend/lightgbm_label_encoder.pkl"
)

print("LightGBM Model Saved Successfully!")