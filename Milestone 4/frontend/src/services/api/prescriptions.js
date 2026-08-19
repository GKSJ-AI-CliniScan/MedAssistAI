import client from './client';

export async function createPrescription(prescriptionData) {
  const response = await client.post('/prescriptions', prescriptionData);
  return response.data;
}

export async function getPatientPrescriptions(patientId) {
  const response = await client.get(`/prescriptions/patient/${patientId}`);
  return response.data;
}

export async function getMyPrescriptions() {
  const response = await client.get('/prescriptions/my');
  return response.data;
}

export async function updatePrescription(id, updateData) {
  const response = await client.put(`/prescriptions/${id}`, updateData);
  return response.data;
}
