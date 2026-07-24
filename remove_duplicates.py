import pandas as pd

# Load the new dataset
df = pd.read_csv("datasets/Final_Augmented_dataset_Diseases_and_Symptoms.csv")

print("Original rows:", len(df))

# Remove duplicate rows
df = df.drop_duplicates()

print("Rows after removing duplicates:", len(df))

# Save the cleaned dataset
df.to_csv("datasets/Final_Augmented_Clean.csv", index=False)

print("New cleaned dataset saved successfully.")