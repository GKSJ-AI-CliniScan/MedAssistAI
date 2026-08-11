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
      // Step 1: Run prediction API call
      const data = await predictionService.predictDisease(
        selectedSymptoms,
        severity,
        duration,
        notes
      );

      const predictionsArray = data.predictions || [];
      const riskAssessment = data.risk || null;
      const recommendations = data.recommendation || null;

      // Step 2: Update session state in Context
      updateSymptomSession({
        selectedSymptoms,
        severity,
        duration,
        notes,
        predictionResult: predictionsArray,
        riskResult: riskAssessment,
        recommendations: recommendations
      });

      // Step 3: Send notification triggers if risk is high/critical
      if (riskAssessment?.riskLevel === 'High' || riskAssessment?.riskLevel === 'Critical') {
        addNotification(
          'High Risk Detected',
          `Analysis flagged a high risk level for ${data.top_disease || 'a condition'}. Please consult a physician.`,
          'error'
        );
      } else {
        addNotification(
          'Analysis Completed',
          `Symptom assessment for ${data.top_disease || 'condition'} completed successfully.`,
          'success'
        );
      }

      return {
        predictions: predictionsArray,
        riskAssessment,
        recommendations,
        topDisease: data.top_disease,
        topConfidence: data.top_confidence
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
