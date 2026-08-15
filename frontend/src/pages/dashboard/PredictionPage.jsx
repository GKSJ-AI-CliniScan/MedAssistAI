import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PredictionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to role-specific prediction page
    if (user?.role === 'patient') {
      navigate('/patient/prediction', { replace: true });
    } else if (user?.role === 'doctor') {
      navigate('/doctor/reports', { replace: true });
    } else if (user?.role === 'admin') {
      navigate('/admin/reports', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-clinical-mutedLight dark:text-clinical-mutedDark">Redirecting to prediction page...</div>
    </div>
  );
}
