/**
 * Auth Service – Complete Authentication Engine API Client:
 * Register, Login, Google OAuth, Refresh, Forgot Password, Reset Password, Change Password, Verify Email
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
   * Real Google OAuth Login:
   * Supports ID token from Google GIS or userInfo object from Google UserInfo endpoint.
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

  /**
   * Real Microsoft OAuth Login:
   * Supports Access token from Microsoft OAuth or userInfo object.
   */
  async loginWithMicrosoft(accessToken, userInfo = null) {
    const payload = accessToken
      ? { access_token: accessToken }
      : {
          email: userInfo.email,
          name: userInfo.name || 'Microsoft User',
          picture: userInfo.picture || '',
          microsoft_id: userInfo.microsoft_id || userInfo.sub || '',
        };
    const { data } = await api.post("/auth/microsoft", payload);
    authService._saveSession(data);
    return data;
  },

  async getGoogleAuthUrl() {
    const { data } = await api.get("/auth/google/url");
    return data;
  },

  async getMicrosoftAuthUrl() {
    const { data } = await api.get("/auth/microsoft/url");
    return data;
  },

  setSessionTokens(accessToken, refreshToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },

  async forgotPassword(email) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(token, newPassword) {
    const { data } = await api.post("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
    return data;
  },

  async changePassword(oldPassword, newPassword) {
    const { data } = await api.post("/auth/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return data;
  },

  async verifyEmail(token) {
    const { data } = await api.post("/auth/verify-email", { token });
    return data;
  },

  async getMe() {
    const { data } = await api.get("/auth/me");
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  logout() {
    api.post("/auth/logout").catch(() => {});
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

export default authService;
