import csv
import json
from pathlib import Path

def generate_disease_mapping_json():
    ml_dir = Path(__file__).resolve().parent
    clean_csv = ml_dir / "clean_190k_dataset.csv"
    enc_csv = ml_dir / "encoded__dataset.csv"
    out_json = ml_dir / "disease_mapping.json"

    print("Reading CSV files to generate disease_mapping.json...")
    mapping = {}
    with open(clean_csv, "r", encoding="utf-8") as fc, open(enc_csv, "r", encoding="utf-8") as fe:
        rc = csv.reader(fc)
        re = csv.reader(fe)
        hc = next(rc)
        he = next(re)
        d_idx = hc.index("diseases")
        t_idx = he.index("target")

        for row_c, row_e in zip(rc, re):
            raw_disease = row_c[d_idx].strip()
            d_name = raw_disease.capitalize() if raw_disease else "Unknown Condition"
            t_id = int(row_e[t_idx].strip())
            mapping[t_id] = d_name

    with open(out_json, "w", encoding="utf-8") as f:
        json.dump({str(k): v for k, v in sorted(mapping.items())}, f, indent=2)

    print(f"Successfully saved {len(mapping)} disease mappings to {out_json}")

if __name__ == "__main__":
    generate_disease_mapping_json()
