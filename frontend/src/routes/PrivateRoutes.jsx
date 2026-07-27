import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageLoader from '../components/common/Loader';

export const PrivateRoutes = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Verifying security credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoutes;
