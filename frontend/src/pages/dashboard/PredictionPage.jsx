import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function PredictionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Prediction</h1>
      
      <Card 
        title="Disease Prediction Results" 
        subtitle="AI Diagnosis Modeling Engine"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            This page will display disease prediction results after backend integration.
          </p>
          {/* TODO: Integrate ML prediction */}
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Compute Predictions
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
