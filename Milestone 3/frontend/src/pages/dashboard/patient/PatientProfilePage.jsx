import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function PatientProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Patient Profile</h1>
      
      <Card 
        title="Personal Medical Info & Contact Details" 
        subtitle="Medical Demographic Form"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Keep your weight index, allergy list, blood type, contact numbers, and emergency contact details updated.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Edit Profile Info
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
