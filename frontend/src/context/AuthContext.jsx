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

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const response = await loginUser(email, password, role);
      
      // Store token
      localStorage.setItem('medassist_token', response.access_token);
      
      // Map backend response to frontend user structure
      const userData = {
        id: response.user.id,
        name: response.user.fullname,
        email: response.user.email,
        role: response.user.role
      };
      
      setUser(userData);
      localStorage.setItem('medassist_user', JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      // Re-throw error for component-level handling
      throw error;
    }
  };

  const register = async (fullname, email, password) => {
    setLoading(true);
    try {
      const response = await registerUser(fullname, email, password);
      
      // Registration should NOT automatically log in the user
      // Just return success without setting user session
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

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
