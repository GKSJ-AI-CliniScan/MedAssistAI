import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function PatientHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Patient History</h1>
      
      <Card 
        title="Medical Case History Archive" 
        subtitle="Historical Case Records"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            View patient timelines, clinical summaries, treatment logs, and notes recorded by other medical departments.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Load Archive
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
