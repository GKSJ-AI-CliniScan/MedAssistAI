import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, HeartPulse, ArrowRight, ArrowLeft, User, Stethoscope, Shield, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FlowingMedicalBackground from '../../components/landing/FlowingMedicalBackground';
import { useAuth } from '../../context/AuthContext';
import { ROLE } from '../../constants/roles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLE.PATIENT);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email if coming from registration
  useEffect(() => {
    if (location?.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    try {
      const loggedInUser = await login(email, password, selectedRole);
      switch (loggedInUser.role) {
        case ROLE.ADMIN:
          navigate('/admin');
          break;
        case ROLE.DOCTOR:
          navigate('/doctor');
          break;
        case ROLE.PATIENT:
          navigate('/patient');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials. Login failed. Please check your email, password, and selected role.');
      } else if (err.response) {
        setError('Login failed. Please try again later.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#061426] text-white relative overflow-hidden">
      <FlowingMedicalBackground />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl z-10"
      >
        {/* LEFT BRANDING PANEL */}
        <div className="lg:col-span-5 p-8 md:p-10 bg-gradient-to-br from-[#2563EB]/20 via-[#06B6D4]/20 to-[#7C3AED]/20 text-white flex flex-col justify-between relative overflow-hidden border-r border-white/10">
          {/* Subtle ECG/Grid background overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#06B6D4_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-[#06B6D4]/20 backdrop-blur-md border border-[#06B6D4]/30">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 backdrop-blur-md">
                AI-Powered Healthcare
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-4">
              MedAssistAI
            </h1>
            <p className="text-[#06B6D4]/90 text-xs font-medium tracking-wide mt-1">
              Symptom Analysis & Disease Prediction
            </p>
          </div>

          {/* Visual Health HUD Graphic */}
          <div className="my-8 py-6 relative z-10 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 backdrop-blur-md shadow-2xl">
              <div className="absolute inset-2 rounded-full border border-dashed border-[#06B6D4]/40 animate-[spin_20s_linear_infinite]" />
              <Activity className="w-12 h-12 text-[#06B6D4] animate-pulse" />
              <span className="absolute bottom-2 text-[10px] uppercase font-bold text-[#06B6D4] tracking-wider">
                AI Active
              </span>
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs text-white/80 font-medium">Clinical Intelligence Engine</span>
              <p className="text-[11px] text-white/60 mt-0.5 max-w-xs">Real-time symptom verification & disease risk assessment modeling</p>
            </div>
          </div>

          {/* Footer tagline */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/70">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#06B6D4]" /> Secure Protocol
            </span>
            <span>v2.4 Clinical AI</span>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-[#061426]/50">
          <div className="max-w-md mx-auto w-full">
            {/* Back to Landing */}
            <button
              type="button"
              onClick={() => navigate('/landing')}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Welcome back
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Sign in to continue to MedAssistAI
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg text-xs font-medium text-red-300 bg-red-950/50 border border-red-800/40 flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input 
                label="Email Address" 
                placeholder="your-email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                fullWidth
              />

              {/* Role Selector */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-white tracking-wide">
                  Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  {[
                    { id: ROLE.PATIENT, label: 'Patient', icon: User },
                    { id: ROLE.DOCTOR, label: 'Doctor', icon: Stethoscope },
                    { id: ROLE.ADMIN, label: 'Admin', icon: Shield }
                  ].map((role) => {
                    const RoleIcon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        disabled={loading}
                        className={`
                          flex flex-col items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all duration-200
                          ${isSelected 
                            ? 'bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/50 shadow-sm' 
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        <RoleIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#06B6D4]' : ''}`} />
                        <span>{role.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

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

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full mt-3 py-2.5 text-sm gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:shadow-lg hover:shadow-[#06B6D4]/30" 
                disabled={loading}
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-white/60 pt-4 border-t border-white/10">
              Need an account?{' '}
              <button 
                type="button"
                className="text-[#06B6D4] font-semibold hover:underline cursor-pointer inline-flex items-center gap-0.5 ml-1" 
                onClick={() => navigate('/register')}
              >
                Register as Patient
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
