import client from './client';

/**
 * POST /predict
 * Body: { symptoms: string[] }
 * Returns: PredictionResponse {
 *   predicted_disease, confidence, risk_level, severity_level,
 *   severity_score, emergency, recommendation, health_risk_report
 * }
 */
function getUserKey() {
  const currentUserRaw = localStorage.getItem('medassist_user');
  if (!currentUserRaw) return null;
  try {
    const user = JSON.parse(currentUserRaw);
    return user?.id ? `medassist_pred_user_${user.id}` : `medassist_pred_user_${user.email}`;
  } catch {
    return null;
  }
}

/**
 * POST /predict
 * Body: { symptoms: string[] }
 * Returns: PredictionResponse
 */
export async function runPrediction(symptoms) {
  const response = await client.post('/predict', { symptoms });
  const key = getUserKey();
  if (key) {
    sessionStorage.setItem(key, JSON.stringify(response.data));
  } else {
    sessionStorage.setItem('medassist_last_prediction', JSON.stringify(response.data));
  }
  return response.data;
}

/**
 * Retrieve the last cached prediction result for the current authenticated user.
 */
export function getLastPrediction() {
  const key = getUserKey();
  if (key) {
    const raw = sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  }
  // Fallback to legacy key only if current user created it
  const fallback = sessionStorage.getItem('medassist_last_prediction');
  return fallback ? JSON.parse(fallback) : null;
}
