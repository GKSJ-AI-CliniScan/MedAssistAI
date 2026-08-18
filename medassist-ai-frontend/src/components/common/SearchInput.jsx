import { forwardRef, useId, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

/**
 * SearchInput — controlled search field with clear button.
 */
const SearchInput = forwardRef(function SearchInput(
  { value, onChange, onClear, placeholder = 'Search…', className, icon: Icon = Search, autoFocus, ...props },
  ref,
) {
  const id = useId();
  return (
    <div className={cn('relative w-full', className)}>
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
      <input
        ref={ref}
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="input-base h-10 pl-11 pr-10 text-sm"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

export default SearchInput;
