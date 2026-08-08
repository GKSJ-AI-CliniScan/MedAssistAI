import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Bell,
  UserCog,
  Mail,
  Smartphone,
  Save,
  Globe,
  Check,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toggle from '../../components/ui/Toggle';
import Badge from '../../components/ui/Badge';
import { userApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../utils/auth';

const sections = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account', icon: UserCog },
];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [active, setActive] = useState('notifications');
  const [saving, setSaving] = useState(false);

  const [notif, setNotif] = useState({
    email: true,
    push: true,
    reports: true,
    recommendations: true,
    marketing: false,
  });

  const [account, setAccount] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: 'en',
    timezone: 'UTC',
  });

  useEffect(() => {
    userApi
      .getProfile()
      .then((d) => {
        const u = d.user || d;
        const s = d.settings || u.settings || {};
        if (s.notifications) setNotif((n) => ({ ...n, ...s.notifications }));
        setAccount((a) => ({
          ...a,
          name: u.name || a.name,
          email: u.email || a.email,
          language: s.language || a.language,
          timezone: s.timezone || a.timezone,
        }));
      })
      .catch(() => {
        // Non-critical: fall back to cached user from useAuth
      });
  }, []);

  const handleSaveNotif = async () => {
    setSaving(true);
    try {
      await userApi.updateSettings({ notifications: notif });
      toast.success('Notification preferences saved');
    } catch (e) {
      toast.error(e.message || 'Could not save preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAccount = async () => {
    setSaving(true);
    try {
      const res = await userApi.updateProfile({
        name: account.name,
        language: account.language,
        timezone: account.timezone,
      });
      updateUser(res.user || res || { ...user, name: account.name });
      toast.success('Account settings saved');
    } catch (e) {
      toast.error(e.message || 'Could not save account.');
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          <UserCog className="h-3.5 w-3.5" /> Settings
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">Settings</h1>
        <p className="mt-1 text-ink-500">Manage your preferences, security, and account.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ---- Sidebar nav ---- */}
        <aside className="lg:w-56">
          <div className="flex gap-2 overflow-x-auto rounded-2xl border border-ink-200/70 bg-white p-2 shadow-soft lg:flex-col">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all lg:w-full ${isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'
                    }`}
                >
                  <Icon className="h-4 w-4" /> {s.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ---- Panel ---- */}
        <div className="flex-1">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft">

            {/* Notifications */}
            {active === 'notifications' && (
              <div className="space-y-6">
                <PanelHeader title="Notifications" desc="Choose what updates you want to receive." />
                <div className="space-y-1">
                  <NotifRow icon={Mail} title="Email notifications" desc="Receive health updates by email" checked={notif.email} onChange={(v) => setNotif((n) => ({ ...n, email: v }))} />
                  <NotifRow icon={Smartphone} title="Push notifications" desc="Get alerts on your device" checked={notif.push} onChange={(v) => setNotif((n) => ({ ...n, push: v }))} />
                  <NotifRow icon={Check} title="Report ready" desc="When a new report is generated" checked={notif.reports} onChange={(v) => setNotif((n) => ({ ...n, reports: v }))} />
                  <NotifRow icon={Bell} title="AI recommendations" desc="Personalized health tips" checked={notif.recommendations} onChange={(v) => setNotif((n) => ({ ...n, recommendations: v }))} />
                  <NotifRow icon={Globe} title="Product updates" desc="News about new features" checked={notif.marketing} onChange={(v) => setNotif((n) => ({ ...n, marketing: v }))} />
                </div>
                <div className="flex justify-end">
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
  <div className="flex items-center gap-2 text-green-700">
    <Check className="h-5 w-5" />
    <div>
      <p className="text-sm font-semibold">
        Notification Preferences
      </p>
      <p className="text-sm">
        Your notification preferences are applied automatically.
      </p>
    </div>
  </div>
</div>
                </div>
              </div>
            )}

            {/* Account */}
            {active === 'account' && (
              <div className="space-y-6">
                <PanelHeader title="Account" desc="Manage your account information." />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Full name" icon={UserCog} value={account.name} onChange={(e) => setAccount((a) => ({ ...a, name: e.target.value }))} />
                  <Input label="Email" icon={Mail} value={account.email} onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))} disabled />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Language</label>
                    <select className="input-base" value={account.language} onChange={(e) => setAccount((a) => ({ ...a, language: e.target.value }))}>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="hi">हिन्दी</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Timezone</label>
                    <select className="input-base" value={account.timezone} onChange={(e) => setAccount((a) => ({ ...a, timezone: e.target.value }))}>
                      <option value="UTC">UTC</option>
                      <option value="EST">EST (UTC-5)</option>
                      <option value="PST">PST (UTC-8)</option>
                      <option value="IST">IST (UTC+5:30)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
  <Button variant="secondary" onClick={logout}>
    Sign Out
  </Button>
</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ title, desc }) {
  return (
    <div className="border-b border-ink-100 pb-4">
      <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
      <p className="mt-0.5 text-sm text-ink-500">{desc}</p>
    </div>
  );
}

function NotifRow({ icon: Icon, title, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-50 py-3 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-800">{title}</p>
          <p className="text-xs text-ink-400">{desc}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}