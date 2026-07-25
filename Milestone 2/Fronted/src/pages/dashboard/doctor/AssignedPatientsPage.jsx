import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function AssignedPatientsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Assigned Patients</h1>
      
      <Card 
        title="My Active Case Directory" 
        subtitle="Patient Profiles & Records"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            View detailed medical files, diagnostic history, and check results for all patients assigned under your care.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Search Patient
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
