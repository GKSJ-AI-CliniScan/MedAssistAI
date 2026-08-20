import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, UserCheck, ShieldCheck, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FlowingMedicalBackground from '../../components/landing/FlowingMedicalBackground';
import { useAuth } from '../../context/AuthContext';
import { ROLE } from '../../constants/roles';

export default function RegisterPage() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case ROLE.ADMIN:
          navigate('/admin', { replace: true });
          break;
        case ROLE.DOCTOR:
          navigate('/doctor', { replace: true });
          break;
        case ROLE.PATIENT:
          navigate('/patient', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fullname || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register(fullname, email, password);
      setSuccessMessage('Registration successful. Please sign in with your new account.');
      // Clear password fields for security
      setPassword('');
      setConfirmPassword('');
      // Redirect to login page after short delay
      setTimeout(() => {
        navigate('/login', { state: { email } });
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('Email address is already registered. Please use a different email or sign in.');
      } else if (err.response) {
        setError('Registration failed. Please try again later.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#061426] text-white relative overflow-hidden">
      <FlowingMedicalBackground />

      {/* Main Registration Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl z-10 p-6 sm:p-8"
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#06B6D4]/20 text-[#06B6D4]">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">
                MedAssistAI
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#06B6D4] block -mt-0.5">
                AI-Powered Healthcare
              </span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        </div>

        {/* Form Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#06B6D4]/10 text-[#06B6D4] mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Patient Portal Only</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Create your patient account
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Start your health journey with MedAssistAI.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-xs font-medium text-red-300 bg-red-950/50 border border-red-800/40 flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg text-xs font-medium text-green-300 bg-green-950/50 border border-green-800/40 flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            disabled={loading}
            fullWidth
          />

          <Input 
            label="Email Address" 
            type="email"
            placeholder="john@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            fullWidth
          />

          <div className="relative">
            <Input 
              label="Password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              fullWidth
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-9 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <Input 
              label="Confirm Password" 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              fullWidth
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute right-3 top-9 text-white/60 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-3 py-2.5 text-sm gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:shadow-lg hover:shadow-[#06B6D4]/30" 
            disabled={loading}
          >
            <span>{loading ? 'Creating account...' : 'Create Patient Account'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-white/60 pt-4 border-t border-white/10">
          Already registered?{' '}
          <button 
            type="button"
            className="text-[#06B6D4] font-semibold hover:underline cursor-pointer ml-1" 
            onClick={() => navigate('/login')}
          >
            Sign in here
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/60">
          <ShieldCheck className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Protected application data</span>
        </div>
      </motion.div>
    </div>
  );
}
