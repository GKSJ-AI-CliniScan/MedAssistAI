import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# ==========================
# Load Dataset
# ==========================

df = pd.read_csv("datasets/Training_NoDuplicates.csv")
# If this gives a file not found error, use:
# df = pd.read_csv("../datasets/Training_Clean.csv")

# ==========================
# Features and Target
# ==========================

X = df.drop("prognosis", axis=1)
y = df["prognosis"]

# ==========================
# Encode Disease Labels
# ==========================

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# ==========================
# Train-Test Split
# ==========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# ==========================
# Train Random Forest Model
# ==========================

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# ==========================
# Prediction
# ==========================

y_pred = model.predict(X_test)

# ==========================
# Accuracy
# ==========================

accuracy = accuracy_score(y_test, y_pred)

print("=" * 60)
print("MODEL TRAINED SUCCESSFULLY")
print("=" * 60)

print(f"Accuracy : {accuracy * 100:.2f}%")

# ==========================
# Classification Report
# ==========================

print("\n" + "=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)

print(classification_report(
    y_test,
    y_pred,
    target_names=label_encoder.classes_
))

# ==========================
# Confusion Matrix
# ==========================

print("\n" + "=" * 60)
print("CONFUSION MATRIX")
print("=" * 60)

print(confusion_matrix(y_test, y_pred))

# ==========================
# Save Model
# ==========================

joblib.dump(model, "backend/disease_prediction_model.pkl")
joblib.dump(label_encoder, "backend/label_encoder.pkl")

print("\nModel Saved Successfully.")
print("Label Encoder Saved Successfully.")