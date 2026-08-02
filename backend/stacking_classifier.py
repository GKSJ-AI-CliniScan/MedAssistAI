import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from sklearn.ensemble import (
    RandomForestClassifier,
    ExtraTreesClassifier,
    GradientBoostingClassifier,
    StackingClassifier
)

from sklearn.linear_model import LogisticRegression

# =====================================
# Load Dataset
# =====================================

df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")
# Reduced sample size to avoid MemoryError
df = df.sample(n=10000, random_state=42)

# =====================================
# Features and Target
# =====================================

X = df.drop("diseases", axis=1)
y = df["diseases"]

# =====================================
# Encode Labels
# =====================================

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# =====================================
# Train-Test Split
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)

# =====================================
# Base Models (Optimized)
# =====================================

estimators = [
    ("rf", RandomForestClassifier(
        n_estimators=30,
        max_depth=15,
        random_state=42,
        n_jobs=1
    )),
    ("et", ExtraTreesClassifier(
        n_estimators=30,
        max_depth=15,
        random_state=42,
        n_jobs=1
    )),
    ("gb", GradientBoostingClassifier(
        n_estimators=50,
        random_state=42
    ))
]

stack_model = StackingClassifier(
    estimators=estimators,
    final_estimator=LogisticRegression(max_iter=1000),
    cv=2,
    n_jobs=1
)

print("=" * 60)
print("Training Stacking Classifier...")
print("=" * 60)

stack_model.fit(X_train, y_train)

# =====================================
# Prediction
# =====================================

y_pred = stack_model.predict(X_test)

# =====================================
# Accuracy
# =====================================

accuracy = accuracy_score(y_test, y_pred)

print("=" * 60)
print("STACKING CLASSIFIER RESULTS")
print("=" * 60)

print(f"Accuracy : {accuracy * 100:.2f}%")

# =====================================
# Classification Report
# =====================================

print("\nClassification Report")

try:
    print(
        classification_report(
            y_test,
            y_pred,
            zero_division=0
        )
    )
except:
    print("Classification report skipped due to large number of classes.")

# =====================================
# Confusion Matrix
# =====================================

print("\nConfusion Matrix")

print(confusion_matrix(y_test, y_pred))

# =====================================
# Save Model
# =====================================

joblib.dump(stack_model, "backend/stacking_classifier.pkl")

print("\nStacking Classifier Saved Successfully.")