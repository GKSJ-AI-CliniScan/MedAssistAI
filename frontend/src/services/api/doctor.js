import client from './client';

export async function getDoctorProfile() {
  const response = await client.get('/doctor/profile');
  // Map backend response to frontend format
  const data = response.data;
  return {
    ...data,
    fullname: data.user?.fullname || data.fullname,
    email: data.user?.email || data.email,
  };
}

export async function updateDoctorProfile(profileData) {
  const response = await client.put('/doctor/profile', profileData);
  return response.data;
}

export async function getAllDoctors(availableOnly = false, skip = 0, limit = 100, search = '') {
  const response = await client.get('/doctor/all', {
    params: { available_only: availableOnly, skip, limit, search: search || undefined }
  });
  // Map backend response to frontend format
  return response.data.map(doctor => ({
    ...doctor,
    fullname: doctor.user?.fullname || doctor.fullname,
    email: doctor.user?.email || doctor.email,
  }));
}

export async function createDoctor(doctorData) {
  const response = await client.post('/doctor', doctorData);
  return response.data;
}
