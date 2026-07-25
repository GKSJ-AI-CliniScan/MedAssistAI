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
  Users,
  UserCog,
  UserCheck,
  Calendar,
  Settings,
  User,
  History,
  Pill,
  UserPlus,
  Clock
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
          { name: 'Overview', path: `${base}/overview`, icon: LayoutDashboard },
          { name: 'Manage Doctors', path: `${base}/doctors`, icon: UserCog },
          { name: 'Manage Patients', path: `${base}/patients`, icon: Users },
          { name: 'Manage Staff', path: `${base}/staff`, icon: UserCheck },
          { name: 'Manage Appointments', path: `${base}/appointments`, icon: Calendar },
          { name: 'Analytics', path: `${base}/analytics`, icon: BarChart3 },
          { name: 'Reports', path: `${base}/reports`, icon: FileText },
          { name: 'Settings', path: `${base}/settings`, icon: Settings },
        ];
      case ROLE.DOCTOR:
        return [
          { name: 'Overview', path: `${base}/overview`, icon: LayoutDashboard },
          { name: 'Assigned Patients', path: `${base}/patients`, icon: Users },
          { name: 'Appointments', path: `${base}/appointments`, icon: Calendar },
          { name: 'Patient History', path: `${base}/history`, icon: History },
          { name: 'Medical Reports', path: `${base}/reports`, icon: FileText },
          { name: 'Prescriptions', path: `${base}/prescriptions`, icon: Pill },
          { name: 'Profile', path: `${base}/profile`, icon: User },
        ];
      case ROLE.PATIENT:
        return [
          { name: 'Overview', path: `${base}/overview`, icon: LayoutDashboard },
          { name: 'Symptom Checker', path: `${base}/symptoms`, icon: Activity },
          { name: 'Disease Prediction', path: `${base}/prediction`, icon: Brain },
          { name: 'Risk Assessment', path: `${base}/risk`, icon: ShieldAlert },
          { name: 'Recommendations', path: `${base}/recommendations`, icon: Sparkles },
          { name: 'Reports', path: `${base}/reports`, icon: FileText },
          { name: 'Profile', path: `${base}/profile`, icon: User },
        ];
      case ROLE.STAFF:
        return [
          { name: 'Overview', path: `${base}/overview`, icon: LayoutDashboard },
          { name: 'Patient Registration', path: `${base}/registration`, icon: UserPlus },
          { name: 'Appointments', path: `${base}/appointments`, icon: Calendar },
          { name: 'Doctor Schedule', path: `${base}/schedule`, icon: Clock },
          { name: 'Reports', path: `${base}/reports`, icon: FileText },
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
