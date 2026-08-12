import { cn } from '../../utils/helpers';

const tones = {
  neutral: 'bg-ink-100 text-ink-600',
  brand: 'bg-brand-50 text-brand-700 border border-brand-200',
  success: 'bg-emerald2-50 text-emerald2-700 border border-emerald2-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
};

export default function Badge({ tone = 'neutral', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone] || tones.neutral,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
