import api from './api';

const USE_MOCK = true;

export const recommendationService = {
  getRecommendations: async (predictions) => {
    if (!USE_MOCK) {
      return api.post('/recommendations/generate', { predictions });
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!predictions || predictions.length === 0) {
      return {
        lifestyle: "Maintain a balanced daily routine, avoid high-stress triggers, and practice regular hand-washing.",
        diet: "Eat a nutrient-dense diet consisting of fresh vegetables, lean proteins, and antioxidant-rich fruits.",
        exercise: "Engage in 30 minutes of moderate aerobic activity (e.g., walking, cycling) at least 5 days a week.",
        waterIntake: "Consume 2.5 to 3.0 liters of pure water daily to maintain proper cellular function.",
        sleep: "Aim for 7.5 to 8.5 hours of uninterrupted sleep. Sleep in a dark, cool, and quiet room.",
        followUp: "Schedule routine physical checks once a year.",
        doctor: "General Physician"
      };
    }

    // Merge recommendations from top predictions
    const topPrediction = predictions[0];
    return topPrediction.recommendations || {
      lifestyle: "Rest and recover. Avoid physically exhausting workloads.",
      diet: "Hydrating foods, broths, light meals.",
      exercise: "Cease intense sports or heavy lifting until cleared.",
      waterIntake: "Drink 3 liters of fluids.",
      sleep: "Aim for 8 to 9 hours of sleep.",
      followUp: "Consult your clinician if symptoms persist past 48 hours.",
      doctor: "Primary Care Doctor"
    };
  }
};

export default recommendationService;
