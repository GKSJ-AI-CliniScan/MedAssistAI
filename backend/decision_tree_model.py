import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from sklearn.tree import DecisionTreeClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


print("="*60)
print("Training Decision Tree...")
print("="*60)


# Load dataset
df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")
# Separate features and target
X = df.drop("diseases", axis=1)
y = df["diseases"]


# Encode target labels
encoder = LabelEncoder()
y = encoder.fit_transform(y)


# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create Decision Tree model
model = DecisionTreeClassifier(
    criterion="entropy",
    random_state=42
)


# Train model
model.fit(X_train, y_train)


# Prediction
y_pred = model.predict(X_test)


# Evaluation

accuracy = accuracy_score(
    y_test,
    y_pred
)


print("\n==============================")
print("DECISION TREE RESULTS")
print("==============================")

print("Accuracy :", accuracy * 100, "%")


print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred
    )
)


print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# Save model
joblib.dump(
    model,
    "backend/decision_tree_model.pkl"
)

joblib.dump(
    encoder,
    "backend/decision_tree_label_encoder.pkl"
)

print("\nDecision Tree Model Saved Successfully!")