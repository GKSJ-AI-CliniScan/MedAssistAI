import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Stethoscope, FileText, Brain, HeartPulse, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Components
import StatCards from '../../components/dashboard/StatCards';
import QuickActionsGrid from '../../components/dashboard/QuickActionsGrid';
import PatientTable from '../../components/dashboard/PatientTable';
import AIInsightsPanel from '../../components/dashboard/AIInsightsPanel';
import DiseaseAnalyticsCharts from '../../components/dashboard/DiseaseAnalyticsCharts';
import EmergencyPanel from '../../components/dashboard/EmergencyPanel';
import RecentActivity from '../../components/dashboard/RecentActivity';
import AppointmentsWidget from '../../components/dashboard/AppointmentsWidget';
import MedicationReminders from '../../components/dashboard/MedicationReminders';
import RightPanel from '../../components/dashboard/RightPanel';
import FloatingAssistant from '../../components/dashboard/FloatingAssistant';
import CircularGauge from '../../components/common/CircularGauge';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-6 pb-12"
    >
      {/* ── TOP HERO BANNER ── */}
      <motion.div
        variants={pageVariants}
        className="glass-card rounded-3xl p-6.5 border border-white/8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        {/* Animated Neon Orb Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-650/5 to-transparent pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        <div className="space-y-3.5 max-w-2xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles size={11} className="animate-pulse" /> Clinical Workspace Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Welcome to MedAssist AI
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            Monitor patient health, analyze symptoms using artificial intelligence, predict disease risks, and generate clinical reports from one unified healthcare command center.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1.5">
            <button
              onClick={() => navigate('/symptoms')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-450 hover:to-indigo-550 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none"
            >
              <Stethoscope size={13} className="text-slate-950" /> Start Analysis
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-bold text-[11px] uppercase tracking-wider transition-all duration-300 focus:outline-none"
            >
              <FileText size={13} className="text-slate-400" /> View Reports
            </button>
          </div>
        </div>

        {/* Graphic AI Animation Visual */}
        <div className="w-32 h-32 relative shrink-0 mx-auto md:mx-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            className="absolute inset-0 border border-dashed border-cyan-500/20 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute inset-4 bg-gradient-to-tr from-cyan-500/10 to-indigo-600/15 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 shadow-glow-primary/10"
          >
            <Brain size={42} className="animate-pulse" />
          </motion.div>
        </div>
      </motion.div>

      {/* ── SUMMARY STAT CARDS ── */}
      <StatCards />

      {/* ── QUICK ACCESS MODULES ── */}
      <QuickActionsGrid />

      {/* ── MAIN DASHBOARD GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left 3 columns: Interactive Tables, AI Insights & Charts */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* AI Circular Gauge Panel */}
          <section className="glass-card rounded-3xl border border-white/8 p-5">
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-around">
              <CircularGauge value={86} size={130} strokeWidth={9} color="#06b6d4" label="Overall Health Index" sublabel="WELLNESS" />
              <CircularGauge value={98} size={110} strokeWidth={7.5} color="#6366f1" label="AI Confidence" sublabel="ACCURACY" />
              <CircularGauge value={95} size={110} strokeWidth={7.5} color="#10b981" label="Prediction Reliability" sublabel="RELIABILITY" />
              <CircularGauge value={89} size={110} strokeWidth={7.5} color="#ec4899" label="Hospital Wellness Index" sublabel="WELLNESS" />
            </div>
          </section>

          {/* Emergency Panel */}
          <EmergencyPanel />

          {/* AI Insights panel */}
          <AIInsightsPanel />

          {/* Recent Patients Registry Table */}
          <PatientTable />

          {/* Recharts Disease Charts */}
          <DiseaseAnalyticsCharts />

          {/* Activity Log and Med Reminders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentActivity />
            <MedicationReminders />
          </div>

        </div>

        {/* Right 1 column: Scheduled widgets and Sidebar details */}
        <div className="space-y-6">
          
          {/* Calendar Scheduled Appointments */}
          <AppointmentsWidget />

          {/* Right sidebar info panels (health tips, available doctors, capacity) */}
          <RightPanel />

        </div>

      </div>

      {/* ── FOOTER SYSTEM STATUS BAR ── */}
      <footer className="border-t border-white/5 pt-5 flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-500 uppercase font-black tracking-widest gap-2">
        <div>MedAssist AI Suite • Version 1.2.4 (Production-Ready)</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Core API Online
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Predictive Model V4.2
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Web Vitals Optimal
          </span>
        </div>
      </footer>

      {/* ── FLOATING AI ASSISTANT FAB ── */}
      <FloatingAssistant />
    </motion.div>
  );
};

export default DashboardPage;
