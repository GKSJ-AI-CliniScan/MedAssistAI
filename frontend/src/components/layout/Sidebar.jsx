import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Brain, 
  ShieldAlert, 
  FileText, 
  BarChart3,
  X,
  Users,
  UserCog,
  Calendar,
  Settings,
  User,
  History,
  Pill,
  HeartPulse,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE } from '../../constants/roles';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const role = user?.role;

  const getNavItems = () => {
    const base = `/${role}`;
    
    switch (role) {
      case ROLE.ADMIN:
        return [
          { name: 'Command Center', path: `${base}/overview`, icon: LayoutDashboard },
          { name: 'Manage Doctors', path: `${base}/doctors`, icon: UserCog },
          { name: 'Manage Patients', path: `${base}/patients`, icon: Users },
          { name: 'Appointments', path: `${base}/appointments`, icon: Calendar },
          { name: 'Analytics', path: `${base}/analytics`, icon: BarChart3 },
          { name: 'Clinical Reports', path: `${base}/reports`, icon: FileText },
          { name: 'Settings', path: `${base}/settings`, icon: Settings },
        ];
      case ROLE.DOCTOR:
        return [
          { name: 'Today & Overview', path: `${base}/overview`, icon: LayoutDashboard },
          { name: 'Assigned Patients', path: `${base}/patients`, icon: Users },
          { name: 'Appointments', path: `${base}/appointments`, icon: Calendar },
          { name: 'Prescriptions', path: `${base}/prescriptions`, icon: Pill },
          { name: 'Patient History', path: `${base}/history`, icon: History },
          { name: 'Medical Reports', path: `${base}/reports`, icon: FileText },
          { name: 'Profile', path: `${base}/profile`, icon: User },
        ];
      case ROLE.PATIENT:
        return [
          { name: 'Home Command', path: `${base}/overview`, icon: LayoutDashboard },
          { name: 'Symptom Assessment', path: `${base}/symptoms`, icon: Activity },
          { name: 'Disease Prediction', path: `${base}/prediction`, icon: Brain },
          { name: 'Risk Assessment', path: `${base}/risk`, icon: ShieldAlert },
          { name: 'Appointments', path: `${base}/appointments`, icon: Calendar },
          { name: 'My Medications', path: `${base}/prescriptions`, icon: Pill },
          { name: 'Medical Reports', path: `${base}/reports`, icon: FileText },
          { name: 'Profile', path: `${base}/profile`, icon: User },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r transition-all duration-300 lg:translate-x-0 lg:static lg:z-0
          bg-[#061426]/95 border-white/10 text-white backdrop-blur-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header with Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#06B6D4]/20 text-[#06B6D4] shadow-sm">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  MedAssistAI
                </span>
                <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse-glow" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#06B6D4] block -mt-0.5">
                AI-Powered Healthcare
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/60 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Context Card */}
        <div className="p-3.5 mx-3 my-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-white truncate">
              {user?.name || user?.email || 'Clinical User'}
            </div>
            <div className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">
              {role || 'Portal'} Access
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-[#06B6D4]/20 text-[#06B6D4] font-bold shadow-sm' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-white/10 text-[11px] text-white/40 text-center font-medium">
          MedAssistAI 2026
        </div>
      </aside>
    </>
  );
}
