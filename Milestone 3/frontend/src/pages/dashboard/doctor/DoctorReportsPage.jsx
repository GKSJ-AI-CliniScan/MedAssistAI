import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function DoctorReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Medical Reports</h1>
      
      <Card 
        title="Clinical & Diagnosis Documents" 
        subtitle="Medical Document Archive"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Write lab diagnostic outcomes, generate patient summaries, and finalize clinical documents.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Create New Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
