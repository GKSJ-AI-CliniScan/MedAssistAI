import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useDebounce — returns a debounced value and a function to set it.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * useDebouncedCallback — returns a debounced function.
 */
export function useDebouncedCallback(fn, delay = 300) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timer = useRef(null);
  return useCallback(
    (...args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay],
  );
}
