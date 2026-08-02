import pandas as pd
import joblib

from catboost import CatBoostClassifier

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

print("=" * 60)
print("Training CatBoost...")
print("=" * 60)


# ============================
# Load Dataset
# ============================

df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")

print("Dataset Shape:", df.shape)


# ============================
# Features & Target
# ============================

X = df.drop("diseases", axis=1)
y = df["diseases"]


# ============================
# Encode Labels
# ============================

encoder = LabelEncoder()

y = encoder.fit_transform(y)


# ============================
# Train Test Split
# ============================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ============================
# CatBoost Model
# ============================

model = CatBoostClassifier(
    iterations=500,
    depth=8,
    learning_rate=0.05,
    loss_function="MultiClass",
    random_seed=42,
    verbose=100
)


# ============================
# Train Model
# ============================

model.fit(
    X_train,
    y_train
)


# ============================
# Prediction
# ============================

y_pred = model.predict(X_test)

# Convert shape (n,1) to (n,)
y_pred = y_pred.astype(int).flatten()


# ============================
# Evaluation
# ============================

print("\n==============================")
print("CATBOOST RESULTS")
print("==============================")

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("Accuracy :", accuracy * 100, "%")


print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        zero_division=0
    )
)


print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# ============================
# Save Model
# ============================

joblib.dump(
    model,
    "backend/catboost_model.pkl"
)

joblib.dump(
    encoder,
    "backend/catboost_label_encoder.pkl"
)


print("\nCatBoost Model Saved Successfully!")