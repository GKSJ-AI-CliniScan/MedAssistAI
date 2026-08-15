import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SymptomCheckerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to role-specific symptom checker
    if (user?.role === 'patient') {
      navigate('/patient/symptoms', { replace: true });
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
      <div className="text-clinical-mutedLight dark:text-clinical-mutedDark">Redirecting to symptom checker...</div>
    </div>
  );
}
