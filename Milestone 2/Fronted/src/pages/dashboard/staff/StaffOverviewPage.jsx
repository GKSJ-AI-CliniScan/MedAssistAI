import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function StaffOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Staff Overview</h1>
      
      <Card 
        title="Administrative Operations Desk" 
        subtitle="Clinic workflow, registrations, and scheduling logs."
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Welcome to the support staff desk. Coordinate patient registration workflows, schedule clinic bookings, log doctor availability slots, and track metrics.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              View Daily Bookings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
