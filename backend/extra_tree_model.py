import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import ExtraTreesClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

print("=" * 60)
print("Training Extra Trees...")
print("=" * 60)

# =====================================
# Load Dataset
# =====================================

df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")
# Use a sample to avoid MemoryError
df = df.sample(n=10000, random_state=42)

# =====================================
# Features and Target
# =====================================

X = df.drop("diseases", axis=1)
y = df["diseases"]

# =====================================
# Label Encoding
# =====================================

encoder = LabelEncoder()
y = encoder.fit_transform(y)

# =====================================
# Train Test Split
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# =====================================
# Extra Trees Model
# =====================================

model = ExtraTreesClassifier(
    n_estimators=30,
    max_depth=15,
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

print("\n================================================")
print("EXTRA TREES RESULTS")
print("================================================")

print(f"Accuracy : {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, zero_division=0))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# =====================================
# Save Model
# =====================================

joblib.dump(model, "backend/extra_tree_model.pkl")
joblib.dump(encoder, "backend/extra_tree_label_encoder.pkl")

print("\nExtra Trees Model Saved Successfully!")