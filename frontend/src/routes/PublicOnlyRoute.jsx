import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageLoader from '../components/common/Loader';

/**
 * PublicOnlyRoute
 * Wraps auth pages so that:
 * - Unauthenticated users: always allowed through
 * - Authenticated users visiting /auth/login: allowed through (so they can switch accounts)
 * - Authenticated users visiting other auth pages (register, forgot-password, etc.): redirect to dashboard
 */
export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader message="Initializing authentication state..." />;
  }

  // Allow authenticated users to visit the login page (to switch accounts)
  const isLoginPage = location.pathname === '/auth/login' || location.pathname === '/login' || location.pathname === '/signin';

  if (isAuthenticated && !isLoginPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicOnlyRoute;
