import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import {
  LayoutDashboard,
  User,
  History,
  Stethoscope,
  Brain,
  ShieldAlert,
  Heart,
  FileText,
  LineChart,
  Bell,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  CalendarDays,
  Sparkles,
  Users,
  Clock,
  Award,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications } = useUser();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const isDoctor = user?.role === 'doctor';

  // Patient Navigation Items
  const patientMenuItems = [
    { name: 'Dashboard', path: '/patient-dashboard', icon: LayoutDashboard },
    { name: 'Patient Profile', path: '/patient-profile', icon: User },
    { name: 'Symptom Analysis', path: '/symptom-analysis', icon: Stethoscope },
    { name: 'Find a Doctor', path: '/appointments', icon: Building2 },
    { name: 'Hospitals Directory', path: '/hospitals', icon: Building2 },
    { name: 'My Appointments', path: '/my-appointments', icon: Clock },
    { name: 'Disease Prediction', path: '/prediction', icon: Brain },
    { name: 'Risk Assessment', path: '/risk', icon: ShieldAlert },
    { name: 'Treatment Recs.', path: '/recommendations', icon: Heart },
    { name: 'Medical History', path: '/medical-history', icon: History },
    { name: 'Lab Reports', path: '/reports', icon: FileText },
    { name: 'Health Analytics', path: '/analytics', icon: LineChart },
    { name: 'AI Health Assistant', path: '/assistant', icon: Sparkles },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  // Doctor Navigation Items
  const doctorMenuItems = [
    { name: 'Doctor Dashboard', path: '/doctor-dashboard', icon: LayoutDashboard },
    { name: 'Doctor Profile', path: '/doctor-profile', icon: Award },
    { name: 'Patient Queue', path: '/doctor-appointments', icon: Users },
    { name: 'Schedule', path: '/appointments', icon: CalendarDays },
    { name: 'Clinical Reports', path: '/reports', icon: FileText },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const menuItems = isDoctor ? doctorMenuItems : patientMenuItems;

  const displayName = user?.full_name || user?.name || (isDoctor ? 'Dr. Practitioner' : 'Patient');
  const roleLabel = isDoctor ? 'Doctor · Active License' : 'Patient · Online';
  const avatarLetter = displayName?.[0]?.toUpperCase() || (isDoctor ? 'D' : 'P');

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-450 hover:to-indigo-550 text-white p-4 rounded-full shadow-glow-primary focus:outline-none transition-all duration-350"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside
        className={`
          glass-panel sticky top-0 left-0 h-screen z-45 flex flex-col justify-between py-6 transition-all duration-350 border-r border-white/5 bg-slate-950/40 backdrop-blur-xl
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0 w-64 bg-slate-950' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Logo Section */}
          <div className="flex items-center justify-between px-5 mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-glow-primary shrink-0">
                MA
              </div>
              {!collapsed && (
                <span className="font-extrabold text-sm tracking-widest text-slate-100 uppercase bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  MedAssist AI
                </span>
              )}
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/5 transition-all focus:outline-none"
            >
              {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>
          </div>

          {/* Role Badge */}
          {!collapsed && (
            <div className={`mx-4 mb-4 px-3 py-1.5 rounded-xl text-center text-[9px] font-extrabold uppercase tracking-widest border
              ${isDoctor
                ? 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'
                : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'}`}
            >
              {isDoctor ? '🩺 Doctor Portal' : '🏥 Patient Portal'}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1 px-3 max-h-[70vh] overflow-y-auto scrollbar-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 relative group
                    ${isActive
                      ? `bg-gradient-to-r ${isDoctor ? 'from-indigo-500/15 to-purple-650/5 text-indigo-400 border-l-[3px] border-indigo-500' : 'from-cyan-500/15 to-indigo-650/5 text-cyan-400 border-l-[3px] border-cyan-500'} shadow-glass-sm`
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                    }
                  `}
                >
                  <Icon size={16} className="shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  
                  {!collapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}
                  
                  {/* Badge */}
                  {item.badge > 0 && !collapsed && (
                    <span className={`font-black px-1.5 py-0.5 text-[9px] rounded-full text-slate-950
                      ${isDoctor ? 'bg-indigo-400' : 'bg-cyan-500'}`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Collapsed Tooltip */}
                  {collapsed && (
                    <div className="absolute left-20 bg-slate-900 border border-white/10 text-white text-[10px] font-bold py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-glass-lg z-50">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: Avatar & Logout */}
        <div className="px-3 border-t border-white/5 pt-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 border border-white/5">
            <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-glow-primary shrink-0
              ${isDoctor
                ? 'bg-gradient-to-tr from-indigo-500 to-purple-600'
                : 'bg-gradient-to-tr from-cyan-500 to-indigo-600'}`}
            >
              {avatarLetter}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950 animate-pulse" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-slate-200 text-xs font-bold truncate leading-tight">{displayName}</p>
                <p className="text-[9px] text-slate-500 truncate leading-none mt-0.5">{roleLabel}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  navigate('/signin');
                }}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-all"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
          
          {collapsed && (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
                navigate('/signin');
              }}
              className="flex w-full items-center justify-center p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
