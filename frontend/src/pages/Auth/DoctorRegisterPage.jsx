import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Stethoscope, Mail, Lock, Eye, EyeOff, Building2, Phone, MapPin,
  ShieldCheck, Award, AlertCircle, ArrowRight, Briefcase, GraduationCap, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import {
  AuthInput,
  PasswordStrengthMeter,
  AuthSubmitButton,
  MobileBrand
} from './components/AuthFormPrimitives';

export const DoctorRegisterPage = () => {
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
      specialization: 'General Physician',
      qualification: 'MBBS, MD',
      experience: 8,
      hospital: 'Apollo Care Hospital, Visakhapatnam',
      city: 'Visakhapatnam',
      consultationType: 'Both (In-person & Online)',
    }
  });

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const displayName = data.fullName.startsWith('Dr.') ? data.fullName : `Dr. ${data.fullName}`;
      const doctorProfile = {
        name: displayName,
        email: data.email,
        phone: data.phone,
        medRegNo: data.medRegNo,
        specialization: data.specialization,
        qualification: data.qualification,
        experience: Number(data.experience) || 0,
        hospital: data.hospital,
        city: data.city,
        consultationType: data.consultationType,
        consultationFee: Number(data.fee) || 0,
        verificationStatus: 'Verification Pending',
        role: 'doctor'
      };

      // Register on backend — authService.register saves the session automatically
      await registerUser(displayName, data.email, data.password, 'doctor');
      localStorage.setItem('medassist_doctor_profile', JSON.stringify(doctorProfile));

      // Registration successful — redirect to Doctor Login page
      toast.success('Doctor credentials registered successfully! Please log in to access the clinical portal.', { icon: '🩺' });
      setTimeout(() => navigate('/doctor-login'), 600);
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
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(70px)' }}
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
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, transparent 50%)' }}
            />

            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest mb-2">
                  <Award size={11} /> Medical Practitioner Registration
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Register as Doctor</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">Join the accredited MedAssist AI clinical network</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Stethoscope size={20} />
              </div>
            </div>

            {/* Verification Notice Badge */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Practitioner Verification Notice</span>
                <span className="text-[11px] text-slate-300">New doctor accounts are granted instant demo access with a <strong className="text-amber-300 font-bold">Verification Pending</strong> status while medical credentials are reviewed.</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Section 1: Doctor Profile */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Stethoscope size={13} /> 1. Professional Identity & License
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AuthInput
                    id="doctor-fullname"
                    label="Doctor Full Name *"
                    placeholder="e.g. Dr. Rahul Sharma"
                    icon={Stethoscope}
                    error={errors.fullName?.message}
                    {...register('fullName', { required: 'Doctor name is required' })}
                  />

                  <AuthInput
                    id="doctor-medregno"
                    label="Medical Registration Number (MCI/NMC) *"
                    placeholder="e.g. AP-MCI-98421"
                    icon={Award}
                    error={errors.medRegNo?.message}
                    {...register('medRegNo', { required: 'Medical registration number is required' })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Specialization *</label>
                    <select
                      {...register('specialization', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
                    >
                      <option value="General Physician" className="bg-slate-900">General Physician</option>
                      <option value="Cardiologist" className="bg-slate-900">Cardiologist</option>
                      <option value="Dermatologist" className="bg-slate-900">Dermatologist</option>
                      <option value="Neurologist" className="bg-slate-900">Neurologist</option>
                      <option value="Pediatrician" className="bg-slate-900">Pediatrician</option>
                      <option value="Orthopedic Surgeon" className="bg-slate-900">Orthopedic Surgeon</option>
                      <option value="ENT Specialist" className="bg-slate-900">ENT Specialist</option>
                      <option value="Gynecologist" className="bg-slate-900">Gynecologist</option>
                    </select>
                  </div>

                  <AuthInput
                    id="doctor-qualification"
                    label="Qualification Degrees *"
                    placeholder="e.g. MBBS, MD (Medicine), DM"
                    icon={GraduationCap}
                    error={errors.qualification?.message}
                    {...register('qualification', { required: 'Qualifications are required' })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <AuthInput
                    id="doctor-experience"
                    label="Years of Experience *"
                    type="number"
                    placeholder="10"
                    icon={Briefcase}
                    error={errors.experience?.message}
                    {...register('experience', { required: 'Experience is required' })}
                  />

                  <AuthInput
                    id="doctor-fee"
                    label="Consultation Fee (₹)"
                    type="number"
                    placeholder="700"
                    icon={Briefcase}
                    {...register('fee')}
                  />

                  <AuthInput
                    id="doctor-city"
                    label="Practice City *"
                    placeholder="Visakhapatnam"
                    icon={MapPin}
                    error={errors.city?.message}
                    {...register('city', { required: 'City is required' })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AuthInput
                    id="doctor-hospital"
                    label="Affiliated Hospital / Clinic *"
                    placeholder="e.g. Apollo Care Hospital, Visakhapatnam"
                    icon={Building2}
                    error={errors.hospital?.message}
                    {...register('hospital', { required: 'Hospital affiliation is required' })}
                  />

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Consultation Type *</label>
                    <select
                      {...register('consultationType', { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
                    >
                      <option value="Both (In-person & Online)" className="bg-slate-900">Both (In-person & Online)</option>
                      <option value="In-person Only" className="bg-slate-900">In-person Only</option>
                      <option value="Online Video Only" className="bg-slate-900">Online Video Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Login Credentials */}
              <div className="space-y-3 pt-3 border-t border-white/8">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Mail size={13} /> 2. Clinical Contact & Access Security
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AuthInput
                    id="doctor-email"
                    label="Official Medical Email *"
                    type="email"
                    placeholder="dr.rahul@medassist.ai"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Medical email is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                    })}
                  />

                  <AuthInput
                    id="doctor-phone"
                    label="Contact Phone *"
                    placeholder="+91 98765 88990"
                    icon={Phone}
                    error={errors.phone?.message}
                    {...register('phone', { required: 'Phone is required' })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <AuthInput
                      id="doctor-password"
                      label="Password *"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create practitioner password"
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
                    id="doctor-confirm-password"
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

              {/* Code of Ethics Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
                  <input
                    type="checkbox"
                    {...register('ethics', { required: 'You must confirm professional registration' })}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-indigo-500 shrink-0"
                  />
                  <span>
                    I certify that I am a registered medical practitioner and agree to MedAssist AI's Clinical Code of Ethics and Teleconsultation Guidelines.
                  </span>
                </label>
                {errors.ethics && <p className="text-xs text-rose-400 mt-1">{errors.ethics.message}</p>}
              </div>

              <AuthSubmitButton
                isLoading={isLoading}
                loadingLabel="Registering Doctor Profile..."
                label={<>Submit Practitioner Application <ArrowRight size={16} /></>}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-450 hover:to-purple-550 shadow-glow-secondary/30 mt-4"
              />
            </form>

            <div className="pt-4 border-t border-white/8 text-center text-xs text-slate-400">
              Already registered as a Doctor?{' '}
              <Link to="/doctor-login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                Sign In to Doctor Portal
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;
