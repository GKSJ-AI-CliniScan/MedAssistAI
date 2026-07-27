import api from './api';
import diseasesData from '../data/diseases.json';

const USE_MOCK = true;

export const predictionService = {
  predictDisease: async (symptomsList, generalSeverity, durationDays, additionalNotes) => {
    if (!USE_MOCK) {
      return api.post('/predictions/analyze', {
        symptoms: symptomsList,
        severity: generalSeverity,
        duration: durationDays,
        notes: additionalNotes
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple matching algorithm
    const predictions = diseasesData.map(disease => {
      // Find matches (case-insensitive)
      const matchedSymptoms = disease.symptoms.filter(diseaseSymptom =>
        symptomsList.some(userSymptom => 
          userSymptom.toLowerCase().includes(diseaseSymptom.toLowerCase()) ||
          diseaseSymptom.toLowerCase().includes(userSymptom.toLowerCase())
        )
      );

      const matchRatio = matchedSymptoms.length / disease.symptoms.length;
      
      // Calculate confidence score (scale of 0 to 100)
      let confidence = Math.round(matchRatio * 85); // max 85% on pure symptom match
      
      // Boost confidence slightly for severe symptoms or longer duration if they match
      if (confidence > 0) {
        if (generalSeverity === 'severe') confidence += 10;
        if (durationDays > 5) confidence += 5;
        confidence = Math.min(confidence, 98); // cap mock prediction at 98%
      }

      return {
        ...disease,
        confidence,
        matchedSymptoms,
        probability: `${confidence}%`
      };
    });

    // Filter out diseases with 0 confidence and sort by confidence descending
    const filteredPredictions = predictions
      .filter(p => p.confidence > 0)
      .sort((a, b) => b.confidence - a.confidence);

    // If no specific match, provide a general viral or fatigue diagnosis
    if (filteredPredictions.length === 0) {
      return [
        {
          id: 'd_general',
          name: 'Undetermined Viral Syndrome',
          riskLevel: 'Low',
          description: 'Symptom pattern is non-specific. This is typical of early-stage mild viral infections or general exhaustion.',
          confidence: 60,
          probability: '60%',
          symptoms: ['Fatigue', 'Headache'],
          matchedSymptoms: symptomsList,
          causes: ['Physical stress', 'Viral exposure', 'Lack of adequate rest'],
          complications: ['Persistent fatigue', 'Dehydration'],
          recommendations: {
            lifestyle: 'Ensure full bed rest, avoid intense physical activities.',
            diet: 'Light, nutrient-dense foods. Steamed vegetables and chicken broth.',
            exercise: 'Strict rest for 48 hours.',
            waterIntake: 'Drink at least 2.5 liters of clean water or herbal infusion.',
            sleep: 'Aim for 8 to 9 hours of quality sleep.',
            followUp: 'Monitor temperature and consult a primary care clinician if symptoms change.',
            doctor: 'General Practitioner'
          }
        }
      ];
    }

    return filteredPredictions;
  }
};

export default predictionService;
