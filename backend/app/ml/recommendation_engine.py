"""
MedAssist AI – Treatment Recommendation Engine
Generates personalised treatment recommendations based on predicted diseases.
"""
from typing import List, Dict, Any

DISEASE_RECOMMENDATIONS: Dict[str, Dict[str, Any]] = {
    "influenza": {
        "lifestyle": "Rest at home for 5–7 days. Avoid contact with others to prevent spreading. Wear a mask if you must go out.",
        "diet": "Eat warm soups, broths, honey-lemon tea. Stay well hydrated. Avoid dairy and heavy foods. Vitamin C rich foods (citrus, bell peppers) support recovery.",
        "exercise": "No exercise during active fever. Light gentle stretching after fever subsides. Resume normal activity only after full recovery.",
        "waterIntake": "3–3.5 liters per day. Include electrolyte solutions if sweating heavily.",
        "sleep": "8–10 hours per night. Elevate head to reduce nasal congestion.",
        "followUp": "Return to doctor if fever exceeds 103°F, breathing difficulty develops, or no improvement after 7 days.",
        "doctor": "General Practitioner",
        "medicines": [
            {"name": "Paracetamol (Tylenol)", "dosage": "500–1000mg every 4–6 hrs as needed", "purpose": "Fever and pain relief"},
            {"name": "Oseltamivir (Tamiflu)", "dosage": "75mg twice daily for 5 days (if confirmed flu within 48hrs)", "purpose": "Antiviral – reduces severity and duration"},
            {"name": "Saline Nasal Spray", "dosage": "2 sprays each nostril 3x/day", "purpose": "Relieve nasal congestion"},
        ],
    },
    "common_cold": {
        "lifestyle": "Rest adequately. Wash hands frequently. Avoid close contact with others. Use tissues and dispose properly.",
        "diet": "Warm liquids, ginger tea, garlic, honey. Vitamin C rich foods. Avoid cold beverages and ice cream.",
        "exercise": "Light walking is acceptable if no fever. Avoid strenuous exercise.",
        "waterIntake": "2.5–3 liters per day.",
        "sleep": "7–9 hours. Use a humidifier to ease breathing.",
        "followUp": "See a doctor if symptoms worsen after 10 days or fever develops above 101°F.",
        "doctor": "General Practitioner",
        "medicines": [
            {"name": "Paracetamol", "dosage": "500mg every 4–6 hrs as needed", "purpose": "Fever and headache relief"},
            {"name": "Antihistamine (Loratadine)", "dosage": "10mg once daily", "purpose": "Reduce runny nose and sneezing"},
            {"name": "Decongestant (Pseudoephedrine)", "dosage": "60mg every 4–6 hrs", "purpose": "Nasal congestion relief"},
        ],
    },
    "covid19": {
        "lifestyle": "Strictly isolate for minimum 10 days from symptom onset. Wear an N95 mask. Ventilate your room. Monitor oxygen saturation daily with a pulse oximeter.",
        "diet": "High-protein diet: eggs, chicken, lentils. Zinc-rich foods: pumpkin seeds, chickpeas. Vitamin D supplementation. Avoid alcohol.",
        "exercise": "Complete rest during active illness. Breathing exercises (prone positioning) to improve oxygen levels if indicated.",
        "waterIntake": "3–4 liters per day. Include oral rehydration salts if dehydrated.",
        "sleep": "9–10 hours. Sleep in prone position (face down) if having breathing difficulty.",
        "followUp": "Immediate ER visit if oxygen drops below 94%, breathing becomes labored, or confusion develops.",
        "doctor": "Pulmonologist / Infectious Disease Specialist",
        "medicines": [
            {"name": "Paracetamol", "dosage": "500–1000mg every 6 hrs", "purpose": "Fever and body ache management"},
            {"name": "Vitamin C", "dosage": "1000mg daily", "purpose": "Immune support"},
            {"name": "Zinc Supplement", "dosage": "50mg daily", "purpose": "Immune system support"},
            {"name": "Vitamin D3", "dosage": "2000 IU daily", "purpose": "Immune regulation"},
        ],
    },
    "diabetes_type2": {
        "lifestyle": "Monitor blood sugar daily (fasting and post-meal). Lose excess weight. Quit smoking. Regular health checkups every 3 months.",
        "diet": "Low glycemic index foods: whole grains, legumes, vegetables. Avoid refined sugar, white bread, sugary drinks. Eat 5–6 small meals daily. Limit portions.",
        "exercise": "150 minutes/week of moderate exercise (brisk walking, swimming, cycling). Strength training 2x/week. Check blood sugar before and after exercise.",
        "waterIntake": "2.5–3 liters per day. Avoid sugary drinks and fruit juices.",
        "sleep": "7–8 hours. Poor sleep worsens insulin resistance.",
        "followUp": "HbA1c test every 3 months. Annual eye, kidney, and foot examinations.",
        "doctor": "Endocrinologist",
        "medicines": [
            {"name": "Metformin", "dosage": "500–2000mg daily (doctor prescribed)", "purpose": "First-line diabetes medication – improves insulin sensitivity"},
            {"name": "Glipizide (if needed)", "dosage": "As prescribed by doctor", "purpose": "Stimulates insulin release"},
            {"name": "Aspirin (low-dose)", "dosage": "81mg daily (if cardiovascular risk)", "purpose": "Cardiovascular protection"},
        ],
    },
    "hypertension": {
        "lifestyle": "Reduce salt intake to under 2g/day. Stop smoking. Limit alcohol. Manage stress through meditation/yoga. Monitor BP daily.",
        "diet": "DASH Diet: fruits, vegetables, whole grains, low-fat dairy. Avoid processed foods, canned foods, pickles. Increase potassium intake (bananas, spinach, avocado).",
        "exercise": "150 minutes/week of aerobic exercise. Avoid heavy weightlifting. Swimming and walking are ideal.",
        "waterIntake": "2–2.5 liters per day. Limit caffeine.",
        "sleep": "7–8 hours. Sleep deprivation raises blood pressure.",
        "followUp": "BP monitoring twice daily. Doctor visit every 1–3 months until BP stabilized.",
        "doctor": "Cardiologist",
        "medicines": [
            {"name": "Amlodipine (Calcium Channel Blocker)", "dosage": "5–10mg daily (doctor prescribed)", "purpose": "Lowers blood pressure by relaxing blood vessels"},
            {"name": "Losartan (ARB)", "dosage": "50–100mg daily (doctor prescribed)", "purpose": "Relaxes blood vessels, reduces heart workload"},
            {"name": "Hydrochlorothiazide (Diuretic)", "dosage": "12.5–25mg daily", "purpose": "Reduces fluid retention and blood pressure"},
        ],
    },
    "pneumonia": {
        "lifestyle": "Complete bed rest. Stay in a warm, well-ventilated room. Avoid smoking. Practice deep breathing exercises to prevent atelectasis.",
        "diet": "High-protein, nutritious foods. Warm liquids. Avoid cold foods. Probiotics (yogurt) if on antibiotics.",
        "exercise": "No exercise until fully recovered. Respiratory physiotherapy may be advised.",
        "waterIntake": "3–4 liters per day to thin secretions.",
        "sleep": "10–12 hours. Sleep with head elevated at 30°.",
        "followUp": "Follow-up chest X-ray in 4–6 weeks. Emergency visit if breathing worsens or oxygen drops.",
        "doctor": "Pulmonologist",
        "medicines": [
            {"name": "Amoxicillin-Clavulanate", "dosage": "875mg/125mg twice daily for 7–10 days (doctor prescribed)", "purpose": "Broad-spectrum antibiotic for bacterial pneumonia"},
            {"name": "Azithromycin", "dosage": "500mg on day 1, then 250mg days 2–5", "purpose": "Atypical bacteria coverage"},
            {"name": "Paracetamol", "dosage": "500–1000mg every 6 hrs", "purpose": "Fever management"},
        ],
    },
    "migraine": {
        "lifestyle": "Identify and avoid triggers (bright lights, certain foods, stress). Keep a headache diary. Regular sleep schedule. Stress management.",
        "diet": "Avoid aged cheese, chocolate, alcohol, caffeine, MSG, processed meats. Stay hydrated. Magnesium-rich foods (almonds, spinach).",
        "exercise": "Regular moderate exercise prevents migraines. Avoid overexertion. Yoga and tai chi are beneficial.",
        "waterIntake": "2.5–3 liters per day. Dehydration is a major trigger.",
        "sleep": "7–9 hours consistently. Irregular sleep is a major trigger.",
        "followUp": "Neurologist consultation if migraines occur more than 4x/month or are increasingly severe.",
        "doctor": "Neurologist",
        "medicines": [
            {"name": "Ibuprofen", "dosage": "400–600mg at migraine onset", "purpose": "Acute pain relief"},
            {"name": "Sumatriptan (Triptan)", "dosage": "50–100mg at migraine onset (doctor prescribed)", "purpose": "Migraine-specific abortive treatment"},
            {"name": "Metoclopramide", "dosage": "10mg as needed", "purpose": "Nausea relief accompanying migraine"},
        ],
    },
    "gastroenteritis": {
        "lifestyle": "Rest. Strict hand hygiene. Separate food utensils. Avoid raw/undercooked food. Stay home to prevent spreading.",
        "diet": "BRAT Diet: Bananas, Rice, Applesauce, Toast. Clear broths. Gradually reintroduce normal foods. Avoid dairy, fatty, and spicy foods.",
        "exercise": "Complete rest during active illness.",
        "waterIntake": "3–4 liters per day. Oral rehydration salts (ORS) every hour during active diarrhea/vomiting.",
        "sleep": "8–10 hours.",
        "followUp": "Doctor visit if bloody diarrhea, fever above 104°F, inability to keep fluids down, or symptoms lasting more than 3 days.",
        "doctor": "Gastroenterologist",
        "medicines": [
            {"name": "ORS (Oral Rehydration Salts)", "dosage": "1 sachet dissolved in 1L water, sip frequently", "purpose": "Prevent and treat dehydration"},
            {"name": "Loperamide (Imodium)", "dosage": "4mg initially then 2mg after each loose stool (max 16mg/day)", "purpose": "Reduce diarrhea frequency"},
            {"name": "Ondansetron (Zofran)", "dosage": "4–8mg as needed (doctor prescribed)", "purpose": "Anti-nausea / anti-vomiting"},
        ],
    },
    "asthma": {
        "lifestyle": "Identify and avoid triggers (allergens, exercise, cold air, smoke). Keep reliever inhaler always accessible. Use air purifiers at home.",
        "diet": "Anti-inflammatory diet: fruits, vegetables, omega-3 fatty acids. Avoid sulfites (wine, dried fruits). Maintain healthy weight.",
        "exercise": "Avoid exercise in cold/dry air. Warm up gradually. Swimming is ideal. Always carry reliever inhaler.",
        "waterIntake": "2.5 liters per day. Staying hydrated helps keep airways moist.",
        "sleep": "7–8 hours. Use allergen-proof mattress covers.",
        "followUp": "Annual pulmonary function test. Immediate medical care if rescue inhaler is not working.",
        "doctor": "Pulmonologist / Allergist",
        "medicines": [
            {"name": "Salbutamol Inhaler (Reliever)", "dosage": "1–2 puffs as needed during symptoms", "purpose": "Immediate bronchospasm relief"},
            {"name": "Budesonide Inhaler (Controller)", "dosage": "1–2 puffs twice daily", "purpose": "Prevent inflammation and reduce attacks"},
            {"name": "Montelukast", "dosage": "10mg once daily at night (doctor prescribed)", "purpose": "Long-term asthma and allergy control"},
        ],
    },
}

