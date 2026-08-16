import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Stethoscope, Award, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import { GoogleAccountModal } from './components/GoogleAccountModal';
import { MicrosoftAccountModal } from './components/MicrosoftAccountModal';
import {
  AuthInput,
  AuthDivider,
  AuthSubmitButton,
  MobileBrand,
  SocialAuthButtons,
} from './components/AuthFormPrimitives';
import { authService } from '../../services/authService';

export const DoctorLoginPage = () => {
  const { login, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showMicrosoftModal, setShowMicrosoftModal] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const fillDemoCredentials = () => {
    setValue('email', 'doctor@medassist.ai');
    setValue('password', 'Password123');
    setAuthError(null);
  };

  const onSubmit = async ({ email, password, rememberMe }) => {
    setIsLoading(true);
    setAuthError(null);
    const cleanEmail = (email || '').trim();
    try {
      const user = await login(cleanEmail, password, 'doctor');
      if (rememberMe) localStorage.setItem('medassist_remember', cleanEmail);
      toast.success(`Welcome, ${user?.full_name || 'Doctor'}! Loading Clinical Dashboard…`, { icon: '🩺' });
      setTimeout(() => {
        navigate('/doctor-dashboard');
      }, 300);
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Login failed. Please try again.';
      setAuthError(msg);
      toast.error(msg, { icon: '⚠️' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              await loginWithGoogle(response.credential, null, 'doctor');
              toast.success('Doctor authenticated with Google! Redirecting…', { icon: '🔐' });
              setTimeout(() => navigate('/doctor-dashboard'), 400);
            }
          },
          auto_select: false,
        });
        window.google.accounts.id.prompt();
        return;
      } catch (e) {
        console.warn('[GoogleAuth] Falling back to modal:', e);
      }
    }
    setShowGoogleModal(true);
  };

  const handleMicrosoftClick = async () => {
    try {
      const authData = await authService.getMicrosoftAuthUrl();
      if (authData.configured && authData.url) {
        window.location.href = authData.url;
        return;
      }
    } catch (e) {}
    setShowMicrosoftModal(true);
  };

  return (
    <div className="min-h-screen flex bg-[#060913] text-white overflow-hidden">
      <AuthIllustrationPanel variant="login" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(70px)' }}
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
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 50%)' }}
            />

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-1.5 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider mb-2"
                >
                  <Award size={11} /> Clinical Practitioner Portal
                </motion.div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Doctor Login</h1>
                <p className="text-slate-400 text-xs mt-0.5">Sign in with your clinical credentials or Medical ID</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Stethoscope size={18} />
              </div>
            </div>

            {/* Error Banner if account not found */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-medium">{authError}</p>
                  </div>
                  <Link
                    to="/doctor-register"
                    className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 font-bold transition-all text-xs"
                  >
                    <UserPlus size={13} /> Register as Doctor Now
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Demo Account Quick Fill */}
            <div className="mb-4">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full py-2 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm group"
              >
                <span>⚡ Auto-fill Demo Doctor Credentials</span>
                <span className="text-[10px] text-indigo-400/70 group-hover:text-indigo-200 font-mono">(doctor@medassist.ai)</span>
              </button>
            </div>

            {/* Doctor Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <AuthInput
                id="doctor-email"
                label="Doctor Email or Medical ID"
                type="text"
                placeholder="dr.sharma@hospital.com or MED-8942"
                icon={Mail}
                error={errors.email?.message}
                {...register('email', { required: 'Please enter your registered clinical email or Medical ID' })}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="doctor-password" className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <AuthInput
                  id="doctor-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your security credentials"
                  icon={Lock}
                  error={errors.password?.message}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  {...register('password', { required: 'Password is required' })}
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-indigo-500 focus:ring-indigo-500/30 focus:ring-1"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
                  Remember me on this workstation
                </span>
              </label>

              <AuthSubmitButton
                isLoading={isLoading}
                label={<>Sign In to Doctor Dashboard <ArrowRight size={16} /></>}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-450 hover:to-purple-550 shadow-glow-secondary/30"
              />
            </form>

            <div className="my-5">
              <AuthDivider label="or sign in with" />
            </div>

            <SocialAuthButtons
              onGoogle={handleGoogleClick}
              onMicrosoft={handleMicrosoftClick}
            />

            <div className="pt-6 mt-6 border-t border-white/8 text-center space-y-2 text-xs">
              <p className="text-slate-400">
                New clinical practitioner?{' '}
                <Link to="/doctor-register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                  Doctor Registration / Sign Up
                </Link>
              </p>
              <p className="text-slate-500">
                Are you a patient?{' '}
                <Link to="/patient-login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                  Patient Login
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-600 mt-5 leading-relaxed">
            Medical Practitioner Portal • Authorized Healthcare Personnel Only
          </p>
        </motion.div>
      </div>

      <GoogleAccountModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectAccount={() => {
          setShowGoogleModal(false);
          setTimeout(() => navigate('/doctor-dashboard'), 400);
        }}
      />

      <MicrosoftAccountModal
        isOpen={showMicrosoftModal}
        onClose={() => setShowMicrosoftModal(false)}
        onSelectAccount={() => {
          setShowMicrosoftModal(false);
          setTimeout(() => navigate('/doctor-dashboard'), 400);
        }}
      />
    </div>
  );
};

export default DoctorLoginPage;
