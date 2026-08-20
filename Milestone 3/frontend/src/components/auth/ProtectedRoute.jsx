import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium text-sm">Loading session...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated users to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to their role default landing page
    const defaultLanding = user.role === 'doctor' ? '/dashboard/analytics' : '/dashboard/overview';
    return <Navigate to={defaultLanding} replace />;
  }

  return children;
}
