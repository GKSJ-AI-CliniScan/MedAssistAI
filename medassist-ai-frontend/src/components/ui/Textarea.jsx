import { forwardRef, useId } from 'react';
import { cn } from '../../utils/helpers';

const Textarea = forwardRef(function Textarea(
  { label, error, className, id: idProp, rows = 4, ...props },
  ref,
) {
  const autoId = useId();
  const id = idProp || autoId;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={cn(
          'input-base resize-none',
          error && 'border-red-400 focus:ring-red-100',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
});

export default Textarea;
