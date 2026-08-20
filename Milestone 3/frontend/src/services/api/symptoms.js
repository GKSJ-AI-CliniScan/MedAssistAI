import client from './client';

/**
 * GET /symptoms
 * Returns: Array of { id, name, description, category, severity_weight, created_at }
 */
export async function getSymptoms() {
  const response = await client.get('/symptoms');
  return response.data;
}

/**
 * POST /symptoms  (admin only)
 */
export async function addSymptom(data) {
  const response = await client.post('/symptoms', data);
  return response.data;
}
