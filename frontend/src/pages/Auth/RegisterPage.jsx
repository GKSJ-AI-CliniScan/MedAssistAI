import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import { GoogleAccountModal } from './components/GoogleAccountModal';
import {
  AuthInput,
  PasswordStrengthMeter,
  SocialAuthButtons,
  AuthDivider,
  AuthSubmitButton,
  MobileBrand,
} from './components/AuthFormPrimitives';

export const RegisterPage = () => {
  const { register: registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      await registerUser(name, email, password);
      toast.success('Account created! Welcome to MedAssist AI.', { icon: '🏥' });
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.', { icon: '⚠️' });
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
                toast.success('Account created with Google! Redirecting…', { icon: '🔐' });
                setTimeout(() => navigate('/dashboard'), 600);
              } catch (err) {
                const msg = err?.response?.data?.detail || err.message || 'Google Sign-In failed.';
                toast.error(msg);
              }
            }
          },
        });
        window.google.accounts.id.prompt((notification) => {
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

  const fieldVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
  };

  return (
    <div className="min-h-screen flex bg-[#060913] text-white overflow-hidden">
      {/* ── Left illustration ── */}
      <AuthIllustrationPanel variant="register" />

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)', filter: 'blur(60px)' }}
        />

        <MobileBrand />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-3xl p-8 border border-white/8 shadow-glass-lg relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)' }}
            />

            <div className="flex justify-between items-start mb-7">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-3"
                >
                  <Zap size={11} /> Free Clinical Account
                </motion.div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Create account</h1>
                <p className="text-slate-400 text-sm mt-1">Start your AI-powered health journey</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck size={18} className="text-emerald-400" />
              </div>
            </div>

            {/* Social buttons */}
            <div className="mb-6">
              <SocialAuthButtons
                onGoogle={handleGoogleClick}
                onMicrosoft={handleMicrosoftClick}
              />
            </div>

            <div className="mb-5">
              <AuthDivider label="or register with email" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Full Name */}
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                <AuthInput
                  id="register-name"
                  label="Full Name"
                  placeholder="Dr. Jane Smith"
                  icon={User}
                  error={errors.name?.message}
                  {...register('name', { required: 'Full name is required' })}
                />
              </motion.div>

              {/* Email */}
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                <AuthInput
                  id="register-email"
                  label="Email Address"
                  type="email"
                  placeholder="name@gmail.com"
                  icon={Mail}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
                  })}
                />
              </motion.div>

              {/* Password */}
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="relative">
                  <AuthInput
                    id="register-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                  />
                </div>
                <PasswordStrengthMeter password={password} />
              </motion.div>

              {/* Confirm Password */}
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                <AuthInput
                  id="register-confirmPassword"
                  label="Confirm Password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  icon={Lock}
                  error={errors.confirmPassword?.message}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === password || 'Passwords do not match',
                  })}
                />
              </motion.div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register('terms', { required: 'You must accept the terms to continue' })}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-cyan-500 focus:ring-cyan-500/30 focus:ring-1 shrink-0"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.terms && <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.terms.message}</p>}
              </div>

              {/* Submit */}
              <AuthSubmitButton
                isLoading={isLoading}
                label={
                  <>
                    Create Clinical Account <ArrowRight size={16} />
                  </>
                }
                className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-450 hover:to-cyan-550 shadow-lg shadow-emerald-500/25 border-none"
              />
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">Sign in</Link>
            </p>
          </div>

          <p className="text-center text-[11px] text-slate-600 mt-5 leading-relaxed px-4">
            Protected by HIPAA-compliant encryption and ISO 27001 certified infrastructure.
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

export default RegisterPage;
