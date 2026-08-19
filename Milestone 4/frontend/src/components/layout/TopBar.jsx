import React from 'react';
import { Menu, LogOut, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

export default function TopBar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPortalTitle = () => {
    switch (user?.role) {
      case 'admin': return 'Clinical Administration System';
      case 'doctor': return 'Clinician Command Portal';
      case 'patient': return 'Personal Health & AI Suite';
      default: return 'Medical Portal';
    }
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#061426]/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        
        <div>
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>{getPortalTitle()}</span>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4]">
              <ShieldCheck className="w-3 h-3" /> Live Protocol
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Icon (Decorative Indicator) */}
        <button 
          type="button" 
          aria-label="Notifications"
          className="p-2 rounded-full text-white/60 hover:bg-white/10 relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#06B6D4]" />
        </button>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
