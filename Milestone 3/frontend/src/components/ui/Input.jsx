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
    <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          px-3 py-2 border rounded text-sm bg-white text-slate-900 outline-none transition-colors
          focus:border-teal-500 focus:ring-1 focus:ring-teal-500
          disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
          ${errorText ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}
          ${fullWidth ? 'w-full' : ''}
        `}
        {...props}
      />
      {errorText ? (
        <p className="text-xs text-red-500">{errorText}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
