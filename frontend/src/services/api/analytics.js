import client from './client';

export async function getAnalyticsSummary() {
  const response = await client.get('/analytics/summary');
  return response.data;
}

export async function getDiseaseDistribution() {
  const response = await client.get('/analytics/diseases');
  return response.data;
}
