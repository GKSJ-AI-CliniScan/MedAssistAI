import pandas as pd

df = pd.read_csv("datasets/Training_Clean.csv")

print("Total rows:", len(df))
print("Duplicate rows:", df.duplicated().sum())

df_unique = df.drop_duplicates()

print("Rows after removing duplicates:", len(df_unique))