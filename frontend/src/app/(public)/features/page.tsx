"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  Activity,
  HeartPulse,
  Stethoscope,
  FileText,
  Zap,
  Clock,
  Users,
  Lock,
  Sparkles,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/* ───────────────────────── animation variants ───────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ─────────────────────────── feature data ────────────────────────────── */

const features = [
  {
    icon: Brain,
    title: "AI Symptom Analysis",
    description:
      "Our deep-learning engine cross-references your symptoms against millions of clinical records to surface the most probable conditions within seconds.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "from-blue-500/20",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description:
      "Proactive risk scoring evaluates your lifestyle, genetics, and medical history to predict and prevent potential health threats before they escalate.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "from-rose-500/20",
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description:
      "Connect wearable devices and receive continuous vitals tracking with intelligent alerts when anomalies are detected in your health data.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "from-emerald-500/20",
  },
  {
    icon: HeartPulse,
    title: "Cardiac Intelligence",
    description:
      "Advanced ECG pattern recognition powered by neural networks detects arrhythmias, murmurs, and early signs of cardiovascular disease.",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    glow: "from-red-500/20",
  },
  {
    icon: Stethoscope,
    title: "Virtual Consultations",
    description:
      "Seamlessly connect with board-certified physicians through HD video, with AI-prepared summaries to make every minute count.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    glow: "from-indigo-500/20",
  },
  {
    icon: FileText,
    title: "Smart Health Reports",
    description:
      "Auto-generated, physician-ready reports compile your analyses, lab results, and history into clear, actionable documents.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "from-amber-500/20",
  },
  {
    icon: Zap,
    title: "Instant Predictions",
    description:
      "Get disease-prediction results with confidence scores in under two seconds, powered by our optimised inference pipeline.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    glow: "from-yellow-500/20",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Access the AI health assistant any time of day or night — no appointments needed, no waiting rooms, just instant care.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "from-cyan-500/20",
  },
  {
    icon: Users,
    title: "Family Health Hub",
    description:
      "Manage profiles for every family member under one account with role-based access and personalized dashboards for each.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "from-purple-500/20",
  },
  {
    icon: Lock,
    title: "Enterprise-Grade Security",
    description:
      "HIPAA-compliant infrastructure with end-to-end encryption, zero-knowledge architecture, and SOC 2 Type II certification.",
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    glow: "from-slate-500/20",
  },
];

/* ──────────────────────── why-choose-us data ─────────────────────────── */

const highlights = [
  {
    icon: Sparkles,
    title: "State-of-the-Art AI",
    description:
      "Built on transformer models trained with 120 M+ anonymised medical records, our platform delivers diagnostic accuracy that rivals specialist physicians.",
    stat: "99.2%",
    statLabel: "Accuracy Rate",
    gradient: "from-blue-600 to-indigo-600",
    glowColor: "shadow-blue-500/25",
  },
  {
    icon: BadgeCheck,
    title: "Clinically Validated",
    description:
      "Every algorithm undergoes rigorous peer-reviewed clinical trials and is continuously benchmarked against gold-standard medical guidelines.",
    stat: "50+",
    statLabel: "Clinical Studies",
    gradient: "from-emerald-600 to-teal-600",
    glowColor: "shadow-emerald-500/25",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "Your data never leaves your control. We employ federated learning, differential privacy, and on-device processing wherever possible.",
    stat: "100%",
    statLabel: "HIPAA Compliant",
    gradient: "from-violet-600 to-purple-600",
    glowColor: "shadow-violet-500/25",
  },
];

/* ═══════════════════════════ PAGE COMPONENT ══════════════════════════ */

export default function FeaturesPage() {
  return (
    <>
      {/* ──────────────────── HERO BANNER ──────────────────── */}
      <section className="relative overflow-hidden bg-[#FAFBFF] dark:bg-background pt-8 pb-12 lg:pt-12 lg:pb-16">
        {/* Gradient blobs */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-[30%] left-[10%] w-[55%] h-[55%] rounded-full opacity-30 dark:opacity-15"
            style={{
              background:
                "radial-gradient(circle, #2563EB 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-[30%] right-[5%] w-[45%] h-[50%] rounded-full opacity-25 dark:opacity-10"
            style={{
              background:
                "radial-gradient(circle, #60A5FA 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-20%] left-[40%] w-[40%] h-[40%] rounded-full opacity-20 dark:opacity-10"
            style={{
              background:
                "radial-gradient(circle, #818CF8 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 -z-[5] opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #2563EB 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5F0FF] dark:bg-primary/10 text-primary border border-primary/10 shadow-sm mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold tracking-wide">
              Explore All Capabilities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] dark:text-foreground leading-[1.1] mb-6 text-balance"
          >
            AI-Powered Features for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#818CF8]">
              Modern Healthcare
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-500 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium mb-10"
          >
            From real-time symptom analysis to predictive health insights,
            discover the comprehensive suite of tools that make MedAssist AI the
            most trusted platform for intelligent healthcare.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group w-full sm:w-auto h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 hover:brightness-110"
              >
                Get Started Free
                <Zap className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:fill-current" />
              </Button>
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 rounded-full border-slate-200 bg-white px-8 text-base font-medium text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                How It Works
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── FEATURES GRID ──────────────────── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Section heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={scaleIn}
            className="text-center max-w-3xl mx-auto mb-14 lg:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-balance">
              Everything You Need,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">
                All in One Place
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ten powerful modules working together to give you a 360°
              view of your health — powered by artificial intelligence and
              backed by clinical science.
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={fadeUp}
                className={`group relative rounded-[1.75rem] p-7 border ${feature.border} bg-card/60 dark:bg-slate-800/30 backdrop-blur-lg shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden cursor-default`}
              >
                {/* Hover glow */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${feature.glow} via-transparent to-transparent pointer-events-none`}
                />

                {/* Decorative corner dots */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                  <span className="h-1 w-1 rounded-full bg-current" />
                  <span className="h-1 w-1 rounded-full bg-current" />
                  <span className="h-1 w-1 rounded-full bg-current" />
                </div>

                {/* Icon */}
                <div
                  className={`h-14 w-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}
                >
                  <feature.icon className="h-6 w-6" strokeWidth={2} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2.5 tracking-tight group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom shine line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── WHY CHOOSE US ──────────────────── */}
      <section className="relative py-12 bg-[#FAFBFF] dark:bg-slate-950/50 overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #2563EB 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Section heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={scaleIn}
            className="text-center max-w-3xl mx-auto mb-14 lg:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-balance">
              Why Healthcare Leaders{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#818CF8]">
                Choose Us
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Trusted by 10,000+ clinicians and millions of patients worldwide,
              MedAssist AI sets the standard for intelligent healthcare
              technology.
            </p>
          </motion.div>

          {/* Highlight Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                className={`group relative rounded-[2rem] p-8 lg:p-10 bg-card/70 dark:bg-slate-800/40 backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-2xl ${item.glowColor} transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
              >
                {/* Top gradient bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                />

                {/* Glow blob behind card */}
                <div
                  className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 blur-3xl transition-opacity duration-700 pointer-events-none`}
                />

                {/* Icon */}
                <div
                  className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-7 shadow-lg ${item.glowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <item.icon
                    className="h-7 w-7 text-white"
                    strokeWidth={2}
                  />
                </div>

                {/* Stat */}
                <div className="mb-5">
                  <p className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                    {item.stat}
                  </p>
                  <p className="text-sm text-muted-foreground font-semibold mt-1">
                    {item.statLabel}
                  </p>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom shine */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── CTA BANNER ──────────────────── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={scaleIn}
            className="relative rounded-[2.5rem] overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#818CF8]" />

            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Glow accents */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 px-8 py-14 lg:px-16 lg:py-20 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 text-balance">
                Ready to Transform Your Healthcare?
              </h2>
              <p className="text-lg text-blue-100 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
                Join thousands of patients and clinicians already using
                MedAssist AI to make smarter, faster, and more confident health
                decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="rounded-full h-14 px-10 text-base bg-white text-[#2563EB] hover:bg-blue-50 shadow-xl shadow-black/10 font-bold transition-all group"
                  >
                    Start Free Trial
                    <Zap className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-14 px-10 text-base bg-transparent border-white/30 text-white hover:bg-white/10 font-bold shadow-sm"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
