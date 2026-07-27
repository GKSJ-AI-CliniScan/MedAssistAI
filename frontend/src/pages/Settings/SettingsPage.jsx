import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, ArrowLeft, Shield, Sliders, Volume2, Database, Key, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import RippleButton from '../../components/ui/RippleButton';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState('medassist_api_key_sample_12345');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success('💾 Settings configuration successfully updated!', {
      style: { background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(16,185,129,0.3)', color: '#f8fafc' },
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all focus:outline-none"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Settings className="text-slate-400" /> Settings
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Control clinical portal preferences and core parameters</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Core preferences */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-5 border border-white/8 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Sliders size={14} className="text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Portal Preferences</h2>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* Dark Mode */}
            <div className="flex justify-between items-center bg-white/2 p-3 rounded-2xl border border-white/5">
              <div>
                <p className="text-slate-200">High Contrast Dark Mode</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Saves battery and reduces optical strain</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`w-12 h-6.5 rounded-full p-1 transition-all ${isDark ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4.5 h-4.5 rounded-full bg-slate-950 transition-all ${isDark ? 'translate-x-5.5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex justify-between items-center bg-white/2 p-3 rounded-2xl border border-white/5">
              <div>
                <p className="text-slate-200">Real-time Emergency Notifications</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Display push banners for critical cases</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6.5 rounded-full p-1 transition-all ${notificationsEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4.5 h-4.5 rounded-full bg-slate-950 transition-all ${notificationsEnabled ? 'translate-x-5.5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security and Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-5 border border-white/8 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Shield size={14} className="text-indigo-400" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security Credentials</h2>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* API Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Key size={11} /> MedAssist AI API Key
              </label>
              <input
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all font-mono"
              />
            </div>

            {/* Session duration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Database size={11} /> Session Duration Limit (Minutes)
              </label>
              <select
                value={sessionTimeout}
                onChange={e => setSessionTimeout(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:border-cyan-500/50 transition-all"
              >
                <option value="15" className="bg-slate-900">15 Minutes</option>
                <option value="30" className="bg-slate-900">30 Minutes</option>
                <option value="60" className="bg-slate-900">60 Minutes</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Form actions */}
        <div className="flex justify-end gap-3 pt-2">
          <RippleButton
            variant="outline"
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 text-xs font-bold"
          >
            Cancel
          </RippleButton>
          <RippleButton
            variant="primary"
            type="submit"
            className="px-6 py-2.5 text-xs font-bold gap-1.5"
          >
            Save Changes <Check size={14} />
          </RippleButton>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
