import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

# ==============================
# LOAD DATASET
# ==============================

df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")

# ==============================
# FEATURES & TARGET
# ==============================

X = df.drop("diseases", axis=1)
y = df["diseases"]

# ==============================
# LABEL ENCODING
# ==============================

encoder = LabelEncoder()
y = encoder.fit_transform(y)

# ==============================
# TRAIN TEST SPLIT
# ==============================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ==============================
# MODEL
# ==============================

# Put your model here

# Example:
#
# model = DecisionTreeClassifier()
#
# or
#
# model = RandomForestClassifier()

# ==============================
# TRAIN
# ==============================

model.fit(X_train, y_train)

# ==============================
# PREDICT
# ==============================

y_pred = model.predict(X_test)

# ==============================
# METRICS
# ==============================

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average="weighted")
recall = recall_score(y_test, y_pred, average="weighted")
f1 = f1_score(y_test, y_pred, average="weighted")

print("="*60)
print("RESULTS")
print("="*60)

print("Accuracy :", accuracy)
print("Precision:", precision)
print("Recall   :", recall)
print("F1 Score :", f1)

print(classification_report(y_test, y_pred))

print(confusion_matrix(y_test, y_pred))

# ==============================
# SAVE MODEL
# ==============================

joblib.dump(model, "backend/model.pkl")
joblib.dump(encoder, "backend/label_encoder.pkl")

print("Model Saved Successfully")