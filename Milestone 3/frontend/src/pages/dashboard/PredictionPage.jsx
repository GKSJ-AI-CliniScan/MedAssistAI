import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getLastPrediction } from '../../services/api/predictions';

export default function PredictionPage() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getLastPrediction();
    setResult(data);
  }, []);

  if (!result) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Prediction</h1>
        <Card title="No Prediction Available" subtitle="Run the Symptom Checker first to get a result.">
          <div className="py-4">
            <p className="text-slate-500 mb-4">
              You have not run a diagnostic yet. Please use the Symptom Checker to get a disease prediction.
            </p>
            <Button variant="primary" onClick={() => navigate('/dashboard/symptoms')}>
              Go to Symptom Checker
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const formattedConfidence = result.confidence != null ? `${result.confidence.toFixed(1)}%` : 'N/A';

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Prediction</h1>
        <p className="text-sm text-slate-500 mt-1">What condition might I have?</p>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Predicted Condition */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Predicted Condition
            </p>
            <h2 className="text-2xl font-bold text-teal-800 mb-2">
              {result.predicted_disease}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Based on the symptoms you entered, this is the condition that most closely matches your symptom pattern.
            </p>
          </div>

          <hr className="border-slate-200" />

          {/* Confidence */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Confidence
            </p>
            <div className="text-3xl font-extrabold text-slate-800 mb-2">
              {formattedConfidence}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              This prediction is an estimate based on your symptoms and should not be considered a confirmed diagnosis.
            </p>
          </div>

          <hr className="border-slate-200" />

          {/* Actions: exactly two buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="primary" onClick={() => navigate('/dashboard/risk')}>
              View Risk Assessment
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/recommendations')}>
              View Recommendations
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
