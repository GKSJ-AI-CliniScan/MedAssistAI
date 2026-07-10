import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
      
      <Card 
        title="Welcome to MedAssist AI" 
        subtitle="AI Medical Symptom Analysis & Disease Prediction System"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            This dashboard serves as the central hub for patient symptom checking, disease prediction insights, risk assessment, and clinical analytics. Navigate through the sidebar menu to access specific systems.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              View System Status
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
