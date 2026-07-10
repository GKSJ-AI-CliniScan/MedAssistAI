import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function RiskAssessmentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Risk Assessment</h1>
      
      <Card 
        title="Cardiovascular & General Risk Indicators" 
        subtitle="Patient Risk Assessment Dashboard"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            This page will calculate and present emergency alerts and general patient risk percentages.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Assess Risk Factor
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
