import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function PatientSymptomCheckerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Symptom Checker</h1>
      
      <Card 
        title="AI Clinical Guidance Assistant" 
        subtitle="Symptom Entry & Primary Diagnostic Analysis"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Select your clinical symptoms and get immediate AI-based primary health evaluations and recommendations.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Start Check
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
