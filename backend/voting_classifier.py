import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import VotingClassifier

from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import accuracy_score

print("="*60)
print("Training Voting Classifier...")
print("="*60)

# Load Dataset
df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")

X = df.drop("diseases", axis=1)
y = df["diseases"]

encoder = LabelEncoder()
y = encoder.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Base Models
dt = DecisionTreeClassifier(random_state=42)

rf = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

# Voting Classifier
model = VotingClassifier(
    estimators=[
        ("dt", dt),
        ("rf", rf)
    ],
    voting="hard"
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy :", accuracy*100)

joblib.dump(model, "backend/voting_classifier.pkl")
joblib.dump(encoder, "backend/voting_label_encoder.pkl")

print("\nVoting Classifier Saved Successfully!")