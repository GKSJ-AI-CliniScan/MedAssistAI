/**
 * Auth Service – Register, Login, Logout, Refresh
 */
import api from "./api";

const TOKEN_KEY = "medassist_access_token";
const REFRESH_KEY = "medassist_refresh_token";
const USER_KEY = "medassist_user";

export const authService = {
  async register(fullName, email, password, role = "patient") {
    const { data } = await api.post("/auth/register", {
      full_name: fullName,
      email,
      password,
      role,
    });
    authService._saveSession(data);
    return data;
  },

  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    authService._saveSession(data);
    return data;
  },

  /**
   * loginWithGoogle supports two flows:
   *  1. idToken (string) — from GSI One Tap: send to backend for server-side verification
   *  2. userInfo (object) — from OAuth2 token fallback: contains email, name, picture, sub
   */
  async loginWithGoogle(idToken, userInfo = null) {
    const payload = idToken
      ? { id_token: idToken }
      : {
          email: userInfo.email,
          name: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim(),
          picture: userInfo.picture || '',
          google_id: userInfo.sub || '',
        };
    const { data } = await api.post("/auth/google", payload);
    authService._saveSession(data);
    return data;
  },


  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "/auth/login";
  },

  _saveSession(data) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_KEY, data.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  },

  getUser() {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
