import api from './api';

const USE_MOCK = true;

export const riskService = {
  calculateRisk: async (selectedSymptoms, severity, duration, profile) => {
    if (!USE_MOCK) {
      return api.post('/risk/assess', { selectedSymptoms, severity, duration, profile });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple medical heuristic for risk calculation
    let baseScore = 40; // start at a neutral score (higher means higher risk)
    const hasHighSeveritySymptom = selectedSymptoms.some(s => 
      ['Shortness of breath', 'Chest pain', 'Blurred vision', 'High blood pressure'].includes(s)
    );

    // Adjust score based on symptom count
    baseScore += selectedSymptoms.length * 5;

    // Adjust based on severity parameter
    if (severity === 'moderate') baseScore += 15;
    if (severity === 'severe') baseScore += 30;

    // Adjust based on duration
    if (duration > 7) baseScore += 10;
    if (duration > 14) baseScore += 15;

    // Adjust based on lifestyle and age
    if (profile?.age > 50) baseScore += 10;
    if (profile?.lifestyle?.smoking === 'Yes') baseScore += 8;

    // Cap the risk score
    const riskScore = Math.min(Math.max(baseScore, 10), 99);

    let riskLevel = 'Low';
    let severityIndicator = 'emerald';
    let emergencyAlert = false;
    let message = 'Your calculated health risk is within the normal range. Continue monitoring symptoms.';

    if (riskScore > 40 && riskScore <= 70) {
      riskLevel = 'Medium';
      severityIndicator = 'amber';
      message = 'Moderate health risks detected. A consultation with a general physician is recommended in the coming days.';
    } else if (riskScore > 70 || hasHighSeveritySymptom) {
      riskLevel = 'High';
      severityIndicator = 'rose';
      emergencyAlert = hasHighSeveritySymptom;
      message = hasHighSeveritySymptom
        ? 'EMERGENCY WARNING: Critical cardiovascular or respiratory indicators detected. Please seek emergency medical care immediately!'
        : 'High health risks detected. We advise seeking professional medical counseling immediately.';
    }

    // Health Score is the inverse of risk, e.g. 100 - risk
    const healthScore = 100 - Math.round(riskScore * 0.7);

    return {
      riskScore,
      riskLevel,
      healthScore,
      severityIndicator,
      emergencyAlert,
      message,
      evaluatedAt: new Date().toISOString()
    };
  }
};

export default riskService;
