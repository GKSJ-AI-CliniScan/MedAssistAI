import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'text', // text, circular, rectangular
  height,
  width,
  ...props
}) => {
  const getShapeClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-xl';
      case 'text':
      default:
        return 'rounded-md h-4';
    }
  };

  return (
    <div
      style={{ height, width }}
      className={`
        animate-pulse bg-white/5 dark:bg-white/10 w-full
        ${getShapeClass()}
        ${className}
      `}
      {...props}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width="40px" height="40px" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height="80px" />
      <div className="flex gap-2 justify-end">
        <Skeleton variant="text" width="20%" height="24px" />
        <Skeleton variant="text" width="20%" height="24px" />
      </div>
    </div>
  );
};

export default Skeleton;
