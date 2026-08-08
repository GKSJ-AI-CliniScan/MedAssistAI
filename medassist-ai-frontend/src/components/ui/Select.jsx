import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Select({ label, options = [], className, id: idProp, error, ...props }) {
  const autoId = useId();
  const id = idProp || autoId;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={cn(
            'input-base appearance-none pr-10',
            error && 'border-red-400 focus:ring-red-100',
            className,
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
