import { Menu, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../common/NotificationBell';
import UserMenu from '../common/UserMenu';
import { getGreeting } from '../../utils/helpers';

/**
 * Navbar — top bar with menu toggle, global search, notifications, user menu.
 */
export default function Navbar({ user, onMenuClick, notifications, onMarkAll, notifLoading }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-200/70 bg-white/70 px-4 backdrop-blur-xl lg:px-6">
      <button
        onClick={onMenuClick}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 hover:bg-ink-50 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden items-center gap-2 md:flex">
        <span className="text-sm text-ink-500">{getGreeting()},</span>
        <span className="text-sm font-semibold text-ink-900">
          {user?.name?.split(' ')[0] || 'there'}
        </span>
        <Sparkles className="h-4 w-4 text-brand-500" />
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <button
          onClick={() => navigate('/symptom-checker')}
          className="hidden items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-500 transition-all hover:border-ink-300 hover:bg-ink-50 sm:flex"
        >
          <Search className="h-4 w-4" />
          <span>Search symptoms…</span>
          <kbd className="ml-2 rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-medium text-ink-400">
            ⌘K
          </kbd>
        </button>

        <NotificationBell
          notifications={notifications}
          onMarkAll={onMarkAll}
          loading={notifLoading}
        />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
