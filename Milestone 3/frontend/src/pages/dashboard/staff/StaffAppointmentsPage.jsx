import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function StaffAppointmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Staff Appointments</h1>
      
      <Card 
        title="Clinic Scheduling Queue" 
        subtitle="Review Clinic Schedules"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Book medical consultation slots, update appointment details, and dispatch visits to doctors.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Schedule Appointment
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
