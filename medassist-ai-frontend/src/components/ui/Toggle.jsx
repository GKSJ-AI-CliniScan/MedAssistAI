import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * Toggle switch.
 */
export default function Toggle({ checked, onChange, label, className }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-3', className)}>
      <span className="relative inline-flex h-6 w-11 items-center">
        <motion.span
          className="flex h-6 w-11 items-center rounded-full p-0.5"
          animate={{ backgroundColor: checked ? '#2563eb' : '#cbd5e1' }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            className="block h-5 w-5 rounded-full bg-white shadow-sm"
            animate={{ x: checked ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.span>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
      </span>
      {label && <span className="text-sm text-ink-700 select-none">{label}</span>}
    </label>
  );
}
