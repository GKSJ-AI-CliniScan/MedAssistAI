import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getLastPrediction } from '../../services/api/predictions';

const RISK_BADGES = {
  Low: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Medium: 'bg-amber-100 text-amber-800 border-amber-300',
  High: 'bg-orange-100 text-orange-800 border-orange-300',
  Critical: 'bg-red-100 text-red-800 border-red-300',
};

function getRiskExplanation(level) {
  switch (level) {
    case 'Low':
      return 'Your symptoms appear mild and manageable. Routine self-monitoring is recommended.';
    case 'Medium':
      return 'Your symptoms suggest that medical attention is recommended, but they do not currently indicate an immediate emergency.';
    case 'High':
    case 'Critical':
      return 'Your symptoms indicate an elevated risk. Prompt evaluation by a healthcare professional is strongly recommended.';
    default:
      return 'Your symptoms suggest medical consultation is recommended for proper evaluation.';
  }
}

function getSeverityExplanation(level) {
  switch (level) {
    case 'Low':
    case 'Mild':
      return 'Your symptoms are minor and unlikely to disrupt your daily routine.';
    case 'Moderate':
      return 'Your symptoms may interfere with daily activities but are generally manageable until you are evaluated by a healthcare professional.';
    case 'High':
    case 'Severe':
    case 'Critical':
      return 'Your symptoms are significant and require prompt clinical attention to prevent complications.';
    default:
      return 'Your symptom severity reflects the overall weight of symptoms entered.';
  }
}

export default function RiskAssessmentPage() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setResult(getLastPrediction());
  }, []);

  if (!result) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Risk Assessment</h1>
        <Card title="No Data Available" subtitle="Run the Symptom Checker first.">
          <div className="py-4">
            <p className="text-slate-500 mb-4">Run a diagnostic first to see your risk assessment.</p>
            <Button variant="primary" onClick={() => navigate('/dashboard/symptoms')}>
              Go to Symptom Checker
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const riskLevel = result.risk_level || 'Medium';
  const severityLevel = result.severity_level || 'Moderate';
  const severityScore = result.severity_score || 0;
  const isEmergency = result.emergency || false;

  const riskBadgeClass = RISK_BADGES[riskLevel] || RISK_BADGES.Medium;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Risk Assessment</h1>
        <p className="text-sm text-slate-500 mt-1">How serious is it?</p>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Risk Level */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Risk Level
            </p>
            <div className="mb-2">
              <span className={`inline-block px-3 py-1 text-sm font-bold rounded-md border ${riskBadgeClass}`}>
                {riskLevel}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {getRiskExplanation(riskLevel)}
            </p>
          </div>

          <hr className="border-slate-200" />

          {/* Severity */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Severity
            </p>
            <div className="text-lg font-bold text-slate-800 mb-2">
              {severityLevel} <span className="text-xs font-normal text-slate-500">(Score: {severityScore}/100)</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {getSeverityExplanation(severityLevel)}
            </p>
          </div>

          <hr className="border-slate-200" />

          {/* Emergency Status */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Emergency Status
            </p>
            <div className={`p-4 rounded-lg border ${isEmergency ? 'bg-red-50 border-red-200 text-red-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <p className="text-sm font-medium">
                {isEmergency
                  ? 'Emergency warning signs were detected from the symptoms provided. Please seek immediate medical care.'
                  : 'No emergency warning signs were detected from the symptoms provided.'}
              </p>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="primary" onClick={() => navigate('/dashboard/recommendations')}>
              View Recommendations
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/prediction')}>
              Back to Prediction
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
