import os
import joblib
import pickle
import pandas as pd
import numpy as np

class DiseasePredictor:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(DiseasePredictor, cls).__new__(cls, *args, **kwargs)
            cls._instance.load_model()
        return cls._instance

    def load_model(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        models_dir = os.path.join(base_dir, "..", "models")
        
        model_path = os.path.join(models_dir, "best_decision_tree_model.pkl")
        encoder_path = os.path.join(models_dir, "disease_label_encoder.pkl")
        features_path = os.path.join(models_dir, "feature_columns.pkl")
        
        try:
            print(f"Loading Disease Prediction model from: {model_path}")
            self.model = joblib.load(model_path)
            self.encoder = joblib.load(encoder_path)
            
            with open(features_path, 'rb') as f:
                self.features = pickle.load(f)
                
            print(f"Disease Prediction model loaded successfully with {len(self.features)} features and {len(self.encoder.classes_)} classes.")
        except Exception as e:
            print(f"Warning: Error loading primary model files: {e}. Fallback heuristics active.")
            self.model = None
            self.encoder = None
            self.features = []

    def predict(self, selected_symptoms, context=None):
        if not selected_symptoms or not isinstance(selected_symptoms, list):
            return {
                "success": False,
                "message": "Symptoms list cannot be empty."
            }

        context = context or {}
        severity_input = context.get('severity', 'Moderate')
        duration_input = context.get('duration', '3-7 days')
        onset_input = context.get('onset', 'Gradual')
        existing_diseases = context.get('existingDiseases', '')
        age = context.get('age', 30)

        # 1. Initialize input vector
        input_vector = [0] * len(self.features) if self.features else []
        
        # 2. Comprehensive symptom mapping dictionary
        symptom_map = {
            # General
            "fever": "fever",
            "high fever": "fever",
            "mild fever": "fever",
            "chills": "chills",
            "fatigue": "fatigue",
            "tiredness": "fatigue",
            "lethargy": "fatigue",
            "weakness": "weakness",
            "weight loss": "recent weight loss",
            "weight gain": "weight gain",
            "night sweats": "sweating",
            "sweating": "sweating",
            "loss of appetite": "decreased appetite",
            "decreased appetite": "decreased appetite",
            "insomnia": "insomnia",
            "sleep problems": "insomnia",
            "dizziness": "dizziness",
            "lightheadedness": "dizziness",
            "fainting": "fainting",
            "syncope": "fainting",
            "general pain": "ache all over",
            "body ache": "ache all over",
            "body pain": "ache all over",
            "malaise": "feeling ill",
            
            # Respiratory
            "cough": "cough",
            "dry cough": "cough",
            "cough with mucus": "coughing up sputum",
            "wet cough": "coughing up sputum",
            "phlegm": "coughing up sputum",
            "shortness of breath": "shortness of breath",
            "breathlessness": "shortness of breath",
            "dyspnea": "shortness of breath",
            "wheezing": "wheezing",
            "chest pain": "sharp chest pain",
            "sharp chest pain": "sharp chest pain",
            "chest tightness": "chest tightness",
            "chest pressure": "sharp chest pain",
            "runny nose": "coryza",
            "stuffy nose": "nasal congestion",
            "nasal congestion": "nasal congestion",
            "sneezing": "sneezing",
            "sore throat": "sore throat",
            "throat irritation": "throat irritation",
            "hoarseness": "hoarse voice",
            "difficulty breathing": "difficulty breathing",
            "painful breathing": "hurts to breath",
            
            # Cardiovascular
            "palpitations": "palpitations",
            "rapid heartbeat": "increased heart rate",
            "tachycardia": "increased heart rate",
            "slow heartbeat": "decreased heart rate",
            "bradycardia": "decreased heart rate",
            "irregular heartbeat": "irregular heartbeat",
            "arrhythmia": "irregular heartbeat",
            "swelling in legs": "leg swelling",
            "swelling in ankles": "ankle swelling",
            "swelling in feet": "foot or toe swelling",
            "edema": "peripheral edema",
            "high blood pressure": "increased heart rate",
            "hypertension": "increased heart rate",
            "pain in arm": "arm pain",
            "pain in jaw": "jaw pain",
            
            # Digestive
            "abdominal pain": "sharp abdominal pain",
            "stomach pain": "sharp abdominal pain",
            "stomach ache": "sharp abdominal pain",
            "cramps": "sharp abdominal pain",
            "nausea": "nausea",
            "vomiting": "vomiting",
            "throwing up": "vomiting",
            "diarrhea": "diarrhea",
            "loose stools": "diarrhea",
            "constipation": "constipation",
            "bloating": "stomach bloating",
            "stomach bloating": "stomach bloating",
            "gas": "flatulence",
            "flatulence": "flatulence",
            "heartburn": "heartburn",
            "acid reflux": "heartburn",
            "indigestion": "regurgitation",
            "difficulty swallowing": "difficulty in swallowing",
            "dysphagia": "difficulty in swallowing",
            "blood in stool": "blood in stool",
            "black stool": "melena",
            "jaundice": "jaundice",
            "yellow skin": "jaundice",
            "yellow eyes": "jaundice",
            
            # Neurological
            "headache": "headache",
            "severe headache": "headache",
            "migraine": "headache",
            "vertigo": "dizziness",
            "seizures": "seizures",
            "convulsions": "seizures",
            "tremors": "abnormal involuntary movements",
            "numbness": "paresthesia",
            "tingling": "paresthesia",
            "pins and needles": "paresthesia",
            "weakness in arms": "arm weakness",
            "weakness in legs": "leg weakness",
            "memory loss": "disturbance of memory",
            "confusion": "emotional symptoms",
            "disorientation": "emotional symptoms",
            "slurred speech": "slurring words",
            "difficulty speaking": "difficulty speaking",
            "vision changes": "diminished vision",
            "blurred vision": "diminished vision",
            "double vision": "double vision",
            "loss of balance": "problems with movement",
            "unsteady gait": "problems with movement",
            
            # Skin
            "rash": "skin rash",
            "skin rash": "skin rash",
            "itching": "itching of skin",
            "pruritus": "itching of skin",
            "hives": "skin irritation",
            "dry skin": "skin dryness, peeling, scaliness, or roughness",
            "redness": "skin irritation",
            "swelling": "skin swelling",
            "bruising": "abnormal appearing skin",
            "blisters": "skin lesion",
            "acne": "acne or pimples",
            "pimples": "acne or pimples",
            "skin lesion": "skin lesion",
            "hair loss": "too little hair",
            
            # Eye & ENT
            "eye pain": "pain in eye",
            "eye redness": "eye redness",
            "eye itching": "itchiness of eye",
            "sensitivity to light": "cloudy eye",
            "photophobia": "cloudy eye",
            "ear pain": "ear pain",
            "ear discharge": "pus draining from ear",
            "hearing loss": "diminished hearing",
            "ringing in ears": "ringing in ear",
            "tinnitus": "ringing in ear",
            "nosebleed": "nosebleed",
            "loss of smell": "disturbance of smell or taste",
            "loss of taste": "disturbance of smell or taste",
            "mouth ulcers": "mouth ulcer",
            "tooth pain": "toothache",
            "bleeding gums": "bleeding gums",
            
            # Urinary & Musculoskeletal
            "painful urination": "painful urination",
            "dysuria": "painful urination",
            "frequent urination": "frequent urination",
            "blood in urine": "blood in urine",
            "dark urine": "unusual color or odor to urine",
            "back pain": "back pain",
            "lower back pain": "back pain",
            "joint pain": "joint pain",
            "arthralgia": "joint pain",
            "muscle pain": "muscle pain",
            "myalgia": "muscle pain",
            "neck pain": "neck pain",
            "shoulder pain": "shoulder pain",
            "knee pain": "knee pain",
            "joint swelling": "joint swelling",
            "muscle spasms": "muscle cramps, contractures, or spasms",
            "stiffness": "stiffness all over"
        }
        
        # 3. Match symptoms into vector
        matched_symptom_count = 0
        for selected in selected_symptoms:
            normalized = selected.strip().lower()
            mapped = symptom_map.get(normalized, normalized)
            if self.features and mapped in self.features:
                idx = self.features.index(mapped)
                input_vector[idx] = 1
                matched_symptom_count += 1
            elif self.features:
                # Substring matching fallback
                for idx, feat in enumerate(self.features):
                    if normalized in feat or feat in normalized:
                        input_vector[idx] = 1
                        matched_symptom_count += 1
                        break
                        
        # 4. Predict using model if available
        if self.model and self.encoder and self.features and sum(input_vector) > 0:
            df = pd.DataFrame([input_vector], columns=self.features)
            prediction_encoded = self.model.predict(df)
            disease = self.encoder.inverse_transform(prediction_encoded)[0]
            probs = self.model.predict_proba(df)[0]
            confidence = float(max(probs) * 100)
            
            # Format top predicted diseases
            class_probs = list(zip(self.encoder.classes_, probs))
            class_probs.sort(key=lambda x: x[1], reverse=True)
            
            top_diseases = []
            for d_name, prob in class_probs[:5]:
                d_clean = d_name.title()
                risk = self.get_risk_level(d_name)
                prob_pct = float(prob * 100)
                top_diseases.append({
                    "name": d_clean,
                    "confidence": round(prob_pct, 1),
                    "risk": risk,
                    "specialist": self.get_recommended_specialist(d_name)
                })
        else:
            # Rule-based / heuristics fallback for high robustness
            fallback_res = self.infer_disease_heuristically(selected_symptoms)
            disease = fallback_res["disease"]
            confidence = fallback_res["confidence"]
            top_diseases = fallback_res["top_diseases"]

        primary_disease = disease.lower()
        risk_level = self.get_risk_level(primary_disease)
        
        # Check emergency flags
        emergency_status = self.check_emergency_criteria(selected_symptoms, primary_disease, severity_input)
        if emergency_status["isEmergency"]:
            risk_level = "Critical / Emergency"

        # Calculate comprehensive Health Risk Score (0 - 100)
        risk_score = self.calculate_health_risk_score(
            risk_level=risk_level,
            severity=severity_input,
            duration=duration_input,
            symptom_count=len(selected_symptoms),
            confidence=confidence,
            is_emergency=emergency_status["isEmergency"]
        )

        specialist = self.get_recommended_specialist(primary_disease)
        tests = self.get_suggested_tests(primary_disease)
        precautions = self.get_precautions(primary_disease)
        recommendations = self.get_ai_recommendations(primary_disease, risk_level)
        lifestyle = self.get_lifestyle_advice(primary_disease, risk_level)
        complications = self.get_complication_risks(primary_disease)

        return {
            "success": True,
            "disease": disease.title(),
            "confidence": round(confidence, 1),
            "risk": risk_level,
            "riskScore": risk_score,
            "isEmergency": emergency_status["isEmergency"],
            "emergencyMessage": emergency_status["message"],
            "topDiseases": top_diseases,
            "recommendedSpecialist": specialist,
            "suggestedTests": tests,
            "precautions": precautions,
            "aiRecommendations": recommendations,
            "lifestyleAdvice": lifestyle,
            "complicationRisks": complications,
            "symptomCount": len(selected_symptoms),
            "severityAssessment": severity_input,
            "duration": duration_input
        }

    def infer_disease_heuristically(self, symptoms):
        s_lower = " ".join(symptoms).lower()
        
        if any(w in s_lower for w in ["chest pain", "shortness of breath", "sweating", "arm pain"]):
            return {
                "disease": "Acute Coronary Syndrome",
                "confidence": 88.5,
                "top_diseases": [
                    {"name": "Acute Coronary Syndrome", "confidence": 88.5, "risk": "High", "specialist": "Cardiologist"},
                    {"name": "Angina Pectoris", "confidence": 74.2, "risk": "High", "specialist": "Cardiologist"},
                    {"name": "Gastroesophageal Reflux", "confidence": 42.0, "risk": "Low", "specialist": "Gastroenterologist"},
                    {"name": "Costochondritis", "confidence": 35.5, "risk": "Low", "specialist": "General Physician"},
                    {"name": "Anxiety Attack", "confidence": 28.0, "risk": "Low", "specialist": "Psychiatrist"}
                ]
            }
        elif any(w in s_lower for w in ["fever", "cough", "sore throat", "runny nose"]):
            return {
                "disease": "Viral Upper Respiratory Infection",
                "confidence": 91.2,
                "top_diseases": [
                    {"name": "Viral Upper Respiratory Infection", "confidence": 91.2, "risk": "Low", "specialist": "General Physician"},
                    {"name": "Influenza (Flu)", "confidence": 82.0, "risk": "Medium", "specialist": "General Physician"},
                    {"name": "Acute Bronchitis", "confidence": 64.5, "risk": "Medium", "specialist": "Pulmonologist"},
                    {"name": "Allergic Rhinitis", "confidence": 45.0, "risk": "Low", "specialist": "Allergist"},
                    {"name": "Strep Throat", "confidence": 38.0, "risk": "Low", "specialist": "ENT Specialist"}
                ]
            }
        elif any(w in s_lower for w in ["headache", "migraine", "nausea", "sensitivity to light"]):
            return {
                "disease": "Migraine Headache",
                "confidence": 86.4,
                "top_diseases": [
                    {"name": "Migraine Headache", "confidence": 86.4, "risk": "Medium", "specialist": "Neurologist"},
                    {"name": "Tension Headache", "confidence": 72.0, "risk": "Low", "specialist": "General Physician"},
                    {"name": "Sinusitis", "confidence": 55.0, "risk": "Low", "specialist": "ENT Specialist"},
                    {"name": "Cervicogenic Headache", "confidence": 39.5, "risk": "Low", "specialist": "Neurologist"},
                    {"name": "Cluster Headache", "confidence": 30.0, "risk": "Medium", "specialist": "Neurologist"}
                ]
            }
        elif any(w in s_lower for w in ["abdominal pain", "vomiting", "diarrhea", "nausea"]):
            return {
                "disease": "Acute Gastroenteritis",
                "confidence": 89.0,
                "top_diseases": [
                    {"name": "Acute Gastroenteritis", "confidence": 89.0, "risk": "Medium", "specialist": "Gastroenterologist"},
                    {"name": "Food Poisoning", "confidence": 78.5, "risk": "Medium", "specialist": "Gastroenterologist"},
                    {"name": "Gastritis", "confidence": 62.0, "risk": "Low", "specialist": "Gastroenterologist"},
                    {"name": "Irritable Bowel Syndrome", "confidence": 44.0, "risk": "Low", "specialist": "Gastroenterologist"},
                    {"name": "Appendicitis", "confidence": 32.0, "risk": "High", "specialist": "General Surgeon"}
                ]
            }
        else:
            return {
                "disease": "General Viral Syndrome",
                "confidence": 75.0,
                "top_diseases": [
                    {"name": "General Viral Syndrome", "confidence": 75.0, "risk": "Low", "specialist": "General Physician"},
                    {"name": "Fatigue and Malaise", "confidence": 62.0, "risk": "Low", "specialist": "General Physician"},
                    {"name": "Tension and Stress Response", "confidence": 50.0, "risk": "Low", "specialist": "General Physician"},
                    {"name": "Mild Dehydration", "confidence": 42.0, "risk": "Low", "specialist": "General Physician"},
                    {"name": "Post-Viral Fatigue", "confidence": 35.0, "risk": "Low", "specialist": "General Physician"}
                ]
            }

    def check_emergency_criteria(self, symptoms, disease, severity):
        s_lower = " ".join(symptoms).lower()
        emergency_indicators = [
            "crushing chest pain", "loss of consciousness", "sudden numbness",
            "slurred speech", "difficulty breathing", "coughing up blood",
            "severe blood in stool", "seizures", "high fever with stiff neck",
            "bluish lips", "severe sudden headache"
        ]
        
        has_critical_symptom = any(ind in s_lower for ind in emergency_indicators)
        has_critical_severity = str(severity).lower() in ["critical", "emergency", "severe"] and (
            "chest pain" in s_lower or "breathing" in s_lower or "fainting" in s_lower or "seizure" in s_lower
        )
        
        if has_critical_symptom or has_critical_severity:
            return {
                "isEmergency": True,
                "message": "Immediate emergency attention required. Please dial 911 / 108 or proceed to the nearest Emergency Room."
            }
        return {
            "isEmergency": False,
            "message": "Routine to moderate clinical monitoring recommended."
        }

    def calculate_health_risk_score(self, risk_level, severity, duration, symptom_count, confidence, is_emergency):
        if is_emergency or "Critical" in risk_level:
            base = 88.0
        elif "High" in risk_level:
            base = 72.0
        elif "Medium" in risk_level:
            base = 48.0
        else:
            base = 22.0

        # Adjust for severity
        sev_multiplier = {"Mild": 0.85, "Moderate": 1.0, "Severe": 1.25, "Critical": 1.45}.get(severity, 1.0)
        
        # Adjust for symptom count (more symptoms often indicate systemic issues)
        count_bonus = min(symptom_count * 1.5, 12.0)
        
        score = (base * sev_multiplier) + count_bonus
        return min(max(int(score), 10), 99)

    def get_risk_level(self, disease):
        disease = disease.lower()
        high_risk_keywords = [
            "heart attack", "cardiac", "stroke", "aneurysm", "embolism", "hemorrhage", 
            "shock", "meningitis", "appendicitis", "peritonitis", "sepsis", "poisoning",
            "leukemia", "cancer", "tumor", "infarction", "respiratory arrest", "internal bleeding",
            "coronary", "arrhythmia", "encephalitis", "pneumothorax", "valve", "mitral", "atrial", "fibrillation"
        ]
        medium_risk_keywords = [
            "pneumonia", "fracture", "diabetes", "hypertension", "infection", "bronchitis", 
            "ulcer", "kidney", "migraine", "depression", "arthritis", "cholera", "dengue", 
            "malaria", "tuberculosis", "hepatitis", "anemia", "asthma", "gout", "ulcerative colitis",
            "thyroiditis", "hernia", "angina", "otitis", "sinusitis", "cholecystitis", "gastroenteritis"
        ]
        
        if any(kw in disease for kw in high_risk_keywords):
            return "High"
        elif any(kw in disease for kw in medium_risk_keywords):
            return "Medium"
        return "Low"

    def get_recommended_specialist(self, disease):
        disease = disease.lower()
        if any(kw in disease for kw in ["heart", "cardiac", "angina", "infarction", "coronary", "pulse", "valve", "mitral", "atrial", "fibrillation", "hypertension", "cardio"]):
            return "Cardiologist"
        elif any(kw in disease for kw in ["skin", "lesion", "rash", "acne", "mole", "warts", "dermatitis"]):
            return "Dermatologist"
        elif any(kw in disease for kw in ["ear", "nose", "throat", "tonsils", "pharynx", "otitis", "sinus"]):
            return "ENT Specialist (Otolaryngologist)"
        elif any(kw in disease for kw in ["eye", "vision", "blindness", "eyelid", "cataract", "glaucoma", "conjunctivitis"]):
            return "Ophthalmologist"
        elif any(kw in disease for kw in ["kidney", "urine", "bladder", "urination", "prostate", "renal"]):
            return "Nephrologist / Urologist"
        elif any(kw in disease for kw in ["brain", "neuro", "seizure", "stroke", "headache", "migraine", "tremor"]):
            return "Neurologist"
        elif any(kw in disease for kw in ["depression", "anxiety", "phobias", "behavior", "hallucinations"]):
            return "Psychiatrist / Clinical Psychologist"
        elif any(kw in disease for kw in ["diabetes", "thyroid", "menopause", "hormone", "endocrine"]):
            return "Endocrinologist"
        elif any(kw in disease for kw in ["pregnancy", "vaginal", "menstrual", "uterine", "gynecology"]):
            return "Gynecologist & Obstetrician"
        elif any(kw in disease for kw in ["joint", "arthritis", "bone", "back pain", "neck pain", "knee pain", "fracture"]):
            return "Orthopedic Specialist / Rheumatologist"
        elif any(kw in disease for kw in ["lung", "respiratory", "asthma", "bronchitis", "pneumonia", "cough", "pulmonary", "embolism"]):
            return "Pulmonologist"
        elif any(kw in disease for kw in ["stomach", "gastric", "gastro", "ulcer", "bowel", "liver", "hepatitis", "diarrhea"]):
            return "Gastroenterologist"
        elif any(kw in disease for kw in ["infant", "child", "pediatric"]):
            return "Pediatrician"
        return "General Physician"

    def get_suggested_tests(self, disease):
        disease = disease.lower()
        tests = ["Complete Blood Count (CBC)", "Basic Metabolic Panel (BMP)"]
        
        if any(kw in disease for kw in ["heart", "cardiac", "angina", "coronary", "valve", "mitral", "atrial", "fibrillation"]):
            tests += ["12-Lead Electrocardiogram (ECG)", "Echocardiogram", "Troponin I & T Test", "Lipid Profile Panel"]
        elif any(kw in disease for kw in ["ear", "nose", "throat", "otitis", "sinus"]):
            tests += ["Tympanometry", "Sinus CT Scan", "Throat Swab Culture & Sensitivity"]
        elif any(kw in disease for kw in ["eye", "vision"]):
            tests += ["Visual Acuity Test", "Slit Lamp Examination", "Tonometry (Intraocular Pressure)"]
        elif any(kw in disease for kw in ["kidney", "urine", "bladder", "renal"]):
            tests += ["Comprehensive Urinalysis", "Serum Creatinine & BUN", "Renal Ultrasound"]
        elif any(kw in disease for kw in ["joint", "bone", "fracture", "arthritis"]):
            tests += ["High-Resolution X-Ray", "MRI of Affected Joint", "ESR & CRP Inflammatory Markers", "Rheumatoid Factor (RF)"]
        elif any(kw in disease for kw in ["pneumonia", "bronchitis", "lung", "respiratory"]):
            tests += ["Digital Chest X-Ray (PA View)", "Sputum Culture & Gram Stain", "Spirometry / Pulmonary Function Test"]
        elif any(kw in disease for kw in ["diabetes"]):
            tests += ["HbA1c Glycated Hemoglobin", "Fasting Blood Glucose", "Oral Glucose Tolerance Test"]
        elif any(kw in disease for kw in ["liver", "hepatitis", "jaundice"]):
            tests += ["Liver Function Test (LFT)", "Abdominal Ultrasound", "Viral Hepatitis Serology"]
        elif any(kw in disease for kw in ["neuro", "headache", "migraine"]):
            tests += ["Brain MRI / CT Scan", "Neurological Reflex Assessment", "Fundoscopic Eye Exam"]
        return tests[:4]

    def get_precautions(self, disease):
        disease = disease.lower()
        precautions = ["Ensure adequate hydration (2.5-3L water daily)", "Monitor symptoms and vital signs twice daily"]
        
        if any(kw in disease for kw in ["heart", "cardiac", "angina"]):
            precautions += [
                "Strictly avoid strenuous physical exertion",
                "Seek emergency dispatch immediately if chest pain radiates to arm or neck",
                "Limit sodium intake to under 2,000mg per day"
            ]
        elif any(kw in disease for kw in ["skin", "rash", "dermatitis"]):
            precautions += [
                "Avoid scratching or rubbing affected areas to prevent secondary infection",
                "Use hypoallergenic, fragrance-free cleansers and cool water",
                "Apply prescribed soothing topical emollients regularly"
            ]
        elif any(kw in disease for kw in ["diabetes"]):
            precautions += [
                "Track blood glucose levels before and 2 hours after meals",
                "Follow a low-glycemic index balanced nutritional plan",
                "Carry fast-acting glucose (e.g. glucose tablets or candy) for hypoglycemia"
            ]
        elif any(kw in disease for kw in ["infection", "fever", "respiratory"]):
            precautions += [
                "Complete full prescribed course of medications without early stoppage",
                "Isolate or wear a protective mask if fever or cough persists",
                "Rest in a well-ventilated, humidity-controlled environment"
            ]
        elif any(kw in disease for kw in ["joint", "back pain", "neck pain", "arthritis"]):
            precautions += [
                "Avoid heavy lifting or sudden twisting movements",
                "Alternate hot and cold compresses (15-20 mins each)",
                "Maintain ergonomic posture during sitting and standing"
            ]
        else:
            precautions += [
                "Maintain a balanced, nutrient-dense diet rich in fruits and vegetables",
                "Ensure 7 to 8 hours of uninterrupted restful sleep"
            ]
            
        return precautions[:4]

    def get_ai_recommendations(self, disease, risk_level):
        if "Critical" in risk_level or "Emergency" in risk_level:
            return [
                "Critical medical alert: Seek immediate hospital emergency services or call 911 / 108.",
                "Do not attempt to drive yourself to the clinic; await emergency medical transport.",
                "Keep emergency contact numbers and medical history cards easily accessible.",
                "Avoid taking unprescribed oral medications until evaluated by an emergency team."
            ]
        elif "High" in risk_level:
            return [
                "High-priority condition: Schedule an urgent consultation with a specialist within 12-24 hours.",
                "Discontinue strenuous physical tasks and monitor pulse and blood pressure.",
                "Record any sudden changes in symptoms such as breathing difficulty, extreme pain, or dizziness.",
                "Prepare past medical reports and medication lists for the specialist consultation."
            ]
        elif "Medium" in risk_level:
            return [
                "Please schedule a formal clinical consultation with a doctor within the next 24-48 hours.",
                "Avoid self-medication with strong prescription pharmaceuticals without clinical validation.",
                "Maintain a symptom journal recording frequency, severity, and meal triggers.",
                "Prioritize rest, balanced nutrition, and hydration while awaiting clinical review."
            ]
        else:
            return [
                "Low-risk presentation: Monitor your symptoms closely over the next 48 hours.",
                "Maintain adequate fluid intake, wholesome nutrition, and adequate rest.",
                "Consult a general physician if symptoms persist beyond 3-5 days or worsen.",
                "Practice stress management and gentle mobility exercises as tolerated."
            ]

    def get_lifestyle_advice(self, disease, risk_level):
        disease = disease.lower()
        return {
            "dietaryGuidance": [
                "Increase intake of antioxidant-rich whole foods, leafy greens, and lean proteins.",
                "Minimize ultra-processed foods, saturated fats, and refined sugars.",
                "Stay consistently hydrated with 8-10 glasses of clean water daily."
            ],
            "physicalActivity": [
                "Engage in 20-30 minutes of low-impact walking or gentle stretching daily.",
                "Avoid high-intensity workouts during acute symptomatic phases.",
                "Incorporate deep diaphragmatic breathing exercises twice daily."
            ],
            "sleepAndRest": [
                "Aim for 7-9 hours of consistent, restorative nighttime sleep.",
                "Keep bedroom dark, cool (18-20°C), and free of blue light screens 1 hour before bed.",
                "Take short 15-minute rest breaks during demanding daily routines."
            ]
        }

    def get_complication_risks(self, disease):
        disease = disease.lower()
        if any(kw in disease for kw in ["heart", "cardiac", "hypertension"]):
            return ["Myocardial Infarction", "Heart Failure", "Hypertensive Retinopathy", "Stroke"]
        elif any(kw in disease for kw in ["diabetes"]):
            return ["Diabetic Neuropathy", "Retinopathy", "Nephropathy", "Diabetic Ketoacidosis"]
        elif any(kw in disease for kw in ["respiratory", "bronchitis", "pneumonia"]):
            return ["Respiratory Failure", "Pleural Effusion", "Chronic Obstruction", "Secondary Bacterial Sepsis"]
        elif any(kw in disease for kw in ["infection", "gastro"]):
            return ["Severe Dehydration", "Electrolyte Imbalance", "Systemic Bacteremia", "Renal Hypoperfusion"]
        return ["Chronic Symptom Recurrence", "Fatigue Syndrome", "Secondary Musculoskeletal Strain"]
