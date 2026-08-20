import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function DoctorSchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Doctor Schedule</h1>
      
      <Card 
        title="Clinic Shifts & Hours Log" 
        subtitle="Manage Physician Calendars"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Check shifts, update calendar availability, track leaves, and coordinate rotation schedules for clinic doctors.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              View Rosters
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
