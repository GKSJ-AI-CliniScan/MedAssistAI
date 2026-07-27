import React, { forwardRef } from 'react';

export const GlassInput = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-300 dark:text-slate-300 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={`
            w-full bg-white/5 border rounded-xl py-3 px-4 transition-all duration-300 outline-none
            placeholder-slate-500 text-slate-200 text-sm focus:bg-white/10
            ${Icon ? 'pl-11' : ''}
            ${error 
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20' 
              : 'border-white/10 dark:border-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-rose-400 tracking-wide mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

export const GlassSelect = forwardRef(({
  label,
  error,
  options = [],
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-300 dark:text-slate-300 tracking-wide">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`
          w-full bg-[#0d1425]/85 border rounded-xl py-3 px-4 transition-all duration-300 outline-none
          text-slate-200 text-sm focus:bg-white/10 cursor-pointer appearance-none
          ${error 
            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20' 
            : 'border-white/10 dark:border-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
          }
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs font-medium text-rose-400 tracking-wide mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

export const GlassTextArea = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-300 dark:text-slate-300 tracking-wide">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={3}
        className={`
          w-full bg-white/5 border rounded-xl py-3 px-4 transition-all duration-300 outline-none
          placeholder-slate-500 text-slate-200 text-sm focus:bg-white/10 resize-none
          ${error 
            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20' 
            : 'border-white/10 dark:border-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
          }
        `}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-rose-400 tracking-wide mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

export default GlassInput;
