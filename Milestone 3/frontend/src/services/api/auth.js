import client from './client';

/**
 * POST /auth/login
 * Returns: { access_token, token_type, user, message }
 */
export async function loginUser(email, password) {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
}

/**
 * POST /auth/register
 * Returns: { access_token, token_type, user, message }
 */
export async function registerUser(fullname, email, password, role = 'patient') {
  const response = await client.post('/auth/register', { fullname, email, password, role });
  return response.data;
}

/**
 * GET /auth/me
 * Returns: { id, fullname, email, role, created_at }
 */
export async function getMe() {
  const response = await client.get('/auth/me');
  return response.data;
}

/**
 * Client-side logout — clears stored tokens and cached prediction data.
 */
export function logoutUser() {
  localStorage.removeItem('medassist_token');
  localStorage.removeItem('medassist_user');
  sessionStorage.clear();
}
