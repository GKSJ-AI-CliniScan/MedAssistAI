import client from './client';

/**
 * GET /analytics/summary
 * Returns: system-wide analytics summary (admin/doctor only)
 */
export async function getAnalyticsSummary() {
  const response = await client.get('/analytics/summary');
  return response.data;
}

/**
 * GET /analytics/diseases
 * Returns: top predicted diseases distribution
 */
export async function getDiseaseDistribution() {
  const response = await client.get('/analytics/diseases');
  return response.data;
}
