import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function PatientRiskAssessmentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Risk Assessment</h1>
      
      <Card 
        title="Personal Health Risk Evaluation" 
        subtitle="AI Clinical Risk Evaluations"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Assess clinical risk profiles for cardiovascular, metabolic, and autoimmune health indexes.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Evaluate Risks
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
