"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ClipboardList,
  BrainCircuit,
  Stethoscope,
  Pill,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Database,
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    number: "01",
    title: "Enter Your Symptoms",
    description:
      "Describe what you're experiencing using natural language. Our intelligent intake system guides you through relevant follow-up questions to build a comprehensive symptom profile.",
    icon: ClipboardList,
    gradient: "from-blue-500 to-cyan-400",
    glowColor: "shadow-blue-500/25",
    detail: "Natural-language processing understands 40+ languages",
  },
  {
    number: "02",
    title: "AI-Powered Analysis",
    description:
      "Our proprietary deep-learning models cross-reference your symptoms against millions of anonymised medical records, peer-reviewed literature, and clinical guidelines in real time.",
    icon: BrainCircuit,
    gradient: "from-violet-500 to-purple-400",
    glowColor: "shadow-violet-500/25",
    detail: "Analysis completed in under 3 seconds on average",
  },
  {
    number: "03",
    title: "Receive a Diagnosis",
    description:
      "Get a ranked list of possible conditions with confidence scores, supporting evidence, and recommended next steps — all reviewed by our board-certified clinical advisory team.",
    icon: Stethoscope,
    gradient: "from-emerald-500 to-teal-400",
    glowColor: "shadow-emerald-500/25",
    detail: "94.7 % diagnostic concordance with specialist panels",
  },
  {
    number: "04",
    title: "Personalised Treatment Plan",
    description:
      "Receive an evidence-based care plan tailored to your medical history, allergies, and lifestyle — including medication options, lifestyle changes, and specialist referrals.",
    icon: Pill,
    gradient: "from-amber-500 to-orange-400",
    glowColor: "shadow-amber-500/25",
    detail: "Plans follow WHO & NICE clinical guidelines",
  },
];

const stats = [
  { value: "2.4 M+", label: "Medical Records Trained On", icon: Database },
  { value: "94.7 %", label: "Diagnostic Accuracy", icon: ShieldCheck },
  { value: "<3 s", label: "Average Analysis Time", icon: Zap },
  { value: "120+", label: "Conditions Covered", icon: HeartPulse },
];

