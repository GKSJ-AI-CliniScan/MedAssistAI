import React from 'react';

export default function SeverityPill({ severity = 'low', className = '', ...props }) {
  const normSeverity = severity.toLowerCase();

  const styles = {
    low: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/40',
    medium: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/40',
    moderate: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/40',
    high: 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-700/40',
    critical: 'bg-rose-200 text-rose-900 border border-rose-400 font-bold dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-600/60 animate-pulse'
  };

  const label = {
    low: 'Low Risk',
    medium: 'Moderate Risk',
    moderate: 'Moderate Risk',
    high: 'High Risk',
    critical: 'Critical Risk'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles[normSeverity] || styles.low} ${className}`}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label[normSeverity] || severity}
    </span>
  );
}
