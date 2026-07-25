import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function ManagePatientsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Patients</h1>
      
      <Card 
        title="Patient Directory & Records Control" 
        subtitle="Global Patient Accounts"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            View system-wide patient directories, manage medical record access permissions, and audit logs.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              View Patient List
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
