import React from 'react';

export default function SeverityPill({ severity = 'low', className = '', ...props }) {
  const normSeverity = severity.toLowerCase();

  const styles = {
    low: 'bg-green-100 text-green-800 border border-green-200',
    medium: 'bg-amber-100 text-amber-800 border border-amber-200',
    high: 'bg-red-100 text-red-800 border border-red-200',
    critical: 'bg-rose-200 text-rose-900 border border-rose-300 font-bold'
  };

  const label = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical Risk'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[normSeverity] || styles.low} ${className}`}
      {...props}
    >
      {label[normSeverity] || severity}
    </span>
  );
}
