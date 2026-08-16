import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        const userData = authService.getUser();
        if (isAuth && userData) {
          setUser(userData);
          setIsAuthenticated(true);
          // Sync fresh profile from server in background (skip for demo sessions)
          if (!authService.isDemoSession()) {
            authService.getMe().then((freshUser) => setUser(freshUser)).catch(() => {});
          }
        } else {
          localStorage.removeItem('medassist_access_token');
          localStorage.removeItem('medassist_refresh_token');
          localStorage.removeItem('medassist_user');
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password, roleHint = null) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password, roleHint);
      setUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken, userInfo = null) => {
    setLoading(true);
    try {
      const response = await authService.loginWithGoogle(idToken, userInfo);
      setUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithMicrosoft = async (accessToken, userInfo = null) => {
    setLoading(true);
    try {
      const response = await authService.loginWithMicrosoft(accessToken, userInfo);
      setUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'patient') => {
    setLoading(true);
    try {
      const response = await authService.register(name, email, password, role);
      // Registration successful — clear active session so user logs in explicitly via login page
      authService.clearSession();
      setUser(null);
      setIsAuthenticated(false);
      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (token, newPassword) => {
    return await authService.resetPassword(token, newPassword);
  };

  const changePassword = async (oldPassword, newPassword) => {
    return await authService.changePassword(oldPassword, newPassword);
  };

  const verifyEmail = async (token) => {
    return await authService.verifyEmail(token);
  };

  const refreshUserData = async () => {
    try {
      const fresh = await authService.getMe();
      setUser(fresh);
      return fresh;
    } catch (e) {
      console.error("Failed to refresh user profile data:", e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      loginWithGoogle,
      loginWithMicrosoft,
      register,
      logout,
      forgotPassword,
      resetPassword,
      changePassword,
      verifyEmail,
      refreshUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
