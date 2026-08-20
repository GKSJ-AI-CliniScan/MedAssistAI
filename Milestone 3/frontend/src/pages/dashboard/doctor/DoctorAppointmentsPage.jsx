import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function DoctorAppointmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Doctor Appointments</h1>
      
      <Card 
        title="My Schedule & Appointments List" 
        subtitle="Today's Consultation Schedule"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Review your daily schedule, verify patient booking details, and log consultation notes.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              View Daily Roster
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
