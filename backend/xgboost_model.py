import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from xgboost import XGBClassifier

print("=" * 60)
print("Training XGBoost...")
print("=" * 60)

# =====================================
# Load Dataset
# =====================================

df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")
# Keep only diseases having at least 2 samples
counts = df["diseases"].value_counts()
df = df[df["diseases"].isin(counts[counts >= 2].index)]

# =====================================
# Features and Target
# =====================================

X = df.drop("diseases", axis=1)
y = df["diseases"]

# Encode labels
encoder = LabelEncoder()
y = encoder.fit_transform(y)

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = XGBClassifier(
    n_estimators=30,
    max_depth=6,
    learning_rate=0.1,
    objective="multi:softprob",
    num_class=len(encoder.classes_),
    eval_metric="mlogloss",
    tree_method="hist",
    random_state=42,
    n_jobs=1
)

# =====================================
# Train
# =====================================

model.fit(X_train, y_train)

# =====================================
# Prediction
# =====================================

y_pred = model.predict(X_test)

# =====================================
# Results
# =====================================

accuracy = accuracy_score(y_test, y_pred)

print("=" * 60)
print("XGBOOST RESULTS")
print("=" * 60)

print(f"Accuracy : {accuracy * 100:.2f}%")

print("\nClassification Report")
print(classification_report(y_test, y_pred, zero_division=0))

print("\nConfusion Matrix")
print(confusion_matrix(y_test, y_pred))

# =====================================
# Save Model
# =====================================

joblib.dump(model, "backend/xgboost_model.pkl")
joblib.dump(encoder, "backend/xgboost_label_encoder.pkl")

print("\nXGBoost Model Saved Successfully.")