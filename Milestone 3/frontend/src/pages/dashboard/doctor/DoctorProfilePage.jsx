import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function DoctorProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Doctor Profile</h1>
      
      <Card 
        title="Clinical Profile & Verification Settings" 
        subtitle="Professional Profile Details"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Manage your personal profile information, contact numbers, department allocations, and clinic availability hours.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
