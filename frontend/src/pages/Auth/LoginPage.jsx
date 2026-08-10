import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import { GoogleAccountModal } from './components/GoogleAccountModal';
import {
  AuthInput,
  SocialAuthButtons,
  AuthDivider,
  AuthSubmitButton,
  MobileBrand,
} from './components/AuthFormPrimitives';

export const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async ({ email, password, rememberMe }) => {
    setIsLoading(true);
    try {
      await login(email, password);
      if (rememberMe) localStorage.setItem('medassist_remember', email);
      toast.success('Welcome back! Redirecting to your dashboard…', { icon: '🏥', style: { fontWeight: 600 } });
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Authentication failed. Please try again.';
      toast.error(msg, { icon: '🔒' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Strategy 1: Google Identity Services One Tap / Popup (id_token flow)
    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              try {
                await loginWithGoogle(response.credential, null);
                toast.success('Signed in with Google! Redirecting…', { icon: '🔐' });
                setTimeout(() => navigate('/dashboard'), 600);
              } catch (err) {
                const msg = err?.response?.data?.detail || err.message || 'Google Sign-In failed.';
                toast.error(msg);
              }
            }
          },
        });
        window.google.accounts.id.prompt((notification) => {
          // If One Tap is dismissed or not displayed, fall through to OAuth2 popup
          if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
            handleGoogleOAuth2Popup(clientId);
          }
        });
        return;
      } catch (e) {
        console.warn('[GoogleAuth] One Tap failed, trying OAuth2 popup:', e);
      }
    }

    // Strategy 2: OAuth2 token client popup (access_token → userinfo)
    if (clientId && window.google?.accounts?.oauth2) {
      handleGoogleOAuth2Popup(clientId);
      return;
    }

    // Strategy 3: Open the GoogleAccountModal (manual fallback)
    setShowGoogleModal(true);
  };

  const handleGoogleOAuth2Popup = (clientId) => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (tokenResponse) => {
          if (!tokenResponse.error) {
            try {
              const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const userInfo = await infoRes.json();
              await loginWithGoogle(null, userInfo);
              toast.success(`Signed in as ${userInfo.name || userInfo.email}! Redirecting…`, { icon: '🔐' });
              setTimeout(() => navigate('/dashboard'), 600);
            } catch (err) {
              toast.error('Google Sign-In failed. Please try again.');
            }
          }
        },
      });
      client.requestAccessToken();
    } catch (e) {
      console.warn('[GoogleAuth] OAuth2 popup failed, opening modal:', e);
      setShowGoogleModal(true);
    }
  };

  const handleMicrosoftClick = () => {
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
                onGoogle={handleGoogleClick}
                onMicrosoft={handleMicrosoftClick}
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

      {/* ── GOOGLE ACCOUNT SELECTOR MODAL ── */}
      <GoogleAccountModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectAccount={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default LoginPage;
