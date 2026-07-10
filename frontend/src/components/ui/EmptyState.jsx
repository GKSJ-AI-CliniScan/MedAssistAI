import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onActionClick,
  className = '',
  ...props
}) {
  return (
    <div 
      className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 rounded-lg max-w-sm mx-auto bg-white ${className}`}
      {...props}
    >
      {Icon && (
        <div className="mb-3 text-slate-400">
          {typeof Icon === 'function' ? <Icon className="h-8 w-8" /> : Icon}
        </div>
      )}
      
      {title && (
        <h4 className="text-base font-semibold text-slate-950 mb-1">
          {title}
        </h4>
      )}
      
      {description && (
        <p className="text-xs text-slate-500 mb-4 leading-normal">
          {description}
        </p>
      )}

      {actionLabel && onActionClick && (
        <Button onClick={onActionClick} size="small" variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
