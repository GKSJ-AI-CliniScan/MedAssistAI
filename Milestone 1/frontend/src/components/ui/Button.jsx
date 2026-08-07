import React from 'react';

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger'
  size = 'medium', // 'small', 'medium', 'large'
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700',
    outline: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizes = {
    small: 'px-3 py-1 text-xs rounded',
    medium: 'px-4 py-2 text-sm rounded',
    large: 'px-5 py-2.5 text-base rounded'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.medium} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
