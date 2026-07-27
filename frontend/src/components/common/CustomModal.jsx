import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import GlassCard from './GlassCard';

export const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
  className = '',
  ...props
}) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      case 'md':
      default: return 'max-w-lg';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`w-full z-10 ${getSizeClass()} ${className}`}
            {...props}
          >
            <GlassCard glow glowColor="cyan" className="p-0 border border-white/10 dark:border-white/5 shadow-glass-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="text-lg font-bold text-slate-100 leading-6 tracking-wide">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {children}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
