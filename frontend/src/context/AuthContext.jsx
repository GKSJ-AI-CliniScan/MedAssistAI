import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const isAuth = authService.isAuthenticated();
        const userData = authService.getUser();
        if (isAuth && userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Clean up if mismatched
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

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      // response is { access_token, refresh_token, token_type, user }
      setUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (email, name) => {
    setLoading(true);
    try {
      const response = await authService.loginWithGoogle(email, name);
      setUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await authService.register(name, email, password);
      setUser(response.user);
      setIsAuthenticated(true);
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
    // Return mock success for demo/forgot password
    return { success: true, message: "Password reset link sent to your email." };
  };

  const resetPassword = async (token, newPassword) => {
    return { success: true, message: "Password reset successfully." };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      forgotPassword,
      resetPassword
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
