import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  glow = false,
  glowColor = 'cyan', // cyan, indigo, rose, none
  hoverEffect = false,
  onClick,
  ...props
}) => {
  const getGlowClass = () => {
    if (!glow) return '';
    if (glowColor === 'indigo') return 'glow-indigo';
    if (glowColor === 'rose') return 'glow-rose';
    return 'glow-cyan';
  };

  const CardWrapper = hoverEffect ? motion.div : 'div';
  const motionProps = hoverEffect
    ? {
        whileHover: { y: -4, scale: 1.01 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <CardWrapper
      onClick={onClick}
      className={`
        glass-card rounded-2xl p-6 relative overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${getGlowClass()}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {/* Dynamic background highlights */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/2 to-white/5 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </CardWrapper>
  );
};

export default GlassCard;
