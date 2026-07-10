import React from 'react';

export default function ModTag({ 
  children, 
  variant = 'brand', // 'brand', 'accent', 'warning', 'danger', 'success', 'neutral'
  className = '', 
  ...props 
}) {
  const variants = {
    brand: 'bg-teal-50 text-teal-700 border border-teal-200',
    accent: 'bg-blue-50 text-blue-700 border border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200'
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
