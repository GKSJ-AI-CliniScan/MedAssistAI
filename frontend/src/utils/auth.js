/**
 * Local auth helpers.
 * Stores JWT + user profile in localStorage. No mock/fake auth — these
 * helpers only read/write what the real FastAPI backend returns on login.
 */

const TOKEN_KEY = 'medassist_token';
const USER_KEY = 'medassist_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  clearAuth();
  window.location.href = '/login';
}
