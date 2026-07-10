import pandas as pd
import os

def apply_severity_weights():
    print("=" * 60)
    print("1. LOADING DATASETS")
    print("=" * 60)
    
    # Define file paths
    dataset_path = "processed_data/final_dataset.csv"
    severity_path = "datasets/Symptom-severity.csv"
    
    if not os.path.exists(dataset_path) or not os.path.exists(severity_path):
        print("[ERROR] Could not find the required CSV files. Check your paths.")
        return
        
    df = pd.read_csv(dataset_path)
    severity_df = pd.read_csv(severity_path)
    
    print(f"[OK] Original Dataset Shape: {df.shape}")
    print(f"[OK] Severity Dataset Shape: {severity_df.shape}")
    
    print("\n" + "=" * 60)
    print("2. MAPPING SEVERITY WEIGHTS")
    print("=" * 60)
    
    # Normalize the severity symptom names to match the dataset columns
    severity_df['Symptom'] = severity_df['Symptom'].str.replace(' ', '_').str.lower()
    
    # Create a dictionary mapping: {'itching': 1, 'chest_pain': 7, ...}
    severity_dict = dict(zip(severity_df['Symptom'], severity_df['weight']))
    
    # Separate the target 'prognosis' column from the symptoms
    X = df.drop("prognosis", axis=1)
    y = df["prognosis"]
    
    # Apply the weights to the binary symptom columns
    weighted_X = X.copy()
    missing_weights = []
    
    for col in weighted_X.columns:
        if col in severity_dict:
            weight = severity_dict[col]
            # Multiply the binary 0s and 1s by the clinical weight
            weighted_X[col] = weighted_X[col] * weight
        else:
            missing_weights.append(col)
            
    if missing_weights:
        print(f"  [INFO] No severity weight found for {len(missing_weights)} symptoms. Defaulting to 1.")
        
    print("  [OK] Clinical severity weights applied successfully.")
    
    print("\n" + "=" * 60)
    print("3. EXPORTING WEIGHTED DATASET")
    print("=" * 60)
    
    # Recombine the weighted symptoms with the target diseases
    final_weighted_df = pd.concat([y, weighted_X], axis=1)
    
    # Save to a new file so we do not overwrite the original clean dataset
    output_path = "processed_data/weighted_final_dataset.csv"
    final_weighted_df.to_csv(output_path, index=False)
    
    print(f"  [SUCCESS] New dataset saved to: {output_path}")

if __name__ == "__main__":
    apply_severity_weights()