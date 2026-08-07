import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function PrescriptionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
      
      <Card 
        title="Medication & Prescription Control" 
        subtitle="Manage Active Prescription Forms"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Issue electronic prescriptions, prescribe medication doses, and review patient pharmacy logs.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Issue Prescription
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