DEFAULT_RECOMMENDATION = {
    "lifestyle": "Maintain a healthy lifestyle with adequate rest and stress management. Avoid smoking and excessive alcohol.",
    "diet": "Balanced diet with plenty of fruits, vegetables, lean proteins, and whole grains. Limit processed foods and sugar.",
    "exercise": "150 minutes of moderate physical activity per week. Walking, swimming, and yoga are beneficial.",
    "waterIntake": "2–2.5 liters per day.",
    "sleep": "7–9 hours per night.",
    "followUp": "Consult a physician for proper diagnosis and personalized treatment plan.",
    "doctor": "General Practitioner",
    "medicines": [
        {"name": "Paracetamol", "dosage": "500mg as needed for pain/fever", "purpose": "General symptom relief"},
    ],
}


def generate_recommendation(top_disease_id: str, top_disease_name: str) -> Dict:
    """
    Returns a tailored treatment recommendation for the top predicted disease.
    Falls back to generic recommendation if disease not in knowledge base.
    """
    rec = DISEASE_RECOMMENDATIONS.get(top_disease_id, DEFAULT_RECOMMENDATION).copy()
    rec["disclaimer"] = (
        "⚕️ MEDICAL DISCLAIMER: This AI-generated recommendation is for educational and preliminary "
        "screening purposes only. It does NOT replace professional medical advice, diagnosis, or treatment. "
        "Always consult a qualified and licensed physician before starting any medication or treatment plan. "
        "In case of emergency, call emergency services immediately."
    )
    return rec
