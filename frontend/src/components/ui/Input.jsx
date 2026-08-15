import React from 'react';

export default function Input({
  label,
  placeholder,
  helperText,
  errorText,
  disabled = false,
  fullWidth = false,
  type = 'text',
  className = '',
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-white tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 outline-none
          bg-white/5 border border-white/10 text-white placeholder:text-white/40
          focus:border-[#06B6D4]/50 focus:ring-2 focus:ring-[#06B6D4]/20
          disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed
          ${errorText 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
            : ''
          }
          ${fullWidth ? 'w-full' : ''}
        `}
        {...props}
      />
      {errorText ? (
        <p className="text-xs text-red-400 mt-0.5">{errorText}</p>
      ) : helperText ? (
        <p className="text-xs text-white/50 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
