import csv
import logging
from pathlib import Path
from typing import Dict, Optional

logger = logging.getLogger(__name__)

ML_DIR = Path(__file__).resolve().parent

def find_clean_csv() -> Path:
    candidates = [
        ML_DIR / "clean_190k_dataset.csv",
        ML_DIR / "clean_190k_dataset (1).csv",
        ML_DIR.parent.parent.parent / "clean_190k_dataset.csv",
        ML_DIR.parent.parent.parent / "clean_190k_dataset (1).csv",
        Path.cwd() / "clean_190k_dataset.csv",
        Path.cwd() / "clean_190k_dataset (1).csv",
    ]
    for c in candidates:
        if c.exists() and c.is_file():
            return c
    return ML_DIR / "clean_190k_dataset.csv"

def find_encoded_csv() -> Path:
    candidates = [
        ML_DIR / "encoded__dataset.csv",
        ML_DIR.parent.parent.parent / "encoded__dataset.csv",
        Path.cwd() / "encoded__dataset.csv",
    ]
    for c in candidates:
        if c.exists() and c.is_file():
            return c
    return ML_DIR / "encoded__dataset.csv"

CLEAN_CSV = find_clean_csv()
ENCODED_CSV = find_encoded_csv()

_cached_disease_mapping: Optional[Dict[int, str]] = None


def load_disease_mapping() -> Dict[int, str]:
    """
    Load target_id -> disease_name mapping from clean_190k_dataset.csv and encoded__dataset.csv.
    Verifies equal row counts, checks for inconsistent mappings, and caches the result in memory.
    Never re-reads CSV files during prediction calls.
    """
    global _cached_disease_mapping

    if _cached_disease_mapping is not None:
        return _cached_disease_mapping

    logger.info("Initializing disease mapping from CSV datasets...")

    clean_file = find_clean_csv()
    encoded_file = find_encoded_csv()

    if not clean_file.exists():
        raise FileNotFoundError(f"Missing required dataset: {clean_file}")
    if not encoded_file.exists():
        raise FileNotFoundError(f"Missing required dataset: {encoded_file}")

    disease_map: Dict[int, str] = {}

    with open(clean_file, "r", encoding="utf-8") as f_clean, \
         open(encoded_file, "r", encoding="utf-8") as f_encoded:

        r_clean = csv.reader(f_clean)
        r_encoded = csv.reader(f_encoded)

        header_clean = next(r_clean)
        header_encoded = next(r_encoded)

        disease_idx = -1
        for idx, col in enumerate(header_clean):
            if col.strip().lower() == "diseases":
                disease_idx = idx
                break

        target_idx = -1
        for idx, col in enumerate(header_encoded):
            if col.strip().lower() == "target":
                target_idx = idx
                break

        if disease_idx == -1:
            raise ValueError("Column 'diseases' not found in clean_190k_dataset.csv")
        if target_idx == -1:
            raise ValueError("Column 'target' not found in encoded__dataset.csv")

        row_count = 0
        for row_c, row_e in zip(r_clean, r_encoded):
            row_count += 1
            raw_disease = row_c[disease_idx].strip()
            disease_name = raw_disease.capitalize() if raw_disease else "Unknown Condition"
            target_id = int(row_e[target_idx].strip())

            if target_id in disease_map:
                if disease_map[target_id].lower() != disease_name.lower():
                    raise ValueError(
                        f"Inconsistent disease mapping detected at row {row_count}: "
                        f"Target ID {target_id} maps to both '{disease_map[target_id]}' and '{disease_name}'"
                    )
            else:
                disease_map[target_id] = disease_name

        has_more_clean = next(r_clean, None) is not None
        has_more_encoded = next(r_encoded, None) is not None

        if has_more_clean or has_more_encoded:
            raise ValueError("Row count mismatch between clean_190k_dataset.csv and encoded__dataset.csv")

    _cached_disease_mapping = disease_map
    logger.info("Successfully loaded and cached %d disease target mappings in memory", len(_cached_disease_mapping))
    return _cached_disease_mapping


def get_disease_name(target_id: int) -> str:
    """
    Lookup disease name for a given target ID in O(1) time using in-memory dictionary.
    Falls back to 'Medical Condition #{target_id}' if target_id is unmapped.
    """
    mapping = load_disease_mapping()
    return mapping.get(target_id, f"Medical Condition #{target_id}")
