import pandas as pd
from pathlib import Path

DATASET_PATH = Path(__file__).resolve().parents[2] / "datasets" / "BRFSS2024.csv"

df = pd.read_csv(DATASET_PATH)

risk_columns = [
    "_AGE80",
    "_SEX",
    "GENHLTH",
    "PHYSHLTH",
    "DIABETE4",
    "CVDINFR4",
    "CVDCRHD4",
    "CVDSTRK3",
    "ASTHMA3",
    "CHCCOPD3",
    "CHCKDNY2",
    "SMOKE100",
    "EXERANY2",
    "_BMI5"
]

risk_df = df[risk_columns]

# Replace special survey codes with missing values
risk_df = risk_df.replace({
    7: pd.NA,
    9: pd.NA,
    77: pd.NA,
    88: pd.NA,
    99: pd.NA
})

# Remove rows with missing values
risk_df = risk_df.dropna()

print("Clean Dataset Shape:", risk_df.shape)
print(risk_df.head())

print("\nAge Statistics:")
print(risk_df["_AGE80"].describe())

print("\nDiabetes Counts:")
print(risk_df["DIABETE4"].value_counts())

print("\nSmoking Counts:")
print(risk_df["SMOKE100"].value_counts())

print("\nGeneral Health:")
print(risk_df["GENHLTH"].value_counts())

print("\nDiabetes vs General Health")
print(pd.crosstab(risk_df["DIABETE4"], risk_df["GENHLTH"]))

print("\nSmoking vs General Health")
print(pd.crosstab(risk_df["SMOKE100"], risk_df["GENHLTH"]))

print("\nBMI Statistics")
print(risk_df["_BMI5"].describe())

print("\nHeart Attack vs General Health")
print(pd.crosstab(risk_df["CVDINFR4"], risk_df["GENHLTH"]))

print("\nStroke vs General Health")
print(pd.crosstab(risk_df["CVDSTRK3"], risk_df["GENHLTH"]))

print("\nKidney Disease vs General Health")
print(pd.crosstab(risk_df["CHCKDNY2"], risk_df["GENHLTH"]))