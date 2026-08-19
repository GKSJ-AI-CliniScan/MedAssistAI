import client from './client';

export async function getSymptoms() {
  const response = await client.get('/symptoms?limit=500');
  return response.data;
}

export async function submitSymptoms(symptoms) {
  const response = await client.post('/symptoms', symptoms);
  return response.data;
}
