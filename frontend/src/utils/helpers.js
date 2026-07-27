// Utility to conditionally combine tailwind classes
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Delay simulator helper
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Deep clone helper
export const cloneDeep = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Generate risk background gradient class
export const getRiskGradient = (level) => {
  switch (level?.toLowerCase()) {
    case 'high':
      return 'from-rose-500/20 to-red-500/5 border-rose-500/30 text-rose-200';
    case 'medium':
      return 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-200';
    case 'low':
    default:
      return 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-200';
  }
};
