import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Recommendations</h1>
      
      <Card 
        title="Patient Recovery Recommendations" 
        subtitle="AI Recommendations Engine"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            This page will list specific recovery recommendations, dietary guides, and clinical advisories.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Generate Guide
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
