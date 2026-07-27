import { useState } from 'react';
import { useUser } from '../context/UserContext';
import predictionService from '../services/predictionService';
import riskService from '../services/riskService';
import recommendationService from '../services/recommendationService';

export const usePrediction = () => {
  const { profile, symptomSession, updateSymptomSession, addNotification } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSymptoms = async (selectedSymptoms, severity, duration, notes) => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Run prediction matches
      const predictions = await predictionService.predictDisease(
        selectedSymptoms.map(s => s.name),
        severity,
        duration,
        notes
      );

      // Step 2: Run risk assessment
      const riskAssessment = await riskService.calculateRisk(
        selectedSymptoms.map(s => s.name),
        severity,
        duration,
        profile
      );

      // Step 3: Run recommendation logic
      const recommendations = await recommendationService.getRecommendations(predictions);

      // Step 4: Update session state in Context
      updateSymptomSession({
        selectedSymptoms,
        severity,
        duration,
        notes,
        predictionResult: predictions,
        riskResult: riskAssessment,
        recommendations: recommendations
      });

      // Step 5: Send notification triggers if risk is high
      if (riskAssessment.riskLevel === 'High') {
        addNotification(
          'High Risk Detected',
          `Analysis flagged a high risk level for ${predictions[0]?.name || 'a condition'}. Please consult a physician.`,
          'error'
        );
      } else {
        addNotification(
          'Analysis Completed',
          'Symptom assessment and disease predictions updated successfully.',
          'success'
        );
      }

      return {
        predictions,
        riskAssessment,
        recommendations
      };
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeSymptoms,
    symptomSession,
    loading,
    error
  };
};

export default usePrediction;
