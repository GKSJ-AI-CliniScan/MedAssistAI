import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Brain, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  BarChart3,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const navItems = [
    { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Symptom Checker', path: '/dashboard/symptoms', icon: Activity },
    { name: 'Prediction', path: '/dashboard/prediction', icon: Brain },
    { name: 'Risk Assessment', path: '/dashboard/risk', icon: ShieldAlert },
    { name: 'Recommendations', path: '/dashboard/recommendations', icon: Sparkles },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex flex-col w-60 border-r border-slate-200 
          bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight">MedAssist AI</span>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User context information */}
        <div className="p-3 border-b border-slate-800 text-xs text-slate-400">
          <div>Logged in as:</div>
          <div className="font-semibold text-slate-200 truncate">{user?.email || 'Guest'}</div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 space-y-1 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors
                  ${isActive 
                    ? 'bg-slate-800 text-white font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
