import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowRight, ShieldCheck, HeartPulse, Sparkles, Building2 } from 'lucide-react';
import AuthIllustrationPanel from './components/AuthIllustrationPanel';
import { MobileBrand } from './components/AuthFormPrimitives';
import RippleButton from '../../components/ui/RippleButton';

export const RoleSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-[#060913] text-white overflow-hidden">
      {/* Left illustration */}
      <AuthIllustrationPanel variant="login" />

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(70px)' }}
        />

        <MobileBrand />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-lg"
        >
          {/* Main Card */}
          <div className="glass-card rounded-3xl p-8 border border-white/8 shadow-glass-lg relative overflow-hidden space-y-7">
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)' }}
            />

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-500/20 text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest">
                <ShieldCheck size={12} /> MedAssist AI Healthcare Gateway
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Select Your Portal
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Choose your role to access your dedicated clinical workspace
              </p>
            </div>

            {/* Role Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient Role Card */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/patient-login')}
                className="p-6 rounded-3xl bg-gradient-to-b from-cyan-500/10 via-slate-900/60 to-slate-950/80 border border-cyan-500/30 hover:border-cyan-400/60 cursor-pointer flex flex-col justify-between space-y-4 group transition-all shadow-glow-primary/10 hover:shadow-glow-primary/30"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-glow-primary group-hover:scale-110 transition-transform">
                    <User size={22} />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-400 block">
                      Individual & Family
                    </span>
                    <h2 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      Patient Portal
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Symptom analysis, disease risk checks, lab reports, and certified doctor appointments.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>Login as Patient</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>

              {/* Doctor Role Card */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/doctor-login')}
                className="p-6 rounded-3xl bg-gradient-to-b from-indigo-500/10 via-slate-900/60 to-slate-950/80 border border-indigo-500/30 hover:border-indigo-400/60 cursor-pointer flex flex-col justify-between space-y-4 group transition-all shadow-glow-secondary/10 hover:shadow-glow-secondary/30"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-glow-secondary group-hover:scale-110 transition-transform">
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 block">
                      Licensed Practitioner
                    </span>
                    <h2 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                      Doctor Portal
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Patient consultations, clinical diagnostics, schedule management, and medical case reviews.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>Login as Doctor</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </div>

            {/* Registration Direct Links */}
            <div className="pt-2 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>New to MedAssist AI?</span>
              <div className="flex items-center gap-3">
                <Link
                  to="/patient-register"
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                >
                  Register as Patient
                </Link>
                <span className="text-slate-600">•</span>
                <Link
                  to="/doctor-register"
                  className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  Register as Doctor
                </Link>
              </div>
            </div>
          </div>

          {/* Security note */}
          <p className="text-center text-[11px] text-slate-600 mt-5 leading-relaxed">
            Protected by HIPAA-compliant 256-bit encryption and ISO 27001 certified clinical infrastructure.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelectPage;
