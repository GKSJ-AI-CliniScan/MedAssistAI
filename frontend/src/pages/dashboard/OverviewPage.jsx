import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ModTag from '../../components/ui/ModTag';
import { Activity, Brain, ShieldAlert, Sparkles, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OverviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSystemStatus = () => {
    // Redirect to role-specific analytics or overview
    if (user?.role === 'admin') {
      navigate('/admin/analytics');
    } else if (user?.role === 'doctor') {
      navigate('/doctor');
    } else {
      navigate('/patient');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Overview
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Central hub for symptom analysis, diagnostic prediction & clinical risk engine
          </p>
        </div>
        <ModTag variant="ai">Clinical Aurora System</ModTag>
      </div>
      
      <Card 
        title="Welcome to MedAssist AI" 
        subtitle="AI Medical Symptom Analysis & Disease Prediction System"
        variant="ai"
      >
        <div className="space-y-4">
          <p className="text-sm text-clinical-textLight dark:text-clinical-textDark leading-relaxed">
            This dashboard serves as the central hub for patient symptom checking, disease prediction insights, risk assessment, and clinical analytics. Navigate through the sidebar menu to access specific systems.
          </p>
          <div>
            <Button variant="primary" onClick={handleSystemStatus} className="gap-2">
              <HeartPulse className="w-4 h-4" />
              <span>View System Status</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
