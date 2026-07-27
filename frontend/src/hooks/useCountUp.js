import React, { useState, useEffect, useRef } from 'react';

/**
 * Animated count-up number hook.
 * Counts from 0 to `end` over `duration` ms when `trigger` becomes true.
 */
export const useCountUp = (end, duration = 1500, trigger = true) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();
    const startVal = 0;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + eased * (end - startVal)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, trigger]);

  return count;
};

export default useCountUp;
