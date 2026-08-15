import json
import logging
from pathlib import Path
from typing import Dict, Optional

logger = logging.getLogger(__name__)

ML_DIR = Path(__file__).resolve().parent
JSON_MAP_FILE = ML_DIR / "disease_mapping.json"
CLEAN_CSV = ML_DIR / "clean_190k_dataset.csv"
ENCODED_CSV = ML_DIR / "encoded__dataset.csv"

_cached_disease_mapping: Optional[Dict[int, str]] = None


def load_disease_mapping() -> Dict[int, str]:
    """
    Load target_id -> disease_name mapping.
    Uses precomputed disease_mapping.json for instant O(1) in-memory loading.
    Falls back to CSV parsing if JSON does not exist.
    """
    global _cached_disease_mapping

    if _cached_disease_mapping is not None:
        return _cached_disease_mapping

    # 1. Try loading from fast JSON cache
    if JSON_MAP_FILE.exists():
        try:
            with open(JSON_MAP_FILE, "r", encoding="utf-8") as f:
                raw_dict = json.load(f)
                _cached_disease_mapping = {int(k): str(v) for k, v in raw_dict.items()}
                logger.info("Loaded %d disease target mappings instantly from %s", len(_cached_disease_mapping), JSON_MAP_FILE.name)
                return _cached_disease_mapping
        except Exception as e:
            logger.warning("Failed to load disease_mapping.json, falling back to CSV: %s", e)

    # 2. Fallback to CSV extraction
    if not CLEAN_CSV.exists() or not ENCODED_CSV.exists():
        logger.error("Missing dataset CSVs and JSON mapping file")
        _cached_disease_mapping = {}
        return _cached_disease_mapping

    import csv
    disease_map: Dict[int, str] = {}
    with open(CLEAN_CSV, "r", encoding="utf-8") as f_clean, \
         open(ENCODED_CSV, "r", encoding="utf-8") as f_encoded:

        r_clean = csv.reader(f_clean)
        r_encoded = csv.reader(f_encoded)

        header_clean = next(r_clean)
        header_encoded = next(r_encoded)

        disease_idx = header_clean.index("diseases") if "diseases" in [h.lower() for h in header_clean] else 0
        target_idx = header_encoded.index("target") if "target" in [h.lower() for h in header_encoded] else 0

        for row_c, row_e in zip(r_clean, r_encoded):
            raw_disease = row_c[disease_idx].strip()
            disease_name = raw_disease.capitalize() if raw_disease else "Unknown Condition"
            target_id = int(row_e[target_idx].strip())
            disease_map[target_id] = disease_name

    # Save to JSON for next time
    try:
        with open(JSON_MAP_FILE, "w", encoding="utf-8") as f:
            json.dump({str(k): v for k, v in sorted(disease_map.items())}, f, indent=2)
    except Exception as e:
        logger.warning("Could not persist disease_mapping.json: %s", e)

    _cached_disease_mapping = disease_map
    logger.info("Parsed and cached %d disease target mappings from CSV", len(_cached_disease_mapping))
    return _cached_disease_mapping


def get_disease_name(target_id: int) -> str:
    """
    Lookup disease name for a given target ID in O(1) time using in-memory dictionary.
    Falls back to 'Condition #{target_id}' if target_id is unmapped.
    """
    mapping = load_disease_mapping()
    return mapping.get(target_id, f"Condition #{target_id}")
