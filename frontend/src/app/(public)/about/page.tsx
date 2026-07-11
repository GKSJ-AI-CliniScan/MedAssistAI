"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Shield,
  Globe,
  Award,
  Users,
  Target,
  Lightbulb,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const team = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Executive Officer",
    initials: "SC",
    bio: "Former Stanford Medicine faculty with 15+ years in health-tech. Sarah founded MedAssist AI to democratize access to intelligent diagnostics worldwide.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    name: "Dr. James Wilson",
    role: "Chief Technology Officer",
    initials: "JW",
    bio: "Ex-Google DeepMind engineer specializing in large-scale ML systems. James leads the platform architecture and real-time inference pipeline.",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    name: "Dr. Priya Patel",
    role: "Head of AI Research",
    initials: "PP",
    bio: "Published 40+ papers on medical NLP and computer vision. Priya drives the R&D behind our proprietary diagnostic models.",
    gradient: "from-rose-500 to-pink-400",
  },
  {
    name: "Dr. Michael Torres",
    role: "Head of Medicine",
    initials: "MT",
    bio: "Board-certified internist and clinical-informatics fellow. Michael ensures every AI recommendation meets the highest clinical safety standards.",
    gradient: "from-amber-500 to-orange-400",
  },
];

const stats = [
  { label: "Active Users", value: "1M+", icon: Users },
  { label: "Countries Served", value: "50+", icon: Globe },
  { label: "Diagnostic Accuracy", value: "99.2%", icon: Target },
  { label: "Availability", value: "24/7", icon: Zap },
];

const values = [
  {
    title: "Innovation",
    description:
      "We push the boundaries of medical AI, constantly evolving our models with the latest research breakthroughs.",
    icon: Lightbulb,
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    title: "Trust",
    description:
      "Patient safety is non-negotiable. Every recommendation is clinically validated, explainable, and transparent.",
    icon: Shield,
    gradient: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    title: "Accessibility",
    description:
      "World-class diagnostics should be available to everyone—regardless of geography, language, or income.",
    icon: Globe,
    gradient: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/30",
    iconColor: "text-violet-400",
  },
  {
    title: "Excellence",
    description:
      "We hold ourselves to the highest clinical and engineering standards, because lives depend on precision.",
    icon: Award,
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
];

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function AboutPage() {
  return (
    <main className="relative overflow-hidden dark:bg-background dark:text-foreground">
      {/* ------------------------------------------------------------ */}
      {/*  HERO                                                         */}
      {/* ------------------------------------------------------------ */}
      <section className="relative isolate pt-8 pb-12 lg:pt-12 lg:pb-16">
        {/* decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl"
        />

        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400"
          >
            <Sparkles className="h-4 w-4" />
            Pioneering the Future of Healthcare
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            About{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              MedAssist AI
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            We're on a mission to make world-class medical intelligence
            accessible to every patient and clinician on the planet—powered by
            cutting-edge artificial intelligence and grounded in clinical
            excellence.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="group h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 hover:brightness-110"
            >
              Meet the Team <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 rounded-full border-white/[0.1] bg-white/[0.03] px-8 text-base font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/[0.2] hover:bg-white/[0.08]"
            >
              Our Research
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  MISSION & VISION                                             */}
      {/* ------------------------------------------------------------ */}
      <section className="relative py-12">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Our Purpose
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Two pillars guide everything we build—our mission and our vision
              for the future of healthcare.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission Card */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/60 to-slate-900/60 p-8 backdrop-blur-xl transition-all hover:border-blue-500/40 hover:shadow-[0_0_40px_-12px_rgba(37,99,235,0.3)]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold">Our Mission</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                To harness the power of artificial intelligence to deliver
                accurate, real-time clinical insights—bridging the gap between
                cutting-edge research and everyday patient care across the globe.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {[
                  "Evidence-based diagnostics at scale",
                  "Seamless clinician-AI collaboration",
                  "Equitable access for underserved communities",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={1}
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-violet-950/60 to-slate-900/60 p-8 backdrop-blur-xl transition-all hover:border-violet-500/40 hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.3)]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30">
                <Star className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold">Our Vision</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                A world where every healthcare decision is augmented by
                intelligent, transparent AI—leading to earlier diagnoses, better
                outcomes, and a healthier humanity.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {[
                  "AI-first preventive medicine",
                  "Zero missed diagnoses through ML screening",
                  "Global health equity by 2035",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  STATS                                                        */}
      {/* ------------------------------------------------------------ */}
      <section className="relative py-12">
        {/* background accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent"
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={i}
                  className="group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-lg transition-all hover:border-blue-500/30 hover:bg-blue-500/5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {s.value}
                  </span>
                  <span className="mt-1 text-sm text-muted-foreground">
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  TEAM                                                         */}
      {/* ------------------------------------------------------------ */}
      <section className="relative py-12">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Leadership Team
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              A multidisciplinary team of physicians, engineers, and researchers
              united by one goal—better healthcare through AI.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
                className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-lg transition-all hover:border-white/20 hover:shadow-xl"
              >
                {/* avatar */}
                <div
                  className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-2xl font-bold text-white shadow-lg ring-4 ring-white/10 transition-transform group-hover:scale-105`}
                >
                  {member.initials}
                </div>

                <h3 className="text-lg font-semibold">{member.name}</h3>
                <span className="mt-1 text-sm font-medium text-blue-400">
                  {member.role}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  VALUES                                                       */}
      {/* ------------------------------------------------------------ */}
      <section className="relative py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent"
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              The principles that shape every algorithm we train, every feature
              we ship, and every life we touch.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={i}
                  className={`group relative rounded-2xl border ${v.border} bg-gradient-to-br ${v.gradient} p-7 backdrop-blur-xl transition-all hover:scale-[1.03] hover:shadow-lg`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black/20 ${v.iconColor} ring-1 ring-white/10`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/*  CTA BANNER                                                   */}
      {/* ------------------------------------------------------------ */}
      <section className="py-12 pb-24">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-4xl px-6"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-blue-800/10 to-violet-600/20 p-12 text-center backdrop-blur-xl sm:p-16">
            {/* glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl"
            />

            <h2 className="relative text-3xl font-bold sm:text-4xl">
              Ready to Transform Healthcare?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
              Join over a million clinicians and patients already using MedAssist
              AI to make smarter, faster, and safer medical decisions.
            </p>
            <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="group h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 hover:brightness-110"
              >
                Get Started Free <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 rounded-full border-white/[0.1] bg-white/[0.03] px-8 text-base font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/[0.2] hover:bg-white/[0.08]"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
