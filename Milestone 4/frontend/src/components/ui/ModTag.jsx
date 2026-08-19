import React from 'react';

export default function ModTag({ 
  children, 
  variant = 'brand', // 'brand', 'accent', 'warning', 'danger', 'success', 'neutral', 'ai'
  className = '', 
  ...props 
}) {
  const variants = {
    brand: 'bg-clinical-mint text-clinical-green border border-clinical-teal/30 dark:bg-clinical-tealDark/15 dark:text-clinical-tealDark dark:border-clinical-tealDark/30',
    accent: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/40',
    ai: 'bg-purple-50 text-clinical-violet border border-purple-200 dark:bg-purple-950/50 dark:text-clinical-violetDark dark:border-purple-800/40',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40',
    danger: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800/40',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant] || variants.brand} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
