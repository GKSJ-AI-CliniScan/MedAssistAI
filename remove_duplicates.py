import pandas as pd

# Load dataset
df = pd.read_csv("datasets/Training_Clean.csv")

print("Original rows:", len(df))

# Remove duplicates
df = df.drop_duplicates()

print("Rows after removing duplicates:", len(df))

# Save new dataset
df.to_csv("datasets/Training_NoDuplicates.csv", index=False)

print("New dataset saved successfully.")