import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
      
      <Card 
        title="Symptom Analytics & Trends" 
        subtitle="Statistical Clinical Curves"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            This page will analyze statistical curves, symptom occurrences, and prediction accuracies.
          </p>
          {/* TODO: Fetch analytics data */}
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Load Analytics
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
