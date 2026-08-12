import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Stethoscope,
  FileText,
  User,
  Settings,
  Activity,
  X,
  HeartPulse,
} from 'lucide-react';
import Logo from '../common/Logo';
import { cn } from '../../utils/helpers';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink-200/70 bg-white/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            Menu
          </p>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-600"
                      />
                    )}
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl gradient-brand p-4 text-white shadow-soft">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            <span className="text-sm font-semibold">Health Tip</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white/90">
            Drink at least 8 glasses of water daily and aim for 30 minutes of activity.
          </p>
        </div>

        <div className="border-t border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-ink-400">
            <Activity className="h-3.5 w-3.5" />
            <span>MedAssist AI v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
