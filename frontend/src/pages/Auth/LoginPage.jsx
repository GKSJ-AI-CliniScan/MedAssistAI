import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, HeartPulse, X, Settings, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import {
  AuthInput,
  SocialAuthButtons,
  AuthDivider,
  AuthSubmitButton,
  MobileBrand,
} from './components/AuthFormPrimitives';

// Get Google Client ID from .env or localStorage
const getStoredClientId = () => {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('medassist_google_client_id') || '';
};

export const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState(getStoredClientId());
  const [showClientIdModal, setShowClientIdModal] = useState(false);
  const [tempClientId, setTempClientId] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async ({ email, password, rememberMe }) => {
    setIsLoading(true);
    try {
      await login(email, password);
      if (rememberMe) localStorage.setItem('medassist_remember', email);
      toast.success('Welcome back! Redirecting to your dashboard…', { icon: '🏥', style: { fontWeight: 600 } });
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Authentication failed. Please try again.';
      toast.error(msg, { icon: '🔒' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Real Google OAuth Popup flow (like ChatGPT / Notion / Linear).
   * Opens Google's native account selection window displaying all accounts signed into the browser.
   */
  const handleGoogle = () => {
    const activeClientId = clientId || getStoredClientId();

    if (!activeClientId) {
      // Prompt user to enter their Google OAuth Client ID or use quick setup
      setShowClientIdModal(true);
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      toast.error('Google Sign-In library is loading. Please try again in 2 seconds.');
      return;
    }

    setIsLoading(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: activeClientId,
        scope: 'openid email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('Google OAuth error:', tokenResponse);
            toast.error(`Google Sign-In error: ${tokenResponse.error_description || tokenResponse.error}`);
            setIsLoading(false);
            return;
          }

          try {
            // Fetch user profile from Google UserInfo API using access token
            const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            
            if (!infoRes.ok) {
              throw new Error('Failed to retrieve profile from Google');
            }
            
            const userInfo = await infoRes.json();
            
            // Send user info to backend for JWT token creation
            const result = await loginWithGoogle(null, userInfo);
            toast.success(`Signed in as ${userInfo.name || userInfo.email}! Redirecting…`, { icon: '🔐' });
            setTimeout(() => navigate('/dashboard'), 800);
          } catch (err) {
            console.error('Backend Google login error:', err);
            const msg = err?.response?.data?.detail || 'Google authentication failed. Please try again.';
            toast.error(msg);
          } finally {
            setIsLoading(false);
          }
        },
        error_callback: (err) => {
          console.error('Google token client error:', err);
          toast.error('Google popup window was closed or blocked.');
          setIsLoading(false);
        }
      });

      // Launch native Google Account Chooser popup window
      client.requestAccessToken();
    } catch (err) {
      console.error('OAuth initialization error:', err);
      toast.error('Could not open Google Login popup. Please verify your Client ID.');
      setIsLoading(false);
    }
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    if (!tempClientId.trim()) return;
    const cleanId = tempClientId.trim();
    localStorage.setItem('medassist_google_client_id', cleanId);
    setClientId(cleanId);
    setShowClientIdModal(false);
    toast.success('Google Client ID saved! Click "Continue with Google" to test sign-in.', { icon: '🔑' });
  };

  const handleMicrosoft = () => {
    toast.info('Microsoft login is not yet configured. Please use email/password or Google Sign-In.', { autoClose: 4000 });
  };

  return (
    <div className="min-h-screen flex bg-[#060913] text-white overflow-hidden">
      {/* ── Left illustration ── */}
      <AuthIllustrationPanel variant="login" />

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(60px)' }}
        />

        <MobileBrand />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Glass card */}
          <div className="glass-card rounded-3xl p-8 border border-white/8 shadow-glass-lg relative overflow-hidden">
            {/* Card shine */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)' }}
            />

            {/* Header */}
            <div className="flex justify-between items-start mb-7">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 text-cyan-400 text-[10px] font-semibold uppercase tracking-wider mb-3"
                >
                  <ShieldCheck size={11} /> Secure Access Portal
                </motion.div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
                  Welcome back
                </h1>
                <p className="text-slate-400 text-sm mt-1">Sign in to your clinical account</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-indigo-600/15 border border-white/8 flex items-center justify-center">
                <HeartPulse size={18} className="text-cyan-400" />
              </div>
            </div>

            {/* Social buttons */}
            <div className="mb-6">
              <SocialAuthButtons
                onGoogle={handleGoogle}
                onMicrosoft={handleMicrosoft}
              />
            </div>

            {/* Divider */}
            <div className="mb-6">
              <AuthDivider />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <AuthInput
                id="login-email"
                label="Email Address"
                type="email"
                placeholder="name@hospital.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                })}
              />

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-xs font-semibold text-slate-300 tracking-wide">
                    Password
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <AuthInput
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  icon={Lock}
                  error={errors.password?.message}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-cyan-500 focus:ring-cyan-500/30 focus:ring-1"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
                  Remember me on this device
                </span>
              </label>

              {/* Demo hint */}
              <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300 leading-relaxed flex justify-between items-center">
                <div>
                  <span className="font-bold text-indigo-200">Demo Credentials: </span>
                  demo@medassist.ai / Password123
                </div>
                <button
                  type="button"
                  onClick={() => setShowClientIdModal(true)}
                  className="p-1 rounded text-xs text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 shrink-0"
                  title="Configure Google OAuth Client ID"
                >
                  <Key size={12} /> Google OAuth Config
                </button>
              </div>

              {/* Submit */}
              <AuthSubmitButton
                isLoading={isLoading}
                loadingLabel="Authenticating..."
                label={<>Sign In to Portal <ArrowRight size={16} /></>}
              />
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-slate-500 mt-5">
              New to MedAssist?{' '}
              <Link to="/auth/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                Create your account
              </Link>
            </p>
          </div>

          {/* HIPAA notice */}
          <p className="text-center text-[11px] text-slate-600 mt-5 leading-relaxed px-4">
            Protected by HIPAA-compliant encryption. By signing in, you agree to our{' '}
            <a href="#" className="text-slate-500 hover:text-slate-300 underline">Terms</a> and{' '}
            <a href="#" className="text-slate-500 hover:text-slate-300 underline">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>

      {/* ── GOOGLE CLIENT ID CONFIGURATION MODAL ── */}
      <AnimatePresence>
        {showClientIdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card rounded-3xl border border-white/10 p-6 max-w-md w-full shadow-2xl relative overflow-hidden space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Key size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">Google OAuth Client Setup</h3>
                    <p className="text-xs text-slate-400">Configure your Google Cloud OAuth Client ID</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClientIdModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                To launch the real native Google login popup window (displaying your actual desktop/browser Google accounts like ChatGPT), enter your Google OAuth 2.0 Client ID below:
              </p>

              <form onSubmit={handleSaveClientId} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Google OAuth Client ID
                  </label>
                  <input
                    type="text"
                    placeholder="1234567890-abcdef.apps.googleusercontent.com"
                    value={tempClientId}
                    onChange={(e) => setTempClientId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-slate-950 uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Save & Enable Google Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClientIdModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 leading-relaxed space-y-1">
                <p className="font-bold text-indigo-200">How to get a Google Client ID in 2 minutes:</p>
                <ol className="list-decimal list-inside space-y-1 text-[10px] text-slate-300">
                  <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">Google Cloud Console → Credentials</a></li>
                  <li>Click <b>Create Credentials → OAuth client ID</b> (Web Application)</li>
                  <li>Add <code className="text-cyan-300 bg-black/40 px-1 rounded">http://localhost:5173</code> to Authorized JavaScript origins</li>
                  <li>Copy & paste your Client ID above (or add to <code className="text-cyan-300 bg-black/40 px-1 rounded">frontend/.env</code> as <code className="text-cyan-300 bg-black/40 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code>)</li>
                </ol>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
