import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function SymptomCheckerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Symptom Checker</h1>
      
      <Card 
        title="Symptom Checkup Engine" 
        subtitle="Record and identify user health concerns"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            This page will host the interactive symptom checklist and query engine to capture patient indications.
          </p>
          {/* TODO: Connect backend API */}
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Run Diagnostic
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
