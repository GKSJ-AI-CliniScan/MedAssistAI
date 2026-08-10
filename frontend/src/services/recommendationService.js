import api from './api';

export const recommendationService = {
  getRecommendations: async (predictions) => {
    if (!predictions || predictions.length === 0) {
      return null;
    }
    const topPrediction = predictions[0];
    return topPrediction.recommendation || topPrediction.recommendations || null;
  }
};

export default recommendationService;

