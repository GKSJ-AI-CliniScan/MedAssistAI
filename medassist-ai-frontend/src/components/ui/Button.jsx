import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const variants = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 shadow-soft focus-visible:ring-brand-200',
  secondary:
    'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50 hover:border-ink-300 focus-visible:ring-ink-200',
  ghost: 'text-ink-600 hover:bg-ink-100 focus-visible:ring-ink-200',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-soft focus-visible:ring-red-200',
  success: 'bg-emerald2-600 text-white hover:bg-emerald2-700 shadow-soft focus-visible:ring-emerald2-200',
  glass: 'glass text-ink-800 hover:bg-white/90 focus-visible:ring-brand-200',
  gradient:
    'gradient-brand text-white shadow-soft hover:shadow-glow focus-visible:ring-brand-200',
};

const sizes = {
  sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2',
  icon: 'h-10 w-10 rounded-xl justify-center',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200',
        'focus:outline-none focus-visible:ring-4 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export default Button;
