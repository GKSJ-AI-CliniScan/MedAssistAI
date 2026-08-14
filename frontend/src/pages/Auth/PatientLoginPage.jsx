import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck, HeartPulse } from 'lucide-react';
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

export const PatientLoginPage = () => {
  const { login, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showMicrosoftModal, setShowMicrosoftModal] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async ({ email, password, rememberMe }) => {
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (rememberMe) localStorage.setItem('medassist_remember', email);
      toast.success('Welcome back! Loading Patient Portal…', { icon: '🏥' });
      setTimeout(() => {
        if (user?.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      }, 500);
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Authentication failed. Please verify credentials.';
      toast.error(msg, { icon: '🔒' });
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
              await loginWithGoogle(response.credential, null);
              toast.success('Signed in with Google! Redirecting…', { icon: '🔐' });
              setTimeout(() => navigate('/patient-dashboard'), 500);
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
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(70px)' }}
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
              style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.05) 0%, transparent 50%)' }}
            />

            {/* Header */}
            <div className="flex justify-between items-start mb-7">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 text-cyan-400 text-[10px] font-extrabold uppercase tracking-wider mb-2.5"
                >
                  <User size={11} /> Patient Access
                </motion.div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Patient Login</h1>
                <p className="text-slate-400 text-xs mt-1">Sign in to your patient health record</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <HeartPulse size={18} />
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <AuthInput
                id="patient-email"
                label="Email Address or Mobile"
                type="text"
                placeholder="patient@gmail.com or 9876543210"
                icon={Mail}
                error={errors.email?.message}
                {...register('email', { required: 'Please enter your registered email or phone' })}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="patient-password" className="text-xs font-semibold text-slate-300">
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
                  id="patient-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-cyan-500 focus:ring-cyan-500/30 focus:ring-1"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
                  Remember me on this device
                </span>
              </label>

              <AuthSubmitButton
                isLoading={isLoading}
                loadingLabel="Authenticating..."
                label={<>Sign In as Patient <ArrowRight size={16} /></>}
                className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-450 hover:to-indigo-550 shadow-glow-primary/30"
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
                Don't have a patient account?{' '}
                <Link to="/patient-register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                  Create Patient Account
                </Link>
              </p>
              <p className="text-slate-500">
                Are you a healthcare professional?{' '}
                <Link to="/doctor-login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                  Doctor Login
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-600 mt-5 leading-relaxed">
            Protected by HIPAA-compliant encryption.
          </p>
        </motion.div>
      </div>

      <GoogleAccountModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectAccount={() => {
          setShowGoogleModal(false);
          setTimeout(() => navigate('/patient-dashboard'), 400);
        }}
      />

      <MicrosoftAccountModal
        isOpen={showMicrosoftModal}
        onClose={() => setShowMicrosoftModal(false)}
        onSelectAccount={() => {
          setShowMicrosoftModal(false);
          setTimeout(() => navigate('/patient-dashboard'), 400);
        }}
      />
    </div>
  );
};

export default PatientLoginPage;
