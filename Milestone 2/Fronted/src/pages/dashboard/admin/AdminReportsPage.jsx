import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Administrative Reports</h1>
      
      <Card 
        title="System Reports & Export Archive" 
        subtitle="Clinic Diagnostics and Auditing"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Export patient summary metrics, clinician hours, appointment volumes, and usage statistics.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Export Summary PDF
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
