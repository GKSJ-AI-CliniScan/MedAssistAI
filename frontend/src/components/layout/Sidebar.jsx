import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications } = useUser();

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patient Profile', path: '/profile', icon: User },
    { name: 'Symptom Analysis', path: '/symptoms', icon: Stethoscope },
    { name: 'Disease Prediction', path: '/prediction', icon: Brain },
    { name: 'Risk Assessment', path: '/risk', icon: ShieldAlert },
    { name: 'Treatment Recommendations', path: '/recommendations', icon: Heart },
    { name: 'Appointments', path: '/appointments', icon: CalendarDays },
    { name: 'Medical History', path: '/medical-history', icon: History },
    { name: 'Lab Reports', path: '/reports', icon: FileText },
    { name: 'Health Analytics', path: '/analytics', icon: LineChart },
    { name: 'AI Health Assistant', path: '/assistant', icon: Sparkles },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

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
                      ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-650/5 text-cyan-400 border-l-[3px] border-cyan-500 shadow-glass-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                    }
                  `}
                >
                  <Icon size={16} className="shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  
                  {!collapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}
                  
                  {/* Badge Notification Count */}
                  {item.badge > 0 && !collapsed && (
                    <span className="bg-cyan-500 text-slate-950 font-black px-1.5 py-0.5 text-[9px] rounded-full">
                      {item.badge}
                    </span>
                  )}

                  {/* Neon Cyan Dot Active Indicator */}
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

        {/* Footer Actions / Doctor Profile Card */}
        <div className="px-3 border-t border-white/5 pt-4 space-y-2">
          {/* Avatar and Doctor Info */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 border border-white/5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-glow-primary shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'Y'}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950 animate-pulse" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-slate-200 text-xs font-bold truncate leading-tight">Dr. {user?.name || 'Yamini'}</p>
                <p className="text-[9px] text-slate-500 truncate leading-none mt-0.5">Online Status</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-slate-500 hover:text-rose-455 p-1.5 rounded-lg hover:bg-white/5 transition-all"
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
