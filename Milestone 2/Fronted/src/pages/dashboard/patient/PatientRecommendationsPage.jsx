import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function PatientRecommendationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Recommendations</h1>
      
      <Card 
        title="AI Preventive Health & Wellness Care Tips" 
        subtitle="Clinical Guidance and Lifestyle Tips"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Receive personalized preventive health guides, dietary suggestions, and expert wellness counseling.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Get Recommendations
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
