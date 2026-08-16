from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.symptom import Symptom
from app.ml.extracted_features import MODEL_FEATURE_NAMES


def format_symptom_name(raw: str) -> str:
    cleaned = raw.replace(".1", "").replace("_", " ").strip()
    words = cleaned.split()
    small_words = {"and", "or", "of", "in", "on", "with", "the", "from", "to", "for", "a", "an"}
    return " ".join([
        w.capitalize() if i == 0 or w.lower() not in small_words else w.lower()
        for i, w in enumerate(words)
    ])


def categorize_feature(feat: str) -> str:
    f = feat.lower()
    if any(k in f for k in ["breath", "cough", "sputum", "wheezing", "apnea", "sinus", "coryza", "throat", "speaking", "hemoptysis"]):
        return "Respiratory"
    if any(k in f for k in ["chest", "heart", "palpitations", "circulation", "pulse", "decreased heart", "increased heart"]):
        return "Cardiovascular"
    if any(k in f for k in ["headache", "dizziness", "seizure", "involuntary", "fainting", "memory", "slurring", "paresthesia", "sensation", "sleep", "nightmares", "stuttering", "pupil", "facial pain"]):
        return "Neurological"
    if any(k in f for k in ["abdominal", "stomach", "nausea", "vomit", "diarrhea", "constipation", "flatulence", "stool", "jaundice", "regurgitation", "heartburn", "eating", "appetite", "thirst", "distention", "melena"]):
        return "Digestive"
    if any(k in f for k in ["pain", "joint", "knee", "hip", "wrist", "ankle", "elbow", "shoulder", "arm", "leg", "back", "neck", "bone", "muscle", "cramp", "stiffness", "weakness", "foot", "hand", "toe", "finger", "rib", "groin", "posture", "knock-kneed", "bowlegged"]):
        return "Musculoskeletal"
    if any(k in f for k in ["skin", "rash", "mole", "acne", "itching", "lesion", "wart", "ulcer", "pallor", "flushing", "hair", "nail", "dryness", "diaper", "peeling", "sweat", "wrinkles", "oiliness"]):
        return "Skin"
    if any(k in f for k in ["ear", "eye", "hearing", "vision", "blindness", "lacrimation", "eyelid", "tinnitus", "nose", "smell", "taste", "lip", "mouth", "tongue", "tooth", "gum", "jaw", "tonsil"]):
        return "ENT & Sensory"
    if any(k in f for k in ["urin", "bladder", "kidney", "penis", "scrotum", "testicle", "vaginal", "vulva", "menstrua", "pregnancy", "breast", "nipple", "menopause", "infertility", "ejaculation", "orgasm", "sex drive", "pelvic", "prostate"]):
        return "Urological & Reproductive"
    if any(k in f for k in ["anxiety", "depression", "psychotic", "insomnia", "hostile", "alcohol", "drug", "anger", "temper", "phobia", "delusion", "hallucination", "self-esteem", "compulsion", "antisocial", "hysterical"]):
        return "Psychological"
    return "General"


def get_severity(feat: str) -> int:
    f = feat.lower()
    if any(k in f for k in ["unconscious", "seizure", "severe bleeding", "vomiting blood", "hemoptysis", "blindness", "apnea", "fainting", "sharp chest pain", "difficulty breathing"]):
        return 5
    if any(k in f for k in ["chest", "shortness of breath", "blood in urine", "blood in stool", "rectal bleeding", "melena", "high fever", "persistent vomiting", "severe headache", "jaundice"]):
        return 4
    if any(k in f for k in ["fever", "abdominal pain", "dizziness", "wheezing", "palpitations", "irregular heartbeat", "pus", "swelling", "mass", "lump", "cramps"]):
        return 3
    if any(k in f for k in ["cough", "vomiting", "diarrhea", "back pain", "joint pain", "muscle pain", "weakness", "headache", "nausea", "insomnia"]):
        return 2
    return 1


# Build complete 377-symptom catalogue from model feature vocabulary
CATALOGUE_SYMPTOMS = []
_seen_names = set()

for raw_feat in MODEL_FEATURE_NAMES:
    name = format_symptom_name(raw_feat)
    if name not in _seen_names:
        _seen_names.add(name)
        category = categorize_feature(raw_feat)
        severity = get_severity(raw_feat)
        description = f"Clinical manifestation of {raw_feat.replace('.1', '').replace('_', ' ')}"
        CATALOGUE_SYMPTOMS.append((name, description, category, severity))


def seed_symptoms(db: Session = None):
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        existing_map = {s.name.strip().lower(): s for s in db.query(Symptom).all()}
        if len(existing_map) >= len(CATALOGUE_SYMPTOMS):
            print(f"Symptoms already fully seeded ({len(existing_map)} found)")
            return

        added_count = 0
        for name, description, category, severity in CATALOGUE_SYMPTOMS:
            if name.lower() not in existing_map:
                symptom = Symptom(
                    name=name,
                    description=description,
                    category=category,
                    severity_weight=severity,
                )
                db.add(symptom)
                added_count += 1
            else:
                sym = existing_map[name.lower()]
                sym.category = category
                sym.severity_weight = severity

        db.commit()
        print(f"Successfully seeded/verified {added_count} symptoms (total catalogue: {len(CATALOGUE_SYMPTOMS)})")
    except Exception as e:
        db.rollback()
        print(f"Error seeding symptoms: {e}")
    finally:
        if should_close:
            db.close()


if __name__ == "__main__":
    seed_symptoms()

