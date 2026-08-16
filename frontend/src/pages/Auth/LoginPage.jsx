import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import { GoogleAccountModal } from './components/GoogleAccountModal';
import { MicrosoftAccountModal } from './components/MicrosoftAccountModal';
import {
  AuthInput,
  AuthDivider,
  AuthSubmitButton,
  MobileBrand,
} from './components/AuthFormPrimitives';
import RippleButton from '../../components/ui/RippleButton';
import { authService } from '../../services/authService';

export const LoginPage = () => {
  const { login, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showMicrosoftModal, setShowMicrosoftModal] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async ({ email, password, rememberMe }) => {
    setIsLoading(true);
    const cleanEmail = (email || '').trim();
    try {
      const user = await login(cleanEmail, password);
      if (rememberMe) localStorage.setItem('medassist_remember', cleanEmail);
      toast.success('Welcome back! Redirecting to your dashboard…', { icon: '🏥', style: { fontWeight: 600 } });
      setTimeout(() => {
        if (user?.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      }, 400);
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Authentication failed. Please try again.';
      toast.error(msg, { icon: '🔒' });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Google Sign-In ──────────────────────────────────────────────── */
  const handleGoogleClick = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    // If client ID is configured and Google One‑Tap is available, use it.
    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              await loginWithGoogle(response.credential, null);
              toast.success('Signed in with Google! Redirecting…', { icon: '🔐' });
              setTimeout(() => navigate('/dashboard'), 600);
            }
          },
          auto_select: false,
        });
        window.google.accounts.id.prompt();
        return;
      } catch (e) {
        console.warn('[GoogleAuth] One‑Tap init failed, falling back to modal.', e);
      }
    }
    // No client ID or One‑Tap unavailable – show fallback modal.
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

  /* ── Microsoft Sign-In ──────────────────────────────────────────── */
  const handleMicrosoftClick = async () => {
    try {
      const authData = await authService.getMicrosoftAuthUrl();
      if (authData.configured && authData.url) {
        window.location.href = authData.url;
        return;
      }
    } catch (e) {
      console.warn('[MicrosoftAuth] Backend OAuth URL check failed, checking client keys…');
    }

    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    if (clientId) {
      const redirectUri = window.location.origin + '/auth/login';
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${encodeURIComponent(clientId)}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.read`;
      const popup = window.open(authUrl, 'MicrosoftSignInPopup', 'width=500,height=600');
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
              loginWithMicrosoft(token, null).then(() => {
                toast.success('Signed in with Microsoft! Redirecting…', { icon: '🔐' });
                setTimeout(() => navigate('/dashboard'), 600);
              }).catch((err) => {
                toast.error(err?.response?.data?.detail || 'Microsoft Sign-In failed.');
              });
            }
          }
        } catch (e) {}
      }, 500);
      return;
    }
    setShowMicrosoftModal(true);
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

            {/* ── FORM: Email + Password first ── */}
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


              {/* Submit — Sign In button */}
              <AuthSubmitButton
                isLoading={isLoading}
                loadingLabel="Authenticating..."
                label={<>Sign In to Portal <ArrowRight size={16} /></>}
              />
            </form>

            {/* ── DIVIDER ── */}
            <div className="my-5">
              <AuthDivider label="or continue with" />
            </div>

            {/* ── SOCIAL BUTTONS: Google + Microsoft (below form) ── */}
            <div className="flex gap-3">
              {/* Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleClick}
                aria-label="Sign in with Google"
                className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl
                  bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                  text-sm font-semibold text-slate-200 transition-all duration-200 group"
              >
                {/* Google coloured G */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C21.9752773,19.0373145 23.4545455,16.1459175 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013997 17.2662994,17.2118056 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                </svg>
                <span>Google</span>
              </button>

              {/* Continue with Microsoft */}
              <button
                type="button"
                onClick={handleMicrosoftClick}
                aria-label="Sign in with Microsoft"
                className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl
                  bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                  text-sm font-semibold text-slate-200 transition-all duration-200 group"
              >
                {/* Microsoft 4-colour grid */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M0 0h11.5v11.5H0z"/>
                  <path fill="#7FBA00" d="M12.5 0H24v11.5H12.5z"/>
                  <path fill="#00A4EF" d="M0 12.5h11.5V24H0z"/>
                  <path fill="#FFB900" d="M12.5 12.5H24V24H12.5z"/>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                Sign Up / Create Account
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

      {/* ── GOOGLE ACCOUNT SELECTOR MODAL (dev fallback) ── */}
      {/* The modal handles loginWithGoogle internally; onSelectAccount just navigates */}
      <GoogleAccountModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectAccount={() => {
          setShowGoogleModal(false);
          setTimeout(() => navigate('/dashboard'), 400);
        }}
      />

      {/* ── MICROSOFT ACCOUNT SELECTOR MODAL (dev fallback) ── */}
      {/* The modal handles loginWithMicrosoft internally; onSelectAccount just navigates */}
      <MicrosoftAccountModal
        isOpen={showMicrosoftModal}
        onClose={() => setShowMicrosoftModal(false)}
        onSelectAccount={() => {
          setShowMicrosoftModal(false);
          setTimeout(() => navigate('/dashboard'), 400);
        }}
      />
    </div>
  );
};

export default LoginPage;
