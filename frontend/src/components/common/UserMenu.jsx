import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { logout } from '../../utils/auth';

/**
 * UserMenu — dropdown for the signed-in user.
 */
export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white py-1.5 pl-1.5 pr-2.5 transition-all hover:bg-ink-50"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <Avatar name={user?.name || user?.email} src={user?.avatar} size={30} />
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-ink-700 sm:block">
          {user?.name || user?.email || 'Account'}
        </span>
        <ChevronDown className="h-4 w-4 text-ink-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-glass"
          >
            <div className="border-b border-ink-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-ink-900">
                {user?.name || 'User'}
              </p>
              <p className="truncate text-xs text-ink-400">{user?.email}</p>
            </div>
            <div className="p-1.5">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-100"
              >
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-100"
              >
                <Settings className="h-4 w-4" /> Settings
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
