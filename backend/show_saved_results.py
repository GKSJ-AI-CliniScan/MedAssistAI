import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)
from sklearn.preprocessing import LabelEncoder


# ==========================
# Load Dataset
# ==========================

df = pd.read_csv("datasets/Final_Augmented_Clean.csv")

print("Dataset Loaded Successfully")
print("Dataset Shape:", df.shape)


# ==========================
# Separate Features and Target
# ==========================

X = df.drop("diseases", axis=1)
y = df["diseases"]

# Keep original disease labels
y = df["diseases"]



# ==========================
# Train-Test Split
# ==========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# ==========================
# Saved Models
# ==========================

models = {
    "Decision Tree": "backend/decision_tree_model.pkl",
    "Random Forest": "backend/random_forest_model.pkl",
    "Extra Trees": "backend/extra_tree_model.pkl",
    "Gradient Boosting": "backend/gradient_boosting_model.pkl",
    "Stacking": "backend/stacking_classifier.pkl"
}

encoders = {
    "Random Forest": "backend/random_forest_label_encoder.pkl",
    "Extra Trees": "backend/extra_tree_label_encoder.pkl",
    "Gradient Boosting": "backend/gradient_boosting_label_encoder.pkl"
}

# ==========================
# Evaluate Models
# ==========================

print("\n" + "=" * 75)
print(f"{'Model':<22}{'Accuracy':<12}{'Precision':<12}{'Recall':<12}{'F1-Score':<12}")
print("=" * 75)

for name, path in models.items():

    try:
        model = joblib.load(path)

    
        # Load correct encoder for each model
        if name in encoders:
             encoder = joblib.load(encoders[name])
             y_test_encoded = encoder.transform(y_test)
        else:
             y_test_encoded = y_test

        y_pred = model.predict(X_test)

        accuracy = accuracy_score(y_test_encoded, y_pred)
        precision_score(y_test_encoded, y_pred,
            y_test, y_pred,
            average="weighted",
            zero_division=0
        )
        recall = recall_score(
            y_test, y_pred,
            average="weighted",
            zero_division=0
        )
        f1_score(y_test_encoded, y_pred,
            average="weighted",
            zero_division=0
        )

        print(f"{name:<22}{accuracy:.4f}      {precision:.4f}      {recall:.4f}      {f1:.4f}")

    except FileNotFoundError:
        print(f"{name:<22} Model file not found")

    except Exception as e:
        print(f"{name:<22} Error: {e}")

print("=" * 75)
print("✅ All Model Evaluation Completed")