import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Logo({ size = 'md', className, light = false }) {
  const sizes = {
    sm: { box: 'h-8 w-8', icon: 16, text: 'text-base' },
    md: { box: 'h-10 w-10', icon: 20, text: 'text-lg' },
    lg: { box: 'h-12 w-12', icon: 24, text: 'text-2xl' },
  };
  const s = sizes[size] || sizes.md;
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <motion.div
        initial={{ rotate: -10, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className={cn(
          'flex items-center justify-center rounded-xl gradient-brand shadow-soft',
          s.box,
        )}
      >
        <Activity className="text-white" size={s.icon} />
      </motion.div>
      <div className="leading-none">
        <span className={cn('font-display font-extrabold tracking-tight', s.text, light ? 'text-white' : 'text-ink-900')}>
          MedAssist
        </span>
        <span className={cn('ml-1 font-display font-extrabold', s.text, 'text-brand-600')}>AI</span>
      </div>
    </div>
  );
}
