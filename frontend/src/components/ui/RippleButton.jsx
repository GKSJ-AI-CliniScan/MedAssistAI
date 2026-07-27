import React from 'react';
import { motion } from 'framer-motion';

export const RippleButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, outline, ghost
  className = '',
  disabled = false,
  isLoading = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white/10 hover:bg-white/15 text-white border border-white/10 shadow-glass-sm';
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose/40';
      case 'outline':
        return 'bg-transparent border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400';
      case 'ghost':
        return 'bg-transparent hover:bg-white/5 text-slate-300';
      case 'primary':
      default:
        return 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-450 hover:to-indigo-550 text-white shadow-glow-primary/40';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`
        relative overflow-hidden px-5 py-2.5 rounded-xl font-medium tracking-wide
        transition-all duration-300 flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantStyles()}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default RippleButton;
