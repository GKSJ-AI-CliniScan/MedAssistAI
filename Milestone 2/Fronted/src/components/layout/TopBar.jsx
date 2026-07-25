import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ onMenuToggle }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        
        <h1 className="text-sm font-bold text-slate-800">
          Medical Portal
        </h1>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors text-xs font-medium"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sign Out</span>
      </button>
    </header>
  );
}
