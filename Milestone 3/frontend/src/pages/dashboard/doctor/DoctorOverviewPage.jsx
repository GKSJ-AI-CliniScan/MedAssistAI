import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function DoctorOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Doctor Overview</h1>
      
      <Card 
        title="Clinical Portal Overview" 
        subtitle="Access your assigned patients, schedules, and medical actions."
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Welcome to the clinician panel. Access your queue of patient files, manage appointment schedules, check lab/diagnosis reports, and issue medical prescriptions.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              View Appointments
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
