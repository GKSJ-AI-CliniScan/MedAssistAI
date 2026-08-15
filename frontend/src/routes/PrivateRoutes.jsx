import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageLoader from '../components/common/Loader';
import { toast } from 'react-toastify';

export const PrivateRoutes = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  const storedUser = (() => {
    try {
      const u = localStorage.getItem('medassist_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const effectiveUser = user || storedUser;
  const isDoctor = effectiveUser?.role === 'doctor';
  const path = location.pathname;

  const isDoctorOnlyRoute = path.startsWith('/doctor-');
  const isPatientOnlyRoute = path.startsWith('/patient-') || path === '/my-appointments';

  if (loading) {
    return <PageLoader message="Verifying security credentials..." />;
  }

  if (!isAuthenticated && !storedUser) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // Handle generic /dashboard route
  if (path === '/dashboard') {
    return <Navigate to={isDoctor ? "/doctor-dashboard" : "/patient-dashboard"} replace />;
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
