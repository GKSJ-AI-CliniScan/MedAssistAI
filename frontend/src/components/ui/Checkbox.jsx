import { useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Checkbox({
  label,
  checked,
  onChange,
  className,
  id: idProp,
  ...props
}) {
  const autoId = useId();
  const id = idProp || autoId;
  return (
    <label htmlFor={id} className={cn('inline-flex cursor-pointer items-center gap-2.5', className)}>
      <span className="relative inline-flex h-5 w-5 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer absolute h-5 w-5 cursor-pointer appearance-none rounded-md border border-ink-300 bg-white transition-all checked:border-brand-600 checked:bg-brand-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
          {...props}
        />
        <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
      {label && <span className="text-sm text-ink-700 select-none">{label}</span>}
    </label>
  );
}
