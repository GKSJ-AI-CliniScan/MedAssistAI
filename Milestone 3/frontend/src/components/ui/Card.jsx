import React from 'react';

export default function Card({
  title,
  subtitle,
  children,
  footer,
  className = '',
  ...props
}) {
  return (
    <div 
      className={`bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden p-5 md:p-6 ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4 border-b border-slate-100 pb-3">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="text-sm text-slate-700">
        {children}
      </div>

      {footer && (
        <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-end gap-2">
          {footer}
        </div>
      )}
    </div>
  );
}
