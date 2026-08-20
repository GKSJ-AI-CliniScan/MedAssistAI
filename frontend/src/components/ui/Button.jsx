import React from 'react';

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ai', 'danger'
  size = 'medium', // 'small', 'medium', 'large'
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-clinical-teal focus:ring-offset-2 dark:focus:ring-offset-clinical-bgDark disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white hover:shadow-lg hover:shadow-[#06B6D4]/30',
    secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20',
    outline: 'border border-[#06B6D4]/50 text-[#06B6D4] bg-transparent hover:bg-[#06B6D4]/10',
    ai: 'bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white hover:opacity-95 shadow-sm shadow-[#7C3AED]/30',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-xs rounded-md font-medium',
    medium: 'px-4 py-2 text-sm rounded-lg font-medium',
    large: 'px-6 py-2.5 text-base rounded-lg font-semibold'
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
