import pandas as pd

df = pd.read_csv("datasets/Final_Augmented_dataset_Diseases_and_Symptoms.csv")

print("Total rows:", len(df))
print("Duplicate rows:", df.duplicated().sum())

df_unique = df.drop_duplicates()

print("Rows after removing duplicates:", len(df_unique))