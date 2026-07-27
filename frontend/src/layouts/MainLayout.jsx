import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * MainLayout — Bare wrapper for public-facing pages.
 * Navigation, header, and footer are managed by each page individually
 * (e.g., LandingPage owns its own LandingNavbar and LandingFooter).
 */
export const MainLayout = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[var(--bg-color)]">
      <Outlet />
    </div>
  );
};

export default MainLayout;
