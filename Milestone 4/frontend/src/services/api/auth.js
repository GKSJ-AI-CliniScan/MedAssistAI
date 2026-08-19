import client from './client';

export async function loginUser(email, password, role) {
  const response = await client.post('/auth/login', { email, password, role });
  return response.data;
}

export async function registerUser(fullname, email, password) {
  const response = await client.post('/auth/register', { fullname, email, password, role: 'patient' });
  return response.data;
}

export async function changePassword(currentPassword, newPassword) {
  const response = await client.post('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
}

export async function updateAccountProfile(data) {
  const response = await client.put('/auth/profile', data);
  return response.data;
}

export async function logoutUser() {
  return Promise.resolve();
}
