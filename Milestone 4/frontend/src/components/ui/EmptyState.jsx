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
      className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 dark:border-clinical-tealDark/20 rounded-xl max-w-md mx-auto bg-white/60 dark:bg-clinical-cardDark/60 backdrop-blur-sm ${className}`}
      {...props}
    >
      {Icon && (
        <div className="mb-4 p-3 rounded-full bg-clinical-mint/60 dark:bg-clinical-tealDark/10 text-clinical-green dark:text-clinical-tealDark">
          {React.isValidElement(Icon) ? Icon : <Icon className="h-7 w-7" />}
        </div>
      )}
      
      {title && (
        <h4 className="text-base font-semibold text-clinical-textLight dark:text-clinical-textDark mb-1">
          {title}
        </h4>
      )}
      
      {description && (
        <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mb-5 max-w-xs leading-relaxed">
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
