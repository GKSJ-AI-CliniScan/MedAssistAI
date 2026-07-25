import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function StaffReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Staff Reports</h1>
      
      <Card 
        title="Operational Logs & Summary Exports" 
        subtitle="Manage Support Reports"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Export daily check-in quantities, appointment statistics, patient demographics, and staff shift logs.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Export Operational Log
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
