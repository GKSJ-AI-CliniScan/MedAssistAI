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
    if (isDoctorOnlyRoute) {
      toast.error('Authentication required. Please log in as a Doctor.', { icon: '🔐' });
      return <Navigate to="/doctor-login" replace state={{ from: location }} />;
    }
    if (isPatientOnlyRoute) {
      toast.error('Authentication required. Please log in as a Patient.', { icon: '🏥' });
      return <Navigate to="/patient-login" replace state={{ from: location }} />;
    }
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // Handle generic /dashboard route
  if (path === '/dashboard') {
    return <Navigate to={isDoctor ? "/doctor-dashboard" : "/patient-dashboard"} replace />;
  }

  // Patient trying to access Doctor routes
  if (!isDoctor && isDoctorOnlyRoute) {
    toast.error('Access Denied: Please log in with a Doctor account.', { icon: '🚫' });
    return <Navigate to="/doctor-login" replace />;
  }

  // Doctor trying to access Patient routes
  if (isDoctor && isPatientOnlyRoute) {
    toast.error('Access Denied: Please log in with a Patient account.', { icon: '🚫' });
    return <Navigate to="/patient-login" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoutes;
