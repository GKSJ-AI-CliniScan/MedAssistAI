import { Router, Request, Response } from 'express';

const router = Router();

// ─── Disease Pattern Database ───
// Maps symptom combinations to possible diseases with base probabilities

interface DiseasePattern {
  disease: string;
  matchSymptoms: string[];
  riskFactors: string[];   // conditions that increase probability
  baseSeverity: number;     // 0-100
  urgency: 'low' | 'medium' | 'high' | 'critical';
  specialistType: string;
  description: string;
  recommendations: string[];
}

const DISEASE_PATTERNS: DiseasePattern[] = [
  {
    disease: "Common Cold",
    matchSymptoms: ["Fever", "Cough", "Runny Nose", "Sore Throat", "Fatigue", "Sneezing", "Congestion"],
    riskFactors: [],
    baseSeverity: 15,
    urgency: "low",
    specialistType: "General Physician",
    description: "A viral infection of the upper respiratory tract.",
    recommendations: [
      "Rest and stay hydrated with warm fluids",
      "Use over-the-counter decongestants if needed",
      "Gargle with warm salt water for sore throat",
      "Symptoms usually resolve in 7-10 days"
    ]
  },
  {
    disease: "Influenza (Flu)",
    matchSymptoms: ["Fever", "Cough", "Body Pain", "Fatigue", "Chills", "Headache", "Sweating"],
    riskFactors: ["Diabetes", "Heart Disease", "COPD"],
    baseSeverity: 35,
    urgency: "medium",
    specialistType: "General Physician",
    description: "A highly contagious viral respiratory illness.",
    recommendations: [
      "Take antiviral medication within 48 hours of symptom onset",
      "Get plenty of rest and drink fluids",
      "Take paracetamol for fever and body aches",
      "Isolate to prevent spread to others"
    ]
  },
  {
    disease: "COVID-19",
    matchSymptoms: ["Fever", "Cough", "Breathlessness", "Fatigue", "Loss of Appetite", "Body Pain", "Sore Throat"],
    riskFactors: ["Diabetes", "Heart Disease", "COPD", "Hypertension"],
    baseSeverity: 50,
    urgency: "high",
    specialistType: "Pulmonologist",
    description: "A respiratory illness caused by the SARS-CoV-2 virus.",
    recommendations: [
      "Get tested for COVID-19 immediately",
      "Isolate from others and monitor oxygen levels",
      "Seek emergency care if breathing becomes difficult",
      "Stay hydrated and rest. Take paracetamol for fever"
    ]
  },
  {
    disease: "Dengue Fever",
    matchSymptoms: ["Fever", "Headache", "Body Pain", "Joint Pain", "Skin Rash", "Nausea", "Fatigue"],
    riskFactors: [],
    baseSeverity: 60,
    urgency: "high",
    specialistType: "Infectious Disease Specialist",
    description: "A mosquito-borne tropical disease caused by the dengue virus.",
    recommendations: [
      "⚠️ Consult a doctor immediately for blood tests",
      "Monitor platelet count regularly",
      "Stay hydrated — drink ORS, coconut water, and juices",
      "Avoid aspirin and ibuprofen (use paracetamol only)"
    ]
  },
  {
    disease: "Typhoid",
    matchSymptoms: ["Fever", "Headache", "Stomach Pain", "Fatigue", "Loss of Appetite", "Diarrhea", "Constipation"],
    riskFactors: [],
    baseSeverity: 50,
    urgency: "medium",
    specialistType: "Gastroenterologist",
    description: "A bacterial infection caused by Salmonella typhi.",
    recommendations: [
      "Get a Widal test or blood culture done",
      "Complete the full course of prescribed antibiotics",
      "Eat light, easily digestible foods",
      "Maintain strict hygiene and drink boiled water"
    ]
  },
  {
    disease: "Malaria",
    matchSymptoms: ["Fever", "Chills", "Sweating", "Headache", "Nausea", "Body Pain", "Fatigue"],
    riskFactors: [],
    baseSeverity: 55,
    urgency: "high",
    specialistType: "Infectious Disease Specialist",
    description: "A parasitic disease transmitted through mosquito bites.",
    recommendations: [
      "Get a blood smear test for malaria parasites",
      "Antimalarial medication is essential — see a doctor",
      "Stay hydrated and rest",
      "Use mosquito nets and repellents to prevent re-infection"
    ]
  },
  {
    disease: "Gastritis / GERD",
    matchSymptoms: ["Stomach Pain", "Nausea", "Vomiting", "Loss of Appetite", "Acidity", "Bloating", "Indigestion"],
    riskFactors: [],
    baseSeverity: 25,
    urgency: "low",
    specialistType: "Gastroenterologist",
    description: "Inflammation of the stomach lining, often caused by H. pylori or NSAIDs.",
    recommendations: [
      "Avoid spicy, acidic, and fried foods",
      "Take antacids or proton pump inhibitors (PPIs)",
      "Eat smaller, more frequent meals",
      "Avoid alcohol, smoking, and late-night eating"
    ]
  },
  {
    disease: "Migraine",
    matchSymptoms: ["Headache", "Nausea", "Blurred Vision", "Dizziness", "Fatigue"],
    riskFactors: [],
    baseSeverity: 30,
    urgency: "low",
    specialistType: "Neurologist",
    description: "A neurological condition with recurrent intense headaches, often with aura.",
    recommendations: [
      "Rest in a dark, quiet room during episodes",
      "Track triggers (stress, sleep, food, screens)",
      "Take prescribed triptans for acute attacks",
      "Stay hydrated and maintain regular sleep patterns"
    ]
  },
  {
    disease: "Pneumonia",
    matchSymptoms: ["Fever", "Cough", "Breathlessness", "Chest Pain", "Chills", "Fatigue", "Sweating"],
    riskFactors: ["Asthma", "COPD"],
    baseSeverity: 65,
    urgency: "high",
    specialistType: "Pulmonologist",
    description: "An infection that inflames air sacs in one or both lungs.",
    recommendations: [
      "⚠️ See a doctor urgently for chest X-ray",
      "Complete the full antibiotic course if prescribed",
      "Monitor oxygen levels with a pulse oximeter",
      "Get pneumococcal vaccination for prevention"
    ]
  },
  {
    disease: "Bronchitis",
    matchSymptoms: ["Cough", "Wheezing", "Breathlessness", "Chest Pain", "Fatigue", "Congestion"],
    riskFactors: ["Asthma"],
    baseSeverity: 35,
    urgency: "medium",
    specialistType: "Pulmonologist",
    description: "Inflammation of the bronchial tubes, often following a cold.",
    recommendations: [
      "Avoid smoking and secondhand smoke",
      "Use a humidifier to ease breathing",
      "Drink warm fluids and take cough suppressants",
      "See a doctor if symptoms persist beyond 3 weeks"
    ]
  },
  {
    disease: "Hypertension",
    matchSymptoms: ["Headache", "Dizziness", "Blurred Vision", "Chest Pain", "Breathlessness"],
    riskFactors: ["Heart Disease", "Diabetes"],
    baseSeverity: 50,
    urgency: "medium",
    specialistType: "Cardiologist",
    description: "Persistently elevated blood pressure that can damage organs over time.",
    recommendations: [
      "Monitor blood pressure regularly (home and clinic)",
      "Reduce sodium intake and follow a DASH diet",
      "Exercise regularly (30 min/day, 5 days/week)",
      "Take prescribed antihypertensive medications consistently"
    ]
  },
  {
    disease: "Type 2 Diabetes",
    matchSymptoms: ["Fatigue", "Numbness", "Blurred Vision", "Loss of Appetite", "Dizziness", "Dehydration"],
    riskFactors: ["Diabetes"],
    baseSeverity: 55,
    urgency: "medium",
    specialistType: "Endocrinologist",
    description: "A chronic metabolic condition where the body cannot regulate blood sugar properly.",
    recommendations: [
      "Get fasting blood glucose and HbA1c tested",
      "Follow a low-glycemic, balanced diet plan",
      "Exercise regularly to improve insulin sensitivity",
      "Monitor blood sugar levels daily if diagnosed"
    ]
  },
  {
    disease: "Arthritis",
    matchSymptoms: ["Joint Pain", "Body Pain", "Muscle Cramps", "Fatigue", "Numbness", "Swelling"],
    riskFactors: ["Arthritis"],
    baseSeverity: 35,
    urgency: "low",
    specialistType: "Rheumatologist",
    description: "Inflammation of joints causing pain and stiffness.",
    recommendations: [
      "Apply warm compresses to affected joints",
      "Practice gentle stretching and range-of-motion exercises",
      "Take prescribed anti-inflammatory medications",
      "Maintain a healthy weight to reduce joint stress"
    ]
  },
  {
    disease: "Anemia",
    matchSymptoms: ["Fatigue", "Dizziness", "Headache", "Breathlessness", "Numbness", "Weight Loss"],
    riskFactors: [],
    baseSeverity: 35,
    urgency: "medium",
    specialistType: "Hematologist",
    description: "A condition where the blood has insufficient healthy red blood cells.",
    recommendations: [
      "Get a complete blood count (CBC) test",
      "Include iron-rich foods: spinach, lentils, red meat",
      "Take iron and vitamin B12 supplements as prescribed",
      "Treat underlying cause (heavy periods, chronic disease)"
    ]
  },
  {
    disease: "Allergic Reaction",
    matchSymptoms: ["Skin Rash", "Wheezing", "Nausea", "Dizziness", "Breathlessness", "Itching", "Sneezing"],
    riskFactors: [],
    baseSeverity: 30,
    urgency: "medium",
    specialistType: "Allergist / Immunologist",
    description: "An immune system response to a normally harmless substance.",
    recommendations: [
      "Identify and avoid the allergen trigger",
      "Take antihistamines for mild reactions",
      "⚠️ Seek emergency care if throat swelling or difficulty breathing",
      "Consider allergy testing to identify specific triggers"
    ]
  },
  {
    disease: "Urinary Tract Infection (UTI)",
    matchSymptoms: ["Fever", "Stomach Pain", "Back Pain", "Fatigue", "Dehydration"],
    riskFactors: [],
    baseSeverity: 30,
    urgency: "medium",
    specialistType: "Urologist",
    description: "A bacterial infection in the urinary system.",
    recommendations: [
      "Drink plenty of water to flush out bacteria",
      "Complete the full antibiotic course",
      "Avoid caffeine and alcohol during treatment",
      "Maintain proper hygiene to prevent recurrence"
    ]
  }
];

