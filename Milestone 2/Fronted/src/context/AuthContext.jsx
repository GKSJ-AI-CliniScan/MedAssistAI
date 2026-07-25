import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user session from localStorage if it exists
    const savedUser = localStorage.getItem('medassist_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // TODO: Replace Development Mode with backend authentication API.
  const login = async (email, password, role) => {
    setLoading(true);
    try {
      // Simulating successful login with selected role for Development Mode
      const userData = {
        id: 1,
        name: email ? email.split('@')[0] : 'Development User',
        email: email || 'dev@example.com',
        role: role || 'patient'
      };
      
      setUser(userData);
      localStorage.setItem('medassist_user', JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // TODO: Replace Development Mode with backend authentication API.
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      // In Development Mode, we do not make register API calls.
      throw new Error('Registration functionality will be available after backend integration.');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // TODO: Clear session tokens and auth states
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error on backend:', error);
    } finally {
      localStorage.removeItem('medassist_user');
      localStorage.removeItem('medassist_token');
      setUser(null);
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