/* ------------------------------------------------------------------ */
/*  Reusable animated wrapper                                          */
/* ------------------------------------------------------------------ */

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-blue-950/20 dark:to-blue-950/40"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px]" />

      {/* Animated grid */}
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,.04)_1px,transparent_1px)] bg-[size:60px_60px]"
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400"
        >
          <Sparkles className="size-4" />
          AI-Driven Healthcare
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          How{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            MedAssist AI
          </span>{" "}
          Works
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          From symptom entry to a personalised treatment plan — experience a
          seamless, AI-powered health journey that puts clinical-grade insights
          at your fingertips in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="group w-full sm:w-auto h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 hover:brightness-110"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="#steps" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto h-14 rounded-full border-slate-200 bg-white px-8 text-base font-medium text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              See the Steps
              <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Vertical Timeline / Stepper                                        */
/* ------------------------------------------------------------------ */

function TimelineStep({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[number];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex w-full items-start gap-8 md:gap-0">
      {/* -------- Left content (desktop) -------- */}
      <div
        className={`hidden w-1/2 md:flex ${
          isEven ? "justify-end pr-16" : "justify-end pr-16 opacity-0"
        }`}
      >
        {isEven && (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="max-w-md"
          >
            <StepCard step={step} />
          </motion.div>
        )}
      </div>

      {/* -------- Centre line + node -------- */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Connector line above */}
        {index !== 0 && (
          <div className="h-10 w-px bg-gradient-to-b from-blue-500/60 to-blue-500/20 md:h-8" />
        )}

        {/* Node circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
            delay: 0.1,
          }}
          className={`relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-white shadow-lg ${step.glowColor} shadow-xl ring-4 ring-background`}
        >
          <step.icon className="size-6" />
          {/* Pulse ring */}
          <span
            className={`absolute inset-0 animate-ping rounded-full bg-gradient-to-br ${step.gradient} opacity-20`}
            style={{ animationDuration: "3s" }}
          />
        </motion.div>

        {/* Number badge */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-1 text-xs font-bold tracking-wider text-muted-foreground"
        >
          STEP {step.number}
        </motion.span>

        {/* Connector line below */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-28 w-px origin-top bg-gradient-to-b from-blue-500/40 to-transparent md:h-20"
          />
        )}
      </div>

      {/* -------- Right content (desktop) -------- */}
      <div
        className={`hidden w-1/2 md:flex ${
          !isEven ? "justify-start pl-16" : "justify-start pl-16 opacity-0"
        }`}
      >
        {!isEven && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="max-w-md"
          >
            <StepCard step={step} />
          </motion.div>
        )}
      </div>

      {/* -------- Mobile content (always right of line) -------- */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 pb-10 md:hidden"
      >
        <StepCard step={step} />
      </motion.div>
    </div>
  );
}

function StepCard({ step }: { step: (typeof steps)[number] }) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10 dark:bg-white/[0.03]">
      {/* Glassmorphism glow */}
      <div
        className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10`}
      />

      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        {step.description}
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
        <Sparkles className="size-3" />
        {step.detail}
      </div>
    </div>
  );
}

function Timeline() {
  return (
    <section
      id="steps"
      className="relative overflow-hidden bg-background py-28 lg:py-36"
    >
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-6">
        <AnimatedSection className="mb-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            The Process
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Four simple steps to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              better health
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Our streamlined workflow ensures you go from first symptom to
            actionable care plan — fast, private, and clinically sound.
          </p>
        </AnimatedSection>

        {/* Timeline items */}
        <div className="flex flex-col items-center">
          {steps.map((step, i) => (
            <TimelineStep
              key={step.number}
              step={step}
              index={i}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  AI Technology / Stats                                              */
/* ------------------------------------------------------------------ */

function TechnologySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-background to-blue-950/20 py-28 dark:to-blue-950/30"
    >
      {/* Decorative blob */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <AnimatedSection className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Under the Hood
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            The technology behind{" "}
            <span className="bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent">
              MedAssist AI
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Purpose-built transformer models trained on de-identified clinical
            data and validated against real-world diagnostic outcomes.
          </p>
        </AnimatedSection>

        {/* Stats grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10 dark:bg-white/[0.03]"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10" />

              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <stat.icon className="size-6" />
              </div>
              <p className="text-3xl font-extrabold text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Extra detail cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Privacy-First Architecture",
              desc: "End-to-end encryption with zero-knowledge design. Your health data is never stored or shared without explicit consent.",
            },
            {
              title: "Clinician-Validated Models",
              desc: "Every diagnostic model is reviewed and benchmarked by board-certified physicians across 18 medical specialties.",
            },
            {
              title: "Continuous Learning",
              desc: "Our models improve weekly through federated learning on aggregated, anonymised feedback — without compromising privacy.",
            },
          ].map((card, i) => (
            <AnimatedSection key={card.title} delay={i * 0.1}>
              <div className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:bg-white/10 dark:bg-white/[0.03]">
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10" />
                <h4 className="text-lg font-bold text-foreground">
                  {card.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-background py-28">
      {/* Decorative */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.08),transparent_70%)]" />

      <AnimatedSection className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-violet-600/5 to-transparent p-12 backdrop-blur-2xl sm:p-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Ready to experience the{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              future of healthcare
            </span>
            ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join hundreds of thousands of users who trust MedAssist AI for
            fast, private, and clinically validated health insights.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg">
                Start Your Free Assessment
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground/60">
            No credit card required · HIPAA-compliant · SOC 2 certified
          </p>
        </div>
      </AnimatedSection>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HowItWorksPage() {
  return (
    <>
      <Hero />
      <Timeline />
      <TechnologySection />
      <CtaSection />
    </>
  );
}
