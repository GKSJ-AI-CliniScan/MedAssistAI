import client from './client';

export async function runPredictionModel(symptoms) {
  const response = await client.post('/predict', symptoms);
  return response.data;
}
