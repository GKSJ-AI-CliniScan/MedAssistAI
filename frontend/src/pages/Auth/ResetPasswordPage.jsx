import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import {
  AuthInput,
  PasswordStrengthMeter,
  AuthSubmitButton,
  MobileBrand,
} from './components/AuthFormPrimitives';

export const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const newPassword = watch('newPassword', '');

  const requirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'One number', met: /[0-9]/.test(newPassword) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(newPassword) }
  ];

  const onSubmit = async ({ newPassword }) => {
    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      setIsSuccess(true);
      toast.success('Password updated successfully!', { icon: '🔐' });
    } catch (err) {
      toast.error(err.message || 'Failed to reset password. Try again.', { icon: '⚠️' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060913] text-white relative overflow-hidden">
      {/* ── Left illustration ── */}
      <AuthIllustrationPanel variant="reset" />

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Ambient glows */}
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

            {isSuccess ? (
              /* ── Success State ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4 space-y-5"
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mx-auto"
                  animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.3)', '0 0 0 20px rgba(16,185,129,0)', '0 0 0 0 rgba(16,185,129,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  >
                    <CheckCircle2 size={34} className="text-emerald-400" />
                  </motion.div>
                </motion.div>

                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Password Updated</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Your clinical account password has been successfully changed. You can now sign in with your new credentials.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'HIPAA-Encrypted', icon: '🔒' },
                    { label: 'Password Hashed', icon: '🛡️' },
                    { label: 'Audit Logged', icon: '📋' },
                    { label: 'Sessions Cleared', icon: '✅' }
                  ].map(({ label, icon }) => (
                    <div key={label} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-2.5">
                      <span>{icon}</span>
                      <span className="text-[11px] text-emerald-300 font-semibold">{label}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/auth/login')}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 focus:outline-none"
                >
                  Sign In with New Password <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            ) : (
              /* ── Form State ── */
              <>
                <div className="mb-7">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 text-cyan-400 text-[10px] font-semibold uppercase tracking-wider mb-3"
                  >
                    <ShieldCheck size={11} /> Secure Password Reset
                  </motion.div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-white">Create new password</h1>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    Set a strong, unique password for your clinical account.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  {/* New Password */}
                  <div>
                    <AuthInput
                      id="reset-newPassword"
                      label="New Password"
                      type={showNew ? 'text' : 'password'}
                      placeholder="Enter new password"
                      icon={Lock}
                      error={errors.newPassword?.message}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                        >
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                      {...register('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        pattern: { value: /^(?=.*[A-Z])(?=.*\d)/, message: 'Must contain uppercase letter and number' }
                      })}
                    />
                    <PasswordStrengthMeter password={newPassword} />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <AuthInput
                      id="reset-confirmPassword"
                      label="Confirm New Password"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      icon={Lock}
                      error={errors.confirmPassword?.message}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: v => v === newPassword || 'Passwords do not match'
                      })}
                    />
                  </div>

                  {/* Requirements checklist */}
                  <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Password Requirements</p>
                    <div className="grid grid-cols-2 gap-2">
                      {requirements.map(({ label, met }) => (
                        <motion.div
                          key={label}
                          className={`flex items-center gap-2 text-[11px] font-medium transition-colors duration-300 ${met ? 'text-emerald-400' : 'text-slate-500'}`}
                          animate={{ scale: met ? [1, 1.05, 1] : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 border transition-all duration-300 ${met ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'border-white/15 text-transparent'}`}>
                            {met ? '✓' : ''}
                          </span>
                          {label}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <AuthSubmitButton
                    isLoading={isLoading}
                    label={<>Set New Password <ArrowRight size={16} /></>}
                    className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-450 hover:to-indigo-550 shadow-lg shadow-cyan-500/25 border-none"
                  />
                </form>

                <div className="flex justify-center mt-5">
                  <Link to="/auth/login" className="text-xs text-slate-400 hover:text-cyan-400 font-semibold transition-colors">
                    ← Back to Sign In
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

export default ResetPasswordPage;
