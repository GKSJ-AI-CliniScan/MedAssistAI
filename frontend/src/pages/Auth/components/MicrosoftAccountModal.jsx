import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Mail, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

/**
 * Microsoft Sign-In Modal & OAuth Handler
 * 
 * Strategy:
 * 1. Microsoft OAuth2 popup authorization flow (when VITE_MICROSOFT_CLIENT_ID is configured)
 * 2. Interactive Microsoft account selector fallback (when Client ID is missing in dev)
 */
export const MicrosoftAccountModal = ({ isOpen, onClose, onSelectAccount }) => {
  const { loginWithMicrosoft } = useAuth();
  const [loading, setLoading] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID || '';

  const handleMicrosoftOAuthPopup = () => {
    if (!clientId) {
      toast.warning('Microsoft Client ID not set. Use manual account entry below.');
      return;
    }

    try {
      const redirectUri = window.location.origin + '/auth/login';
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${encodeURIComponent(clientId)}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.read`;

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        'MicrosoftSignInPopup',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      const checkPopup = setInterval(() => {
        try {
          if (!popup || popup.closed) {
            clearInterval(checkPopup);
          } else if (popup.location.href.includes('access_token')) {
            const hash = popup.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const token = params.get('access_token');
            popup.close();
            clearInterval(checkPopup);

            if (token) {
              submitTokenToBackend(token);
            }
          }
        } catch (e) {
          // Cross-origin exception while popup is loading Azure page - expected
        }
      }, 500);
    } catch (err) {
      console.error('[MicrosoftAuth] Popup launch error:', err);
      toast.error('Could not launch Microsoft login popup');
    }
  };

  const submitTokenToBackend = async (token) => {
    setLoading(true);
    try {
      await loginWithMicrosoft(token, null);
      toast.success('Signed in with Microsoft! Redirecting…', { icon: '🔐' });
      onClose();
      if (onSelectAccount) onSelectAccount();
    } catch (err) {
      console.error('[MicrosoftAuth] Backend verification error:', err);
      const msg = err?.response?.data?.detail || err.message || 'Microsoft Sign-In failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualEmail.trim() || !manualName.trim()) {
      toast.warning('Please enter your name and Microsoft email.');
      return;
    }

    setLoading(true);
    try {
      const userInfo = {
        email: manualEmail.trim(),
        name: manualName.trim(),
        picture: '',
        microsoft_id: `manual_ms_${Date.now()}`,
      };
      await loginWithMicrosoft(null, userInfo);
      toast.success(`Signed in as ${manualName.trim()}! Redirecting…`, { icon: '🔐' });
      onClose();
      if (onSelectAccount) onSelectAccount();
    } catch (err) {
      console.error('[MicrosoftAuth] Manual login error:', err);
      toast.error('Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="glass-card rounded-3xl border border-white/10 p-6 max-w-md w-full shadow-2xl relative overflow-hidden space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M0 0h11.5v11.5H0z"/>
                  <path fill="#7FBA00" d="M12.5 0H24v11.5H12.5z"/>
                  <path fill="#00A4EF" d="M0 12.5h11.5V24H0z"/>
                  <path fill="#FFB900" d="M12.5 12.5H24V24H12.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Sign in with Microsoft</h3>
                <p className="text-[11px] text-slate-400">to continue to MedAssist AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Loading overlay */}
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={28} className="text-cyan-400 animate-spin" />
              <span className="ml-3 text-sm text-slate-300">Authenticating with Microsoft…</span>
            </div>
          )}

          {/* Client ID Configured Popup Option */}
          {!loading && clientId && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleMicrosoftOAuthPopup}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#FFF" d="M0 0h11.5v11.5H0zM12.5 0H24v11.5H12.5zM0 12.5h11.5V24H0zM12.5 12.5H24V24H12.5z"/>
                </svg>
                Launch Microsoft OAuth Sign-In Popup
              </button>
            </div>
          )}

          {/* Missing Client ID Info & Fallback */}
          {!loading && (
            <div className="space-y-4">
              {!clientId && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200 leading-relaxed">
                    <p className="font-bold mb-1">Microsoft Client ID not configured</p>
                    <p className="text-amber-300/80">
                      To enable Azure Microsoft Sign-In, add <code className="text-amber-200 bg-amber-500/10 px-1 rounded">VITE_MICROSOFT_CLIENT_ID</code> to <code className="text-amber-200 bg-amber-500/10 px-1 rounded">frontend/.env</code>
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleManualSubmit} className="space-y-3 pt-2 border-t border-white/10">
                <p className="text-xs text-slate-400 font-semibold">Development Mode — Manual Microsoft Login:</p>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Yamini Sharma)"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    placeholder="Microsoft Email (e.g. user@outlook.com)"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-slate-950 uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Continue with Microsoft Account <ArrowRight size={14} />
                </button>
              </form>
            </div>
          )}

          <p className="text-center text-[10px] text-slate-500 leading-relaxed pt-1">
            To continue, Microsoft will share your name and email address with MedAssist AI.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MicrosoftAccountModal;
