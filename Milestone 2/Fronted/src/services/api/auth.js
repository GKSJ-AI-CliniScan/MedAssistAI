import client from './client';

// TODO: Integrate backend authentication API
export async function loginUser(email, password) {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
}

// TODO: Integrate backend authentication API
export async function registerUser(name, email, password) {
  const response = await client.post('/auth/register', { name, email, password });
  return response.data;
}

// TODO: Integrate backend authentication API
export async function logoutUser() {
  const response = await client.post('/auth/logout');
  return response.data;
}

