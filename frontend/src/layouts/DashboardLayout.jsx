import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { motion } from 'framer-motion';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#060913] text-[#f8fafc] overflow-hidden relative">
      {/* Mesh glowing highlights */}
      <div className="absolute inset-0 mesh-bg">
        <div className="mesh-circle-1" />
        <div className="mesh-circle-2" />
      </div>

      {/* Nav Sidebar */}
      <Sidebar />

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen relative z-10">
        <Header />
        
        {/* Main Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Framer motion wrapper for fluid page load transitions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full flex flex-col"
          >
            {children ? children : <Outlet />}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
