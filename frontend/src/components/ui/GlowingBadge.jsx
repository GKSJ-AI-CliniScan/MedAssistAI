import React from 'react';

export const GlowingBadge = ({
  children,
  variant = 'cyan', // cyan, indigo, emerald, amber, rose, slate
  className = '',
  ...props
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25 glow-emerald/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25 glow-amber/20';
      case 'rose':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/25 glow-rose/20';
      case 'indigo':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25 glow-indigo/20';
      case 'slate':
        return 'bg-slate-500/10 text-slate-300 border-slate-500/25';
      case 'cyan':
      default:
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25 glow-cyan/20';
    }
  };

  return (
    <span
      className={`
        px-3 py-1 text-xs font-semibold rounded-full border tracking-wide uppercase
        inline-flex items-center gap-1.5 transition-all duration-300
        ${getStyles()}
        ${className}
      `}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {children}
    </span>
  );
};

export default GlowingBadge;
