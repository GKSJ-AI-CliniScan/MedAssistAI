import client from './client';

export async function getPatientProfile() {
  const response = await client.get('/patient/profile');
  // Map backend response to frontend format
  const data = response.data;
  return {
    ...data,
    fullname: data.user?.fullname || data.fullname,
    email: data.user?.email || data.email,
  };
}

export async function updatePatientProfile(profileData) {
  const response = await client.put('/patient/profile', profileData);
  return response.data;
}

export async function getAllPatients(skip = 0, limit = 100, search = '') {
  const response = await client.get('/patient/all', {
    params: { skip, limit, search: search || undefined }
  });
  // Map backend response to frontend format
  return response.data.map(patient => ({
    ...patient,
    fullname: patient.user?.fullname || patient.fullname,
    email: patient.user?.email || patient.email,
  }));
}

export async function getPatientHistory(patientId) {
  const response = await client.get(`/patient/${patientId}/history`);
  return response.data;
}
