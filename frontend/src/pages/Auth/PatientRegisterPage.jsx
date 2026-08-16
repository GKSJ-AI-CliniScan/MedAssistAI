import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  User, Mail, Lock, Eye, EyeOff, Calendar, Phone, MapPin,
  HeartPulse, ShieldCheck, AlertCircle, ArrowRight, Activity, Pill
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import {
  AuthInput,
  PasswordStrengthMeter,
  AuthSubmitButton,
  MobileBrand
} from './components/AuthFormPrimitives';

export const PatientRegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gender: 'Male',
      bloodGroup: 'O+',
      city: 'Visakhapatnam',
      conditions: '',
      allergies: '',
      medications: '',
    }
  });

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Register on backend — authService.register saves the session automatically
      await registerUser(data.fullName, data.email, data.password, 'patient');

      // Save extended profile details to localStorage for display across pages
      const patientProfile = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        emergencyContact: data.emergencyContact,
        city: data.city,
        address: data.address,
        conditions: data.conditions,
        allergies: data.allergies,
        medications: data.medications,
        role: 'patient'
      };
      localStorage.setItem('medassist_patient_profile', JSON.stringify(patientProfile));

      // Registration successful — redirect to Patient Login page
      toast.success('Patient account registered successfully! Please log in with your credentials.', { icon: '🏥' });
      setTimeout(() => navigate('/patient-login'), 600);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err.message || 'Registration failed. Please try again.';
      toast.error(msg, { icon: '⚠️' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060913] text-white overflow-x-hidden">
      <AuthIllustrationPanel variant="register" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-10 relative overflow-y-auto max-h-screen">
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(70px)' }}
        />

        <MobileBrand />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-2xl py-6"
        >
          <div className="glass-card rounded-3xl p-6 sm:p-9 border border-white/8 shadow-glass-lg relative overflow-hidden space-y-6">
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.04) 0%, transparent 50%)' }}
            />

            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest mb-2">
                  <User size={11} /> Patient Onboarding
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Create Patient Account</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">Register for AI health analysis and clinical appointment scheduling</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <HeartPulse size={20} />
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Section 1: Basic Identity */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <User size={13} /> 1. Personal & Contact Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AuthInput
                    id="patient-name"
                    label="Full Name *"
                    placeholder="e.g. Ramesh Varma"
                    icon={User}
                    error={errors.fullName?.message}
                    {...register('fullName', { required: 'Full name is required' })}
                  />

                  <AuthInput
                    id="patient-dob"
                    label="Date of Birth *"
                    type="date"
                    icon={Calendar}
                    error={errors.dob?.message}
                    {...register('dob', { required: 'Date of birth is required' })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Gender *</label>
                    <select
                      {...register('gender', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                    >
                      <option value="Male" className="bg-slate-900">Male</option>
                      <option value="Female" className="bg-slate-900">Female</option>
                      <option value="Other" className="bg-slate-900">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Blood Group *</label>
                    <select
                      {...register('bloodGroup', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg} className="bg-slate-900">{bg}</option>
                      ))}
                    </select>
                  </div>

                  <AuthInput
                    id="patient-city"
                    label="City *"
                    placeholder="Visakhapatnam"
                    icon={MapPin}
                    error={errors.city?.message}
                    {...register('city', { required: 'City is required' })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AuthInput
                    id="patient-email"
                    label="Email Address *"
                    type="email"
                    placeholder="ramesh@gmail.com"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                    })}
                  />

                  <AuthInput
                    id="patient-phone"
                    label="Mobile Number *"
                    placeholder="+91 98765 43210"
                    icon={Phone}
                    error={errors.phone?.message}
                    {...register('phone', { required: 'Mobile number is required' })}
                  />
                </div>

                <AuthInput
                  id="patient-address"
                  label="Residential Address"
                  placeholder="Door No, Street Name, Landmark"
                  icon={MapPin}
                  {...register('address')}
                />
              </div>

              {/* Section 2: Medical Details */}
              <div className="space-y-3 pt-3 border-t border-white/8">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Activity size={13} /> 2. Medical Background & Emergency Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AuthInput
                    id="patient-emergency"
                    label="Emergency Contact (Name & Phone)"
                    placeholder="e.g. Smt. Lakshmi (+91 98765 11223)"
                    icon={Phone}
                    {...register('emergencyContact')}
                  />

                  <AuthInput
                    id="patient-allergies"
                    label="Known Allergies (if any)"
                    placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
                    icon={AlertCircle}
                    {...register('allergies')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AuthInput
                    id="patient-conditions"
                    label="Existing Medical Conditions"
                    placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
                    icon={Activity}
                    {...register('conditions')}
                  />

                  <AuthInput
                    id="patient-medications"
                    label="Current Medications"
                    placeholder="e.g. Metformin 500mg, Telmisartan 40mg"
                    icon={Pill}
                    {...register('medications')}
                  />
                </div>
              </div>

              {/* Section 3: Password & Security */}
              <div className="space-y-3 pt-3 border-t border-white/8">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Lock size={13} /> 3. Account Password
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <AuthInput
                      id="patient-password"
                      label="Password *"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      icon={Lock}
                      error={errors.password?.message}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' }
                      })}
                    />
                    <PasswordStrengthMeter password={password} />
                  </div>

                  <AuthInput
                    id="patient-confirm-password"
                    label="Confirm Password *"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    icon={Lock}
                    error={errors.confirmPassword?.message}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="text-slate-500 hover:text-slate-300"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (val) => val === password || 'Passwords do not match'
                    })}
                  />
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
                  <input
                    type="checkbox"
                    {...register('terms', { required: 'You must accept the terms of service' })}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-cyan-500 shrink-0"
                  />
                  <span>
                    I agree to the <span className="text-cyan-400 underline">Terms & Conditions</span> and understand this is for clinical support and wellness monitoring.
                  </span>
                </label>
                {errors.terms && <p className="text-xs text-rose-400">{errors.terms.message}</p>}

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
                  <input
                    type="checkbox"
                    {...register('privacy', { required: 'You must accept the privacy policy' })}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-cyan-500 shrink-0"
                  />
                  <span>
                    I consent to the <span className="text-cyan-400 underline">Privacy Policy</span> and HIPAA-compliant data storage.
                  </span>
                </label>
                {errors.privacy && <p className="text-xs text-rose-400">{errors.privacy.message}</p>}
              </div>

              <AuthSubmitButton
                isLoading={isLoading}
                loadingLabel="Registering Patient Account..."
                label={<>Complete Patient Registration <ArrowRight size={16} /></>}
                className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-450 hover:to-indigo-550 shadow-glow-primary/30 mt-4"
              />
            </form>

            <div className="pt-4 border-t border-white/8 text-center text-xs text-slate-400">
              Already have a patient account?{' '}
              <Link to="/patient-login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                Sign In to Patient Portal
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientRegisterPage;
