import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
      
      <Card 
        title="Diagnostic & Patient Reports" 
        subtitle="Medical Document Archive"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            This page will compile symptom reports and export structured PDF documents.
          </p>
          {/* TODO: Implement report download */}
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Export Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
