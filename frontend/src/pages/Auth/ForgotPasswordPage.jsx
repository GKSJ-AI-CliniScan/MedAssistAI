import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import {
  AuthInput,
  AuthSubmitButton,
  MobileBrand,
} from './components/AuthFormPrimitives';

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setIsLoading(true);
    try {
      await forgotPassword(email).catch(() => {});
      setSentEmail(email);
      setEmailSent(true);
      toast.success('Password reset instructions dispatched!', { icon: '📧' });
    } catch (err) {
      setSentEmail(email);
      setEmailSent(true);
      toast.info('If this email exists in our system, reset instructions have been sent.', { icon: '📧' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060913] text-white overflow-hidden">
      {/* ── Left illustration ── */}
      <AuthIllustrationPanel variant="forgot" />

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Ambient glow blobs */}
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
          <div className="glass-card rounded-3xl p-8 border border-white/8 shadow-glass-lg relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)' }}
            />

            {emailSent ? (
              /* ── Success State ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4 space-y-5"
              >
                {/* Animated checkmark */}
                <motion.div
                  className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mx-auto relative"
                  animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.3)', '0 0 0 20px rgba(16,185,129,0)', '0 0 0 0 rgba(16,185,129,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  >
                    <Send size={30} className="text-emerald-400" />
                  </motion.div>
                </motion.div>

                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Check your inbox</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We've sent a password reset link to{' '}
                    <span className="text-cyan-400 font-semibold">{sentEmail}</span>
                  </p>
                </div>

                <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-4 text-xs text-indigo-300 leading-relaxed text-left space-y-1.5">
                  <p className="font-bold text-indigo-200 mb-1">📋 What to do next:</p>
                  <p>1. Open the email from <strong>noreply@medassist.ai</strong></p>
                  <p>2. Click the "Reset Password" link (valid for 30 minutes)</p>
                  <p>3. Create a new strong password</p>
                  <p>4. Return here to sign in with your new credentials</p>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={() => { setEmailSent(false); setSentEmail(''); }}
                    className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-all focus:outline-none"
                  >
                    Try a different email
                  </button>
                  <button
                    onClick={() => navigate('/signin')}
                    className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-glow-primary/30 transition-all focus:outline-none flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Back to Portal Selection
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Form State ── */
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 text-amber-400 text-[10px] font-semibold uppercase tracking-wider mb-2.5"
                    >
                      <ShieldCheck size={11} /> Secure Password Recovery
                    </motion.div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">Reset Password</h1>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Enter the registered email address linked to your account. We'll send a secure reset link.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <AuthInput
                    id="forgot-email"
                    label="Registered Email Address"
                    type="email"
                    placeholder="name@hospital.com or patient@gmail.com"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                    })}
                  />

                  <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-3.5 text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Security Note:</strong> Reset links expire in 30 minutes and can only be used once for your security.
                  </div>

                  <AuthSubmitButton
                    isLoading={isLoading}
                    label={<>Send Reset Link <ArrowRight size={16} /></>}
                    className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-450 hover:to-indigo-550 shadow-glow-primary/30"
                  />
                </form>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/8 text-xs text-slate-400">
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 font-semibold transition-colors"
                  >
                    <ArrowLeft size={13} /> Back to Sign In
                  </Link>
                  <Link
                    to="/patient-register"
                    className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
