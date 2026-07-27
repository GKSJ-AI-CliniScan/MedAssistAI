import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { Sun, Moon, Bell, User, LogOut, Check, Settings, Search, MessageSquare, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const unreadNotifications = notifications.filter(n => !n.read);
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-glass-sm rounded-none">
      {/* Search & Date info */}
      <div className="flex items-center gap-6 flex-1 max-w-lg">
        <div className="relative w-full hidden md:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, medical ID, symptoms..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200"
          />
        </div>
        <div className="hidden lg:flex items-center gap-2 text-slate-400 text-xs font-semibold whitespace-nowrap bg-white/3 px-3 py-2 rounded-xl border border-white/5">
          <Calendar size={13} className="text-cyan-400" />
          {formattedDate}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Messages Mock */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-all focus:outline-none hidden sm:block"
        >
          <MessageSquare size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-all focus:outline-none"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-all focus:outline-none"
          >
            <Bell size={16} />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-900 font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-slate-950 animate-pulse">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 z-40 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass-lg p-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span className="text-xs font-bold text-slate-200">Alerts & Notifications</span>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 focus:outline-none font-bold"
                      >
                        <Check size={12} /> Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-slate-500 text-xs font-medium">
                        No active alerts
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setShowNotifications(false);
                          }}
                          className={`
                            px-4 py-2.5 hover:bg-white/5 transition-all cursor-pointer border-b border-white/5 last:border-0 flex flex-col gap-0.5
                            ${!n.read ? 'bg-cyan-500/5' : ''}
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-bold ${n.type === 'error' ? 'text-rose-450' : n.type === 'warning' ? 'text-amber-400' : 'text-cyan-400'}`}>
                              {n.title}
                            </span>
                            <span className="text-[9px] text-slate-500">{n.time}</span>
                          </div>
                          <p className="text-slate-450 text-[11px] leading-normal">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-white/10 p-2 text-center bg-slate-900/50">
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-slate-400 hover:text-white font-bold transition-all inline-block w-full py-1"
                    >
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 text-slate-200 bg-white/5 hover:bg-white/10 pl-2.5 pr-3 py-1.5 rounded-xl border border-white/10 transition-all focus:outline-none relative"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-glow-primary">
              {user?.name?.[0]?.toUpperCase() || 'Y'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] text-slate-400 font-semibold leading-none mb-0.5">Clinical Staff</p>
              <p className="text-xs font-bold text-slate-200 leading-none">Dr. {user?.name || 'Yamini'}</p>
            </div>
            {/* Pulsing online status dot */}
            <span className="absolute bottom-1.5 left-7 w-2 h-2 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 z-40 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass-lg p-1.5"
                >
                  <div className="px-3.5 py-3 border-b border-white/10">
                    <p className="text-xs font-bold text-slate-100 truncate">Dr. {user?.name || 'Yamini'}</p>
                    <p className="text-[10px] text-slate-450 truncate">{user?.email || 'yamini@medassist.ai'}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                      <User size={14} /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                      <Settings size={14} /> Settings
                    </Link>
                  </div>
                  <div className="border-t border-white/10 pt-1.5 mt-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-rose-450 hover:bg-rose-500/10 rounded-xl transition-all font-bold"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
