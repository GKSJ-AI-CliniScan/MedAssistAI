import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function ManageAppointmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Appointments</h1>
      
      <Card 
        title="System Scheduling & Booking Overview" 
        subtitle="Global Appointments Calendar"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Monitor clinic booking volumes, track doctor schedules, and override appointment states if necessary.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              View Calendar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
