import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function PatientReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Health Reports</h1>
      
      <Card 
        title="My Diagnostics & Lab Documents" 
        subtitle="Medical Document Archive"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            View clinical summaries, laboratory results, consultation records, and export medical PDF history.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Download Report PDF
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
