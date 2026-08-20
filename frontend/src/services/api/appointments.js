import client from './client';

export async function createAppointment(appointmentData) {
  const response = await client.post('/appointments', appointmentData);
  return response.data;
}

export async function getMyAppointments(status = null) {
  const response = await client.get('/appointments/my', {
    params: { status: status && status !== 'all' ? status : undefined },
  });
  return response.data;
}

export async function getAllAppointments(skip = 0, limit = 100, status = null) {
  const response = await client.get('/appointments/all', {
    params: { skip, limit, status: status && status !== 'all' ? status : undefined },
  });
  return response.data;
}

export async function getAppointmentDetails(id) {
  const response = await client.get(`/appointments/${id}`);
  return response.data;
}

export async function updateAppointmentStatus(id, statusData) {
  const response = await client.put(`/appointments/${id}/status`, statusData);
  return response.data;
}
