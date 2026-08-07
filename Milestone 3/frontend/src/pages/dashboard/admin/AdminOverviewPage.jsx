import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
      
      <Card 
        title="Admin Control Center" 
        subtitle="Manage clinic infrastructure, users, schedules, and analytics."
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Welcome to the MedAssist AI administration hub. From here you can manage registered medical staff, check system diagnostics, review clinical statistics, and adjust security preferences.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              View System Status
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
