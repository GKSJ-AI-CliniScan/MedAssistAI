import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageLoader from '../components/common/Loader';
import { toast } from 'react-toastify';

export const PrivateRoutes = ({ children, allowedRole }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  const isDoctor = user?.role === 'doctor';
  const path = location.pathname;

  // Check role conflicts
  const isDoctorOnlyRoute = path.startsWith('/doctor-');
  const isPatientOnlyRoute = path.startsWith('/patient-') || path === '/my-appointments';

  if (loading) {
    return <PageLoader message="Verifying security credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // Doctor trying to access Patient routes
  if (isDoctor && isPatientOnlyRoute) {
    toast.error('Access Denied: Doctor accounts cannot access patient-only portals.', { icon: '🚫' });
    return <Navigate to="/doctor-dashboard" replace />;
  }

  // Patient trying to access Doctor routes
  if (!isDoctor && isDoctorOnlyRoute) {
    toast.error('Access Denied: Patient accounts cannot access doctor clinical portals.', { icon: '🚫' });
    return <Navigate to="/patient-dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoutes;
