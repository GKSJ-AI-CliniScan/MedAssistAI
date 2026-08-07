import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Simple state for demonstration without complex authentication logic
  const [user, setUser] = useState({ email: 'doctor@medassist.ai', role: 'patient' });
  const [loading] = useState(false);

  // TODO: Implement actual login communication with backend API
  const login = async (email, password) => {
    setUser({ email, role: 'patient' });
    return { email, role: 'patient' };
  };

  // TODO: Implement actual registration communication with backend API
  const register = async (name, email, password) => {
    setUser({ email, role: 'patient' });
    return { email, role: 'patient' };
  };

  // TODO: Clear session tokens and auth states
  const logout = () => {
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
