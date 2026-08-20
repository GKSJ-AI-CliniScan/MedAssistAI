import React from 'react';

export default function Card({
  title,
  subtitle,
  children,
  footer,
  variant = 'standard', // 'standard', 'glass', 'ai'
  className = '',
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'glass-panel shadow-glass-light dark:shadow-glass-dark rounded-xl';
      case 'ai':
        return 'bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/30 dark:from-[#0D2633] dark:via-[#111A38] dark:to-[#171435] border border-clinical-violet/30 dark:border-clinical-violetDark/40 shadow-md shadow-clinical-violet/5 rounded-xl';
      case 'standard':
      default:
        return 'bg-white dark:bg-clinical-cardDark border border-slate-200/80 dark:border-clinical-tealDark/15 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200';
    }
  };

  return (
    <div 
      className={`p-5 md:p-6 text-slate-800 dark:text-clinical-textDark ${getVariantStyles()} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold tracking-tight text-clinical-textLight dark:text-clinical-textDark flex items-center gap-2">
                {variant === 'ai' && (
                  <span className="inline-block w-2 h-2 rounded-full bg-clinical-violet dark:bg-clinical-violetDark animate-pulse" />
                )}
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {children}
      </div>

      {footer && (
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-end gap-2 text-xs">
          {footer}
        </div>
      )}
    </div>
  );
}
