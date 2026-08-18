import os
import sys
import csv
import asyncio
import collections
from datetime import datetime

# Add the parent directory to the python path to allow importing app
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(script_dir, ".."))

from app.core.database import connect_to_mongo, get_database, close_mongo_connection, db_helper
from app.core.security import get_password_hash

CSV_PATH = r"C:\Users\Anbarasan.K\Downloads\Final_Augmented_dataset_Diseases_and_Symptoms 1 (1).csv"

async def main():
    # Initialize connection using the app database module (which handles local JSON fallback)
    await connect_to_mongo()
    db = get_database()
    
    # 1. Clear existing collections
    print("Clearing collections...")
    await db.symptoms.drop()
    await db.disease_profiles.drop()
    await db.users.drop()
    await db.profiles.drop()
    await db.consultations.drop()
    
    # Create indexes (ignored in mock mode)
    await db.symptoms.create_index("key", unique=True)
    await db.disease_profiles.create_index("disease", unique=True)
    await db.users.create_index("email", unique=True)
    await db.profiles.create_index("user_id", unique=True)
    
    if not os.path.exists(CSV_PATH):
        print(f"CSV file not found at {CSV_PATH}! Cannot proceed with dataset seeding.")
        await close_mongo_connection()
        return

    # 2. Parse and seed symptoms
    print("Reading CSV headers for symptoms...")
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        raw_symptoms = header[1:] # Skip the 'diseases' column
        
    print(f"Found {len(raw_symptoms)} symptoms in dataset.")
    symptom_docs = []
    for s in raw_symptoms:
        # Category heuristics
        category = "General"
        s_lower = s.lower()
        if any(w in s_lower for w in ["eye", "vision", "eyelid"]):
            category = "Ophthalmology"
        elif any(w in s_lower for w in ["ear", "hearing", "throat", "nasal", "nose", "tonsil", "sinus"]):
            category = "ENT"
        elif any(w in s_lower for w in ["pain", "ache", "sore"]):
            category = "Pain & Discomfort"
        elif any(w in s_lower for w in ["skin", "lesion", "mole", "acne", "hair", "nail"]):
            category = "Dermatology"
        elif any(w in s_lower for w in ["anxiety", "depression", "fear", "esteem", "behavior", "psychic", "sleep"]):
            category = "Mental Health"
        elif any(w in s_lower for w in ["breath", "cough", "sputum", "wheezing"]):
            category = "Pulmonology"
        elif any(w in s_lower for w in ["heart", "chest tightness", "palpitation", "heartburn"]):
            category = "Cardiology"
        elif any(w in s_lower for w in ["stomach", "vomit", "nausea", "diarrhea", "stool", "flatulence", "belly"]):
            category = "Gastroenterology"
        elif any(w in s_lower for w in ["urine", "urination", "bladder", "kidney", "prostate"]):
            category = "Urology"
        elif any(w in s_lower for w in ["vaginal", "menstrual", "pregnancy", "vulva"]):
            category = "Gynecology"
        elif any(w in s_lower for w in ["muscle", "joint", "back", "neck", "bone", "elbow", "knee", "shoulder", "wrist"]):
            category = "Musculoskeletal"
            
        symptom_docs.append({
            "key": s,
            "display_name": s.capitalize(),
            "category": category
        })
        
    await db.symptoms.insert_many(symptom_docs)
    print("Symptoms seeded successfully!")
    
    # 3. Aggregate CSV to compute disease profiles
    print("Processing and aggregating dataset rows (this may take about 15-20 seconds)...")
    disease_counts = collections.defaultdict(int)
    disease_symptoms = collections.defaultdict(lambda: collections.defaultdict(int))
    total_records = 0
    
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader) # Skip header
        for row in reader:
            if not row:
                continue
            disease = row[0].strip()
            disease_counts[disease] += 1
            total_records += 1
            
            for idx, val in enumerate(row[1:]):
                if val == '1':
                    symptom_name = raw_symptoms[idx]
                    disease_symptoms[disease][symptom_name] += 1
                    
    print(f"Aggregated {total_records} rows for {len(disease_counts)} unique diseases.")
    
    disease_profile_docs = []
    for disease, count in disease_counts.items():
        symptom_probs = {}
        for s_name in raw_symptoms:
            sym_count = disease_symptoms[disease][s_name]
            if sym_count > 0:
                symptom_probs[s_name] = sym_count / count
                
        disease_profile_docs.append({
            "disease": disease,
            "symptom_probabilities": symptom_probs,
            "base_rate": count / total_records,
            "occurrences": count
        })
        
    # Batch insert in chunks of 100
    chunk_size = 100
    for i in range(0, len(disease_profile_docs), chunk_size):
        chunk = disease_profile_docs[i:i+chunk_size]
        await db.disease_profiles.insert_many(chunk)
        
    print("Disease profiles seeded successfully!")
    
    # 4. Seed Default Users for Testing
    print("Seeding default users...")
    admin_pw = get_password_hash("adminpassword")
    doctor_pw = get_password_hash("doctorpassword")
    patient_pw = get_password_hash("patientpassword")
    
    users_to_seed = [
        {
            "_id": "admin_user_id",
            "email": "admin@medassist.ai",
            "hashed_password": admin_pw,
            "role": "admin",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "doctor_user_id",
            "email": "doctor@medassist.ai",
            "hashed_password": doctor_pw,
            "role": "doctor",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "patient_user_id",
            "email": "patient@medassist.ai",
            "hashed_password": patient_pw,
            "role": "patient",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    await db.users.insert_many(users_to_seed)
    
    # Seed profile for default patient
    patient_profile = {
        "_id": "patient_profile_id",
        "user_id": "patient_user_id",
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1990-05-15",
        "gender": "Male",
        "blood_type": "O+",
        "height": 178.5,
        "weight": 75.0,
        "allergies": ["Peanuts"],
        "medical_conditions": ["Asthma"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    await db.profiles.insert_one(patient_profile)
    
    print("Default users and profiles seeded successfully!")
    print("\nCredentials for testing:")
    print("  - Admin: admin@medassist.ai / adminpassword")
    print("  - Doctor: doctor@medassist.ai / doctorpassword")
    print("  - Patient: patient@medassist.ai / patientpassword")
    
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(main())
