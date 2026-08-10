import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Mail, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

/**
 * Google Sign-In Modal
 * 
 * Strategy (in order of priority):
 * 1. Google Identity Services (GIS) "Sign in with Google" button  — gives a real id_token
 * 2. GIS OAuth2 token client popup                                — gives access_token → userinfo
 * 3. Manual email fallback                                        — for when no Client ID is configured
 */
export const GoogleAccountModal = ({ isOpen, onClose, onSelectAccount }) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const googleButtonRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Initialize Google Identity Services when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const initGIS = () => {
      if (!clientId) {
        console.warn('[GoogleAuth] No VITE_GOOGLE_CLIENT_ID configured. Showing manual fallback.');
        setShowManualFallback(true);
        return;
      }

      if (!window.google?.accounts?.id) {
        // GIS SDK not loaded yet — wait for it
        const timer = setTimeout(initGIS, 500);
        return () => clearTimeout(timer);
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        // Render the official "Sign in with Google" button
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: 340,
            logo_alignment: 'left',
          });
        }

        setGisReady(true);
      } catch (err) {
        console.error('[GoogleAuth] GIS initialization error:', err);
        setShowManualFallback(true);
      }
    };

    initGIS();
  }, [isOpen, clientId]);

  // Handle the credential response from Google GIS (id_token flow)
  const handleGoogleCredentialResponse = async (response) => {
    if (!response.credential) {
      toast.error('Google Sign-In did not return a credential. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // Send the real Google ID token to our backend
      await loginWithGoogle(response.credential, null);
      toast.success('Signed in with Google! Redirecting…', { icon: '🔐' });
      onClose();
      if (onSelectAccount) onSelectAccount();
    } catch (err) {
      console.error('[GoogleAuth] Login error:', err);
      const msg = err?.response?.data?.detail || err.message || 'Google Sign-In failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Fallback: Use OAuth2 token client to get access_token → fetch userinfo
  const handleOAuth2Fallback = () => {
    if (!clientId || !window.google?.accounts?.oauth2) {
      setShowManualFallback(true);
      return;
    }

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('[GoogleAuth] OAuth2 error:', tokenResponse);
            toast.error('Google authorization failed. Please try again.');
            return;
          }

          setLoading(true);
          try {
            const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const userInfo = await infoRes.json();
            await loginWithGoogle(null, userInfo);
            toast.success(`Signed in as ${userInfo.name || userInfo.email}! Redirecting…`, { icon: '🔐' });
            onClose();
            if (onSelectAccount) onSelectAccount();
          } catch (err) {
            console.error('[GoogleAuth] UserInfo fetch error:', err);
            toast.error('Failed to retrieve Google account info.');
          } finally {
            setLoading(false);
          }
        },
      });
      tokenClient.requestAccessToken();
    } catch (err) {
      console.error('[GoogleAuth] OAuth2 init error:', err);
      setShowManualFallback(true);
    }
  };

  // Manual email fallback (for development without Client ID)
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualEmail.trim() || !manualName.trim()) {
      toast.warning('Please enter your name and Google email.');
      return;
    }

    setLoading(true);
    try {
      const userInfo = {
        email: manualEmail.trim(),
        name: manualName.trim(),
        picture: '',
        sub: `manual_google_${Date.now()}`,
      };
      await loginWithGoogle(null, userInfo);
      toast.success(`Signed in as ${manualName.trim()}! Redirecting…`, { icon: '🔐' });
      onClose();
      if (onSelectAccount) onSelectAccount();
    } catch (err) {
      console.error('[GoogleAuth] Manual login error:', err);
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
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C21.9752773,19.0373145 23.4545455,16.1459175 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013997 17.2662994,17.2118056 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Sign in with Google</h3>
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
              <span className="ml-3 text-sm text-slate-300">Authenticating with Google…</span>
            </div>
          )}

          {/* Google Identity Services Button (primary) */}
          {!loading && clientId && (
            <div className="space-y-3">
              {/* Official GIS rendered button */}
              <div
                ref={googleButtonRef}
                className="flex items-center justify-center min-h-[44px]"
              />

              {/* OAuth2 popup fallback button */}
              <button
                type="button"
                onClick={handleOAuth2Fallback}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-400 font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                </svg>
                Use Google Account Popup Instead
              </button>
            </div>
          )}

          {/* No Client ID configured — show warning + manual fallback */}
          {!loading && !clientId && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 leading-relaxed">
                  <p className="font-bold mb-1">Google OAuth Client ID not configured</p>
                  <p className="text-amber-300/80">
                    To enable real Google Sign-In, add your <code className="text-amber-200 bg-amber-500/10 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> to <code className="text-amber-200 bg-amber-500/10 px-1 rounded">frontend/.env</code>
                  </p>
                </div>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3 pt-2 border-t border-white/10">
                <p className="text-xs text-slate-400 font-semibold">Development Mode — Manual Google Login:</p>
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
                    placeholder="Google Email (e.g. yamini@gmail.com)"
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
                  Continue with Google Account <ArrowRight size={14} />
                </button>
              </form>
            </div>
          )}

          {/* Manual fallback (when GIS fails even with client ID) */}
          {!loading && clientId && showManualFallback && (
            <form onSubmit={handleManualSubmit} className="space-y-3 pt-2 border-t border-white/10">
              <p className="text-xs text-slate-400">Having trouble? Enter your Google account manually:</p>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full Name"
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
                  placeholder="Google Email"
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
                Sign In <ArrowRight size={14} />
              </button>
            </form>
          )}

          <p className="text-center text-[10px] text-slate-500 leading-relaxed pt-1">
            To continue, Google will share your name, email address, and profile picture with MedAssist AI.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GoogleAccountModal;
