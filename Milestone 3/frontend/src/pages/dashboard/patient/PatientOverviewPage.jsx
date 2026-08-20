import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function PatientOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Patient Overview</h1>
      
      <Card 
        title="Personal Care Summary" 
        subtitle="AI Medical Symptom Analysis & Predictions"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Welcome to your patient dashboard. Use the symptom checker to consult with the AI engine, view clinical predictions, and review personal diagnostic reports.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              View My Reports
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
