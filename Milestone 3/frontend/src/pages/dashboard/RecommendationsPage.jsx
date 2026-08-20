import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getLastPrediction } from '../../services/api/predictions';

export default function RecommendationsPage() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setResult(getLastPrediction());
  }, []);

  if (!result) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Recommendations</h1>
        <Card title="No Data Available" subtitle="Run the Symptom Checker first.">
          <div className="py-4">
            <p className="text-slate-500 mb-4">Run a diagnostic first to see your recommendations.</p>
            <Button variant="primary" onClick={() => navigate('/dashboard/symptoms')}>
              Go to Symptom Checker
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const primaryRecommendation = result.recommendation || 'Schedule a consultation with a healthcare professional within the next few days.';

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recommendations</h1>
        <p className="text-sm text-slate-500 mt-1">What should I do next?</p>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Recommended Next Steps */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Recommended Next Steps
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>{primaryRecommendation}</span>
              </li>
            </ul>
          </div>

          <hr className="border-slate-200" />

          {/* Things to Monitor */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Things to Monitor
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Monitor whether symptoms become more frequent or severe.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Keep note of any new symptoms that develop.</span>
              </li>
            </ul>
          </div>

          <hr className="border-slate-200" />

          {/* Self-Care */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Self-Care
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Stay hydrated.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Get sufficient rest.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Follow any existing treatment advised by your physician.</span>
              </li>
            </ul>
          </div>

          <hr className="border-slate-200" />

          {/* Seek Medical Care Immediately If */}
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
              Seek Medical Care Immediately If
            </p>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <ul className="space-y-2 text-sm text-red-900">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>You experience difficulty breathing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Severe chest pain develops.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Symptoms worsen rapidly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>You develop any emergency warning signs.</span>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="primary" onClick={() => navigate('/dashboard/risk')}>
              View Risk Assessment
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/prediction')}>
              View Prediction
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard/reports')}>
              My Reports
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
