import pandas as pd

# -------------------------------
# Load Datasets
# -------------------------------

train = pd.read_csv("datasets/Training.csv")
test = pd.read_csv("datasets/Testing.csv")

# -------------------------------
# Dataset Shape
# -------------------------------

print("=" * 60)
print("TRAINING DATASET")
print("=" * 60)

print("Rows :", train.shape[0])
print("Columns :", train.shape[1])

print()

print("=" * 60)
print("TESTING DATASET")
print("=" * 60)

print("Rows :", test.shape[0])
print("Columns :", test.shape[1])

print()

# -------------------------------
# Disease Count
# -------------------------------

print("=" * 60)
print("DISEASE INFORMATION")
print("=" * 60)

print("Total Diseases :", train["prognosis"].nunique())

print()

print("Disease List")

for disease in sorted(train["prognosis"].unique()):
    print("-", disease)

print()

# -------------------------------
# Symptoms Count
# -------------------------------

print("=" * 60)
print("SYMPTOM INFORMATION")
print("=" * 60)

total_symptoms = train.shape[1] - 1

print("Total Symptoms :", total_symptoms)

print()

print("Symptom Names")

for symptom in train.columns[:-1]:
    print("-", symptom)

print()

# -------------------------------
# Missing Values
# -------------------------------

print("=" * 60)
print("MISSING VALUES")
print("=" * 60)

print(train.isnull().sum().sum())

print()

# -------------------------------
# Duplicate Rows
# -------------------------------

print("=" * 60)
print("DUPLICATE ROWS")
print("=" * 60)

print(train.duplicated().sum())

print()

# -------------------------------
# Disease Distribution
# -------------------------------

print("=" * 60)
print("DISEASE DISTRIBUTION")
print("=" * 60)

print(train["prognosis"].value_counts())