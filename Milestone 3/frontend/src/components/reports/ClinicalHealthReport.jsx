import React from 'react';

/**
 * Patient-friendly 1-2 sentence description of the predicted condition
 */
function getConditionDescription(diseaseName) {
  if (!diseaseName) return 'A clinical health indication identified based on your reported symptoms.';
  return `Indications aligned with ${diseaseName} were identified based on your symptom pattern. Clinical evaluation helps confirm findings and determine an appropriate treatment plan.`;
}

/**
 * Risk level badge colors and patient-friendly implication sentence
 */
const RISK_CONFIG = {
  Low: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    implication: 'Standard risk tier. Symptoms suggest mild presentation requiring routine monitoring.',
  },
  Medium: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    implication: 'Moderate risk tier. Consultation with a primary care physician is recommended.',
  },
  High: {
    badge: 'bg-orange-50 text-orange-800 border-orange-200',
    implication: 'Elevated risk tier. Prompt clinical evaluation by a medical professional is advised.',
  },
  Critical: {
    badge: 'bg-red-50 text-red-800 border-red-200',
    implication: 'Critical risk tier. Immediate medical evaluation by a healthcare provider is strongly advised.',
  },
};

export default function ClinicalHealthReport({ result }) {
  if (!result) return null;

  const {
    predicted_disease,
    confidence,
    risk_level = 'Medium',
    severity_level = 'Moderate',
    severity_score = 0,
    emergency = false,
  } = result;

  const riskInfo = RISK_CONFIG[risk_level] || RISK_CONFIG.Medium;
  const formattedConfidence = confidence != null ? `${confidence.toFixed(1)}%` : 'N/A';

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden text-slate-800">
      {/* Report Header Bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold tracking-wide uppercase text-slate-100">
            Clinical Health Assessment Report
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">MedAssist AI Clinical Portal</p>
        </div>
        <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded border border-slate-700 self-start sm:self-auto">
          Status: Assessment Complete
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* SECTION 1: Health Assessment */}
        <section className="space-y-3">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Health Assessment
            </h3>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Predicted Condition
            </p>
            <h4 className="text-2xl font-bold text-slate-900 mt-1 mb-2">
              {predicted_disease}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {getConditionDescription(predicted_disease)}
            </p>
          </div>
        </section>

        {/* SECTION 2: Assessment Summary */}
        <section className="space-y-3">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assessment Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confidence */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-500 uppercase">Confidence</span>
                <span className="text-lg font-bold text-teal-700">{formattedConfidence}</span>
              </div>
              <p className="text-xs text-slate-600">
                Represents the statistical alignment between your submitted symptoms and reference clinical datasets.
              </p>
            </div>

            {/* Risk Level */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-500 uppercase">Risk Level</span>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${riskInfo.badge}`}>
                  {risk_level}
                </span>
              </div>
              <p className="text-xs text-slate-600">{riskInfo.implication}</p>
            </div>

            {/* Symptom Severity */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-500 uppercase">Symptom Severity</span>
                <span className="text-sm font-bold text-slate-800">
                  {severity_level} <span className="text-xs font-normal text-slate-500">(Score: {severity_score})</span>
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Measures overall symptom intensity and potential systemic burden based on reported indications.
              </p>
            </div>

            {/* Emergency Status */}
            <div className={`border rounded-lg p-4 ${emergency ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-500 uppercase">Emergency Status</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${emergency ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'}`}>
                  {emergency ? 'Attention Required' : 'No Emergency Flags'}
                </span>
              </div>
              <p className={`text-xs ${emergency ? 'text-red-700 font-medium' : 'text-slate-600'}`}>
                {emergency
                  ? 'Immediate medical evaluation is recommended. Please proceed to an urgent care facility or contact emergency services.'
                  : 'Initial symptom screening detected no immediate emergency indicators.'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Recommended Next Steps */}
        <section className="space-y-3">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recommended Next Steps
            </h3>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Schedule a consultation with a qualified healthcare professional for formal evaluation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Monitor your symptoms closely over the next few days and record any changes or progression.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Follow general self-care guidance and maintain adequate hydration and rest.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Seek immediate medical attention if your symptoms worsen or if new severe symptoms develop.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 4: Important Notice / Medical Disclaimer */}
        <section className="pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700 uppercase tracking-wide text-[11px]">
              Important Notice
            </p>
            <p className="leading-relaxed">
              This assessment is generated using an AI-assisted prediction model based on the symptoms you provided. It is intended for informational purposes only and should not be considered a medical diagnosis. Please consult a qualified healthcare professional for medical advice, diagnosis, or treatment.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
