import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import LabelEncoder

# ==========================
# Load Dataset
# ==========================

df = pd.read_csv("datasets/Final_Augmented_Clean.csv")

# Take a random sample (same as train_model.py)
df = df.sample(n=20000, random_state=42)

# ==========================
# Features and Target
# ==========================

X = df.drop("diseases", axis=1)
y = df["diseases"]

# ==========================
# Encode Labels
# ==========================

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# ==========================
# Random Forest Model
# ==========================

model = RandomForestClassifier(
    n_estimators=50,
    random_state=42,
    n_jobs=-1
)

# ==========================
# 5-Fold Cross Validation
# ==========================

scores = cross_val_score(
    model,
    X,
    y_encoded,
    cv=5,
    n_jobs=-1
)

print("=" * 60)
print("5-FOLD CROSS VALIDATION")
print("=" * 60)

print("Scores :", scores)
print(f"Average Accuracy : {scores.mean() * 100:.2f}%")
print(f"Standard Deviation : {scores.std():.4f}")