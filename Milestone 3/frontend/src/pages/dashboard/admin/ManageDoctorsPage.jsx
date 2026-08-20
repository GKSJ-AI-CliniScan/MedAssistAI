import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function ManageDoctorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Doctors</h1>
      
      <Card 
        title="Clinical Staff Directory & Credentials" 
        subtitle="Verification & Records Control"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Verify doctor accounts, assign clinic permissions, and manage verification status of medical credentials.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Add Doctor
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
