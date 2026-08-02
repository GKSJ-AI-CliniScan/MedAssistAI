import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

df = pd.read_csv("datasets/filtered_240_disease_dataset.csv")
X = df.drop("diseases", axis=1)
y = df["diseases"]

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)

print("Total Dataset Size :", len(df))
print("Training Samples   :", len(X_train))
print("Testing Samples    :", len(X_test))
print("Features           :", X.shape[1])
print("Disease Classes    :", len(label_encoder.classes_))