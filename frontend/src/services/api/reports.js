import client from './client';

export async function getMyReports() {
  const response = await client.get('/reports/my');
  return response.data;
}

export async function getReportById(id) {
  const response = await client.get(`/reports/${id}`);
  return response.data;
}

export async function getPatientReports(patientId) {
  const response = await client.get(`/reports/patient/${patientId}`);
  return response.data;
}

export async function updateReportNotes(id, notes) {
  const response = await client.put(`/reports/${id}/notes`, notes);
  return response.data;
}

export async function downloadReport(id) {
  const response = await client.get(`/reports/${id}/download`, {
    responseType: 'blob'
  });
  return response.data;
}
