import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function PatientRegistrationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Patient Registration</h1>
      
      <Card 
        title="Onboard New Clinical Patients" 
        subtitle="Patient Profiles Intake"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Create new patient files, record primary diagnostic details, compile intake forms, and store physician allocations.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Register Patient
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
