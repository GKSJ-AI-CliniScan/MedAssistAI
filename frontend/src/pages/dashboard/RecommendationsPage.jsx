import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to role-specific recommendations page
    if (user?.role === 'patient') {
      navigate('/patient/recommendations', { replace: true });
    } else if (user?.role === 'doctor') {
      navigate('/doctor', { replace: true });
    } else if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-clinical-mutedLight dark:text-clinical-mutedDark">Redirecting to recommendations page...</div>
    </div>
  );
}
