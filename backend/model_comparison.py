import pandas as pd

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder

from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from xgboost import XGBClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)


print("="*70)
print("MODEL COMPARISON: RANDOM FOREST vs EXTRA TREES vs XGBOOST")
print("="*70)


# Load dataset
df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")
df = df.sample(n=10000, random_state=42)
# Split features and target
X = df.drop("diseases", axis=1)
y = df["diseases"]


# Encode target
encoder = LabelEncoder()
y = encoder.fit_transform(y)


# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Define models
models = {

    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        random_state=42
    ),

    "Extra Trees": ExtraTreesClassifier(
        n_estimators=200,
        random_state=42
    ),

    "XGBoost": XGBClassifier(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=5,
        random_state=42,
        eval_metric="mlogloss"
    )
}


results = []


# Train and evaluate models
for name, model in models.items():

    print("\nTraining", name, "...")

    # Training
    model.fit(X_train, y_train)

    # Prediction
    y_pred = model.predict(X_test)


    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(
        y_test,
        y_pred,
        average="weighted"
    )
    recall = recall_score(
        y_test,
        y_pred,
        average="weighted"
    )
    f1 = f1_score(
        y_test,
        y_pred,
        average="weighted"
    )


    # Cross validation
    cv_scores = cross_val_score(
        model,
        X,
        y,
        cv=5
    )


    results.append([
        name,
        accuracy * 100,
        precision,
        recall,
        f1,
        cv_scores.mean() * 100
    ])


# Create comparison table
comparison = pd.DataFrame(
    results,
    columns=[
        "Model",
        "Accuracy (%)",
        "Precision",
        "Recall",
        "F1 Score",
        "CV Accuracy (%)"
    ]
)


print("\n")
print("="*70)
print("FINAL MODEL COMPARISON")
print("="*70)

print(comparison)


# Save results
comparison.to_csv(
    "model_comparison_results.csv",
    index=False
)


print("\nComparison saved successfully!")