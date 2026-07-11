import pandas as pd

# ==========================
# Load Training Dataset
# ==========================

train = pd.read_csv("datasets/Training.csv")

print("=" * 60)
print("DATA CLEANING")
print("=" * 60)

# --------------------------
# 1. Remove extra spaces from column names
# --------------------------

train.columns = train.columns.str.strip()

# --------------------------
# 2. Remove extra spaces from disease names
# --------------------------

train["prognosis"] = train["prognosis"].str.strip()

# --------------------------
# 3. Check Missing Values
# --------------------------

print("\nMissing Values")
print(train.isnull().sum().sum())

# --------------------------
# 4. Check Duplicate Rows
# --------------------------

print("\nDuplicate Rows")
print(train.duplicated().sum())

# --------------------------
# 5. Remove unnamed columns
# --------------------------

unnamed = [col for col in train.columns if "Unnamed" in col]

if len(unnamed) > 0:
    train.drop(columns=unnamed, inplace=True)

# --------------------------
# 6. Disease Count
# --------------------------

print("\nTotal Diseases")
print(train["prognosis"].nunique())

# --------------------------
# 7. Dataset Shape
# --------------------------

print("\nDataset Shape")
print(train.shape)

# --------------------------
# 8. Save Clean Dataset
# --------------------------

train.to_csv("datasets/Training_Clean.csv", index=False)

print("\nTraining_Clean.csv Saved Successfully!")