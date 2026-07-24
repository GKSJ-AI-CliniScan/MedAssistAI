import pandas as pd
import joblib

from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ==========================
# Load Dataset
# ==========================

df = pd.read_csv("datasets/Final_Augmented_Clean.csv")
df = df.sample(n=10000, random_state=42)
# If your target column is "diseases", replace "prognosis" with "diseases"

X = df.drop("prognosis", axis=1)
y = df["prognosis"]

# ==========================
# Encode Labels
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
    random_state=42
)

# ==========================
# Decision Tree Model
# ==========================

print("="*60)
print("Training Decision Tree...")
print("="*60)

model = DecisionTreeClassifier(
    random_state=42,
    max_depth=25
)

model.fit(X_train, y_train)

# ==========================
# Prediction
# ==========================

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("="*60)
print("DECISION TREE RESULTS")
print("="*60)

print(f"Accuracy : {accuracy*100:.2f}%")

print("\nClassification Report")
print(classification_report(y_test, y_pred, zero_division=0))

print("\nConfusion Matrix")
print(confusion_matrix(y_test, y_pred))

# ==========================
# Save Model
# ==========================

joblib.dump(model, "backend/decision_tree_model.pkl")

print("\nDecision Tree Model Saved Successfully.")