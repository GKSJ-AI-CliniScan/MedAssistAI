from sqlalchemy.orm import Session
from app.database.session import get_db, SessionLocal
from app.models.symptom import Symptom

SYMPTOMS = [
    # General & Systemic
    ("Fever", "Elevated body temperature", "General", 2),
    ("Chills", "Feeling cold with shivering", "General", 1),
    ("Fatigue", "Extreme tiredness and lack of energy", "General", 2),
    ("Weakness", "Generalized muscle weakness", "General", 2),
    ("Sweating", "Excessive perspiration", "General", 1),
    ("Loss of appetite", "Decreased desire to eat", "General", 1),
    ("Weight loss", "Unintentional weight reduction", "General", 2),
    ("Weight gain", "Unintentional weight increase", "General", 1),
    
    # Respiratory
    ("Cough", "Persistent coughing", "Respiratory", 2),
    ("Shortness of breath", "Difficulty breathing", "Respiratory", 3),
    ("Wheezing", "High-pitched whistling sound when breathing", "Respiratory", 2),
    ("Chest pain", "Pain or discomfort in chest", "Respiratory", 3),
    ("Sore throat", "Pain or irritation in throat", "Respiratory", 1),
    ("Runny nose", "Nasal discharge", "Respiratory", 1),
    ("Nasal congestion", "Stuffy nose", "Respiratory", 1),
    ("Difficulty swallowing", "Trouble swallowing food or liquids", "Respiratory", 2),
    
    # Head & Neurological
    ("Headache", "Pain in head or neck", "Neurological", 2),
    ("Dizziness", "Feeling lightheaded or unsteady", "Neurological", 2),
    ("Blurred vision", "Unclear or hazy vision", "Neurological", 2),
    ("Tinnitus", "Ringing in ears", "Neurological", 1),
    ("Loss of smell", "Inability to smell", "Neurological", 1),
    ("Loss of taste", "Inability to taste", "Neurological", 1),
    ("Numbness", "Loss of sensation", "Neurological", 2),
    ("Tingling", "Pins and needles sensation", "Neurological", 1),
    ("Tremors", "Involuntary shaking", "Neurological", 2),
    ("Seizure", "Abnormal electrical activity in brain", "Neurological", 3),
    ("Memory problems", "Difficulty remembering", "Neurological", 2),
    ("Anxiety", "Excessive worry or fear", "Psychological", 2),
    ("Insomnia", "Difficulty sleeping", "Psychological", 1),
    
    # Gastrointestinal
    ("Nausea", "Feeling sick to stomach", "Gastrointestinal", 1),
    ("Vomiting", "Forceful expulsion of stomach contents", "Gastrointestinal", 2),
    ("Abdominal pain", "Pain in stomach area", "Gastrointestinal", 2),
    ("Diarrhea", "Loose or watery stools", "Gastrointestinal", 2),
    ("Constipation", "Difficulty passing stools", "Gastrointestinal", 1),
    ("Heartburn", "Burning sensation in chest", "Gastrointestinal", 1),
    ("Bloating", "Feeling of fullness in abdomen", "Gastrointestinal", 1),
    
    # Urinary
    ("Burning urination", "Pain during urination", "Urinary", 2),
    ("Frequent urination", "Need to urinate often", "Urinary", 1),
    ("Blood in urine", "Red or brown urine", "Urinary", 3),
    ("Difficulty urinating", "Trouble starting or stopping urination", "Urinary", 2),
    
    # Musculoskeletal
    ("Back pain", "Pain in back", "Musculoskeletal", 2),
    ("Joint pain", "Pain in joints", "Musculoskeletal", 2),
    ("Muscle pain", "Pain in muscles", "Musculoskeletal", 1),
    ("Stiffness", "Reduced flexibility", "Musculoskeletal", 1),
    
    # Skin
    ("Skin rash", "Red or irritated skin", "Skin", 1),
    ("Itching", "Uncomfortable skin sensation", "Skin", 1),
    ("Swelling", "Edema or puffiness", "Skin", 2),
    
    # Cardiovascular
    ("Palpitations", "Awareness of heart beating", "Cardiovascular", 2),
    ("High blood pressure", "Elevated blood pressure readings", "Cardiovascular", 2),
    ("Low blood pressure", "Decreased blood pressure readings", "Cardiovascular", 2),
    
    # Ear, Nose, Throat
    ("Ear pain", "Pain in ear", "ENT", 1),
    ("Tooth pain", "Pain in teeth or gums", "ENT", 1),
    
    # Reproductive
    ("Menstrual pain", "Pain during menstruation", "Reproductive", 1),
    ("Pelvic pain", "Pain in lower abdomen/pelvis", "Reproductive", 2),
]

def seed_symptoms(db: Session = None):
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        # Check if symptoms already exist
        existing_count = db.query(Symptom).count()
        if existing_count >= 50:
            print(f"Symptoms already seeded ({existing_count} found)")
            return
        
        # Add symptoms
        for name, description, category, severity in SYMPTOMS:
            existing = db.query(Symptom).filter(Symptom.name == name).first()
            if not existing:
                symptom = Symptom(
                    name=name,
                    description=description,
                    category=category,
                    severity_weight=severity
                )
                db.add(symptom)
        
        db.commit()
        print(f"Successfully seeded {len(SYMPTOMS)} symptoms")
    except Exception as e:
        db.rollback()
        print(f"Error seeding symptoms: {e}")
    finally:
        if should_close:
            db.close()

if __name__ == "__main__":
    seed_symptoms()
