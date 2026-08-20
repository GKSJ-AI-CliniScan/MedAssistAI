import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser as apiLogout, getMe } from '../services/api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists, restore the user session via GET /auth/me
  useEffect(() => {
    const token = localStorage.getItem('medassist_token');
    if (token) {
      getMe()
        .then((userData) => setUser(userData))
        .catch(() => {
          // Token is invalid or expired — clear it
          localStorage.removeItem('medassist_token');
          localStorage.removeItem('medassist_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    sessionStorage.clear();
    const data = await loginUser(email, password);
    localStorage.setItem('medassist_token', data.access_token);
    localStorage.setItem('medassist_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (fullname, email, password, role = 'patient') => {
    sessionStorage.clear();
    const data = await registerUser(fullname, email, password, role);
    localStorage.setItem('medassist_token', data.access_token);
    localStorage.setItem('medassist_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    sessionStorage.clear();
    apiLogout();
    setUser(null);
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
