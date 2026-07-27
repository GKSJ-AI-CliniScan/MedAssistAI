import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * AuthLayout — wraps all /auth/* pages.
 * Provides animated page transitions between auth routes.
 * Each auth page is self-contained (full-screen, manages its own layout).
 */
export const AuthLayout = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthLayout;