// ─── Symptom Check Endpoint ───

router.post('/check', async (req: Request, res: Response) => {
  try {
    const { symptoms, patientInfo } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'At least one symptom is required' });
    }

    const age = parseInt(patientInfo?.age) || 30;
    const gender = patientInfo?.gender || 'male';
    const severity = patientInfo?.severity || 'moderate';
    const duration = patientInfo?.duration || 'today';
    const weight = parseFloat(patientInfo?.weight) || 0;
    const height = parseFloat(patientInfo?.height) || 0;
    const temperature = parseFloat(patientInfo?.temperature) || 98.6;
    const heartRate = parseInt(patientInfo?.heartRate) || 72;
    const bpSystolic = parseInt(patientInfo?.bp_systolic) || 120;
    const bpDiastolic = parseInt(patientInfo?.bp_diastolic) || 80;
    const diabetes = patientInfo?.diabetes === 'yes';
    const smoking = patientInfo?.smoking === 'yes';
    const bloodGroup = patientInfo?.bloodGroup || '';
    const medicalHistory = patientInfo?.medicalHistory || {};

    // Calculate BMI
    let bmi: number | null = null;
    if (height > 0 && weight > 0) {
      const heightM = height / 100;
      bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
    }

    // Calculate body fat estimate (US Navy method approximation)
    let bodyFat: number | null = null;
    if (bmi) {
      if (gender === 'male') {
        bodyFat = Math.round((1.20 * bmi + 0.23 * age - 16.2) * 10) / 10;
      } else {
        bodyFat = Math.round((1.20 * bmi + 0.23 * age - 5.4) * 10) / 10;
      }
      bodyFat = Math.max(5, Math.min(50, bodyFat));
    }

    // Calculate health index (0-100)
    let healthIndex = 70;
    if (bmi) {
      if (bmi >= 18.5 && bmi < 25) healthIndex += 15;
      else if (bmi >= 25 && bmi < 30) healthIndex += 5;
      else healthIndex -= 5;
    }
    if (temperature >= 97.0 && temperature <= 99.0) healthIndex += 5;
    else healthIndex -= 10;
    if (heartRate >= 60 && heartRate <= 100) healthIndex += 5;
    else healthIndex -= 5;
    if (bpSystolic <= 120 && bpDiastolic <= 80) healthIndex += 5;
    else if (bpSystolic > 140 || bpDiastolic > 90) healthIndex -= 10;
    if (!smoking) healthIndex += 3;
    if (!diabetes) healthIndex += 3;
    healthIndex = Math.max(0, Math.min(100, healthIndex));

    // Score each disease pattern
    const scored = DISEASE_PATTERNS.map(pattern => {
      const matchCount = pattern.matchSymptoms.filter(s => symptoms.includes(s)).length;
      const matchRatio = matchCount / pattern.matchSymptoms.length;

      if (matchRatio === 0) return null;

      let probability = matchRatio * 75;

      // Age risk adjustments
      if (age > 60) probability += 5;
      if (age > 50 && ["Hypertension", "Type 2 Diabetes"].includes(pattern.disease)) probability += 8;
      if (age < 15 && ["Common Cold", "Dengue Fever"].includes(pattern.disease)) probability += 5;

      // BMI adjustments
      if (bmi && bmi > 30) probability += 3;
      if (bmi && bmi > 35 && ["Type 2 Diabetes", "Hypertension"].includes(pattern.disease)) probability += 8;

      // Vital sign adjustments
      if (temperature > 101) probability += 5;
      if (temperature > 103) probability += 8;
      if (heartRate > 100) probability += 3;
      if (bpSystolic > 140 && pattern.disease === "Hypertension") probability += 10;

      // Severity adjustments
      if (severity === "severe") probability += 8;
      else if (severity === "moderate") probability += 3;

      // Duration adjustments
      if (duration === "2weeks" || duration === "1month") probability += 5;

      // Risk factor adjustments
      if (diabetes && pattern.riskFactors.includes("Diabetes")) probability += 10;
      if (smoking && pattern.riskFactors.includes("Smoking")) probability += 8;

      // Past diseases from medical history
      const pastDiseases = medicalHistory?.pastDiseases || '';
      pattern.riskFactors.forEach(rf => {
        if (pastDiseases.toLowerCase().includes(rf.toLowerCase())) probability += 5;
      });

      probability = Math.min(95, Math.max(5, probability));

      let severityScore = Math.round(pattern.baseSeverity * (probability / 75));
      severityScore = Math.min(100, Math.max(5, severityScore));

      return {
        disease: pattern.disease,
        probability: Math.round(probability),
        severity: severityScore,
        urgency: pattern.urgency,
        specialistType: pattern.specialistType,
        description: pattern.description,
        recommendations: pattern.recommendations,
        matchedSymptoms: pattern.matchSymptoms.filter(s => symptoms.includes(s)),
        totalPatternSymptoms: pattern.matchSymptoms.length
      };
    }).filter(Boolean);

    // Sort by probability descending
    scored.sort((a: any, b: any) => b.probability - a.probability);

    // Take top 5
    const topPredictions = scored.slice(0, 5);

    // Determine overall risk level
    let riskLevel = "Low";
    if (topPredictions.length > 0) {
      const topProb = (topPredictions[0] as any).probability;
      const topUrgency = (topPredictions[0] as any).urgency;
      if (topProb >= 70 || topUrgency === "critical") riskLevel = "Critical";
      else if (topProb >= 50 || topUrgency === "high") riskLevel = "High";
      else if (topProb >= 30 || topUrgency === "medium") riskLevel = "Medium";
    }

    // Adjust risk for severity
    if (severity === "severe" && riskLevel === "Low") riskLevel = "Medium";
    if (severity === "severe" && riskLevel === "Medium") riskLevel = "High";

    // Calculate overall severity score
    let overallSeverity = symptoms.length * 8;
    if (severity === "severe") overallSeverity += 30;
    else if (severity === "moderate") overallSeverity += 15;
    if (temperature > 101) overallSeverity += 10;
    if (duration === "2weeks" || duration === "1month") overallSeverity += 10;
    overallSeverity = Math.min(100, Math.max(10, overallSeverity));

    // Generate general recommendations
    const generalRecs: string[] = [];
    if (riskLevel === "High" || riskLevel === "Critical") {
      generalRecs.push("⚠️ Please consult a doctor as soon as possible.");
      generalRecs.push("Monitor your vitals closely and keep a symptom diary.");
    } else if (riskLevel === "Medium") {
      generalRecs.push("Consider scheduling a doctor appointment within 24-48 hours.");
      generalRecs.push("Monitor symptoms and seek help if they worsen.");
    } else {
      generalRecs.push("Monitor symptoms for 2-3 days. Consult a doctor if they persist.");
    }
    generalRecs.push("Stay hydrated and get adequate rest.");
    if (symptoms.includes("Fever")) generalRecs.push("Take paracetamol if fever exceeds 100°F.");
    if (symptoms.includes("Cough")) generalRecs.push("Try warm honey-lemon water and avoid cold drinks.");

    // Also try the Python ML microservice for additional predictions
    let mlPredictions: any[] = [];
    try {
      const mlResponse = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
        signal: AbortSignal.timeout(3000)
      });
      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        mlPredictions = mlData.predictions || [];
      }
    } catch {
      // ML service unavailable — continue with rule-based predictions
    }

    const result = {
      predictions: topPredictions,
      mlPredictions,
      riskLevel,
      severityScore: overallSeverity,
      healthMetrics: {
        bmi: bmi ? {
          value: bmi,
          label: bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese",
          status: bmi >= 18.5 && bmi < 25 ? "healthy" : "attention"
        } : null,
        bodyFat: bodyFat ? {
          value: bodyFat,
          label: bodyFat < 20 ? "Healthy" : bodyFat < 30 ? "Average" : "High",
          status: bodyFat < 25 ? "healthy" : "attention"
        } : null,
        healthIndex: {
          value: healthIndex,
          label: healthIndex >= 80 ? "Good" : healthIndex >= 60 ? "Fair" : "Needs Attention",
          status: healthIndex >= 70 ? "healthy" : "attention"
        }
      },
      generalRecommendations: generalRecs,
      analyzedSymptoms: symptoms,
      timestamp: new Date().toISOString(),
      source: "backend"
    };

    return res.json(result);
  } catch (error) {
    console.error('Symptom Check Error:', error);
    return res.status(500).json({ error: 'Internal server error during symptom analysis' });
  }
});

// ─── Get available symptoms list ───
router.get('/symptoms', (_req: Request, res: Response) => {
  const symptoms = DISEASE_PATTERNS.reduce((acc: string[], pattern) => {
    pattern.matchSymptoms.forEach(s => {
      if (!acc.includes(s)) acc.push(s);
    });
    return acc;
  }, []).sort();

  return res.json({ symptoms });
});

export default router;
