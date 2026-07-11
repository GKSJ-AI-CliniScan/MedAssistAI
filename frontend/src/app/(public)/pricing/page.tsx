"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    description: "Perfect for individual practitioners getting started with AI‑assisted diagnostics.",
    features: [
      { text: "5 AI consultations / month", included: true },
      { text: "Basic symptom analysis", included: true },
      { text: "Patient record storage (50)", included: true },
      { text: "Email support", included: true },
      { text: "Advanced imaging analysis", included: false },
      { text: "Team collaboration", included: false },
      { text: "Custom AI model training", included: false },
      { text: "Priority 24/7 support", included: false },
    ],
    cta: "Get Started Free",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    icon: Crown,
    price: "$29",
    period: "/mo",
    description: "For growing practices that need powerful AI tools and deeper clinical insights.",
    features: [
      { text: "Unlimited AI consultations", included: true },
      { text: "Advanced symptom analysis", included: true },
      { text: "Patient record storage (5 000)", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Advanced imaging analysis", included: true },
      { text: "Team collaboration (up to 10)", included: true },
      { text: "Custom AI model training", included: false },
      { text: "Priority 24/7 support", included: false },
    ],
    cta: "Start 14‑Day Free Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "$99",
    period: "/mo",
    description: "Full‑scale solution for hospitals and large clinical organisations.",
    features: [
      { text: "Unlimited AI consultations", included: true },
      { text: "Advanced symptom analysis", included: true },
      { text: "Unlimited patient records", included: true },
      { text: "Priority 24/7 phone support", included: true },
      { text: "Advanced imaging analysis", included: true },
      { text: "Unlimited team collaboration", included: true },
      { text: "Custom AI model training", included: true },
      { text: "Dedicated account manager", included: true },
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time from your dashboard. When upgrading, you'll be prorated for the remaining days in your billing cycle. Downgrades take effect at the start of the next cycle.",
  },
  {
    q: "Is there a free trial for Pro or Enterprise?",
    a: "Yes — both Pro and Enterprise come with a 14‑day free trial, no credit card required. You'll have full access to every feature during the trial period so you can evaluate MedAssist AI risk‑free.",
  },
  {
    q: "How does MedAssist AI handle patient data privacy?",
    a: "Patient data security is our top priority. All data is encrypted at rest (AES‑256) and in transit (TLS 1.3). We are fully HIPAA‑compliant, SOC 2 Type II certified, and undergo annual third‑party security audits.",
  },
  {
    q: "What happens when I exceed the Free plan limits?",
    a: "You'll receive a notification when you're approaching your monthly consultation limit. Once reached, you can upgrade to Pro for unlimited access or wait until the next billing cycle for your quota to reset.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Yes! Annual plans save you 20 % compared to monthly billing. That brings Pro down to $23/mo and Enterprise to $79/mo — billed annually.",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  FAQ Accordion Item                                                 */
/* ------------------------------------------------------------------ */

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="border-b border-white/10 last:border-0"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium text-foreground transition-colors hover:text-primary md:text-lg"
      >
        {q}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-xl leading-none text-muted-foreground"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  return (
    <section className="relative overflow-hidden dark:bg-background">
      {/* -------- ambient glow blobs -------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]"
      />

      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <div className="relative mx-auto max-w-5xl px-6 pt-8 pb-12 text-center md:pt-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
        >
          <Zap className="size-3.5" />
          Pricing
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Simple, Transparent{" "}
          <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Pricing
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          Choose the plan that fits your practice. No hidden fees, no surprise
          charges — just powerful AI‑driven healthcare tools that scale with
          you.
        </motion.p>
      </div>

      {/* ============================================================ */}
      {/*  Pricing Cards                                               */}
      {/* ============================================================ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto grid max-w-6xl gap-8 px-6 pb-28 md:grid-cols-3 md:items-start"
      >
        {plans.map((plan) => {
          const Icon = plan.icon;

          return (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className={`group relative rounded-2xl ${
                plan.popular
                  ? "z-10 md:-mt-4 md:mb-4"
                  : ""
              }`}
            >
              {/* gradient border glow for popular */}
              {plan.popular && (
                <div
                  aria-hidden
                  className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary via-blue-400 to-purple-500 opacity-80 blur-[2px] transition-opacity group-hover:opacity-100"
                />
              )}

              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 backdrop-blur-xl transition-shadow ${
                  plan.popular
                    ? "border-transparent bg-background/80 shadow-2xl shadow-primary/20 dark:bg-background/60"
                    : "border-white/10 bg-white/5 shadow-lg dark:bg-white/[0.03]"
                }`}
              >
                {/* popular badge */}
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-purple-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    Most Popular
                  </span>
                )}

                {/* icon + name */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl ${
                      plan.popular
                        ? "bg-gradient-to-br from-primary to-purple-500 text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                </div>

                {/* price */}
                <div className="mb-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                {/* divider */}
                <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* features */}
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      {f.included ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      ) : (
                        <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <span
                        className={
                          f.included
                            ? "text-foreground"
                            : "text-muted-foreground/50 line-through"
                        }
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  className={`group h-14 w-full rounded-full text-base font-semibold transition-all duration-300 hover:scale-[1.02] ${
                    plan.popular
                      ? "border-0 bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110"
                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:backdrop-blur-md dark:hover:border-white/20 dark:hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ============================================================ */}
      {/*  FAQ                                                         */}
      {/* ============================================================ */}
      <div className="relative mx-auto max-w-3xl px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Everything you need to know about our plans and billing.
          </p>
        </motion.div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg dark:bg-white/[0.03] md:p-8">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Bottom CTA                                                  */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto mb-20 max-w-4xl px-6"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-400/5 px-8 py-14 text-center backdrop-blur-xl md:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15),transparent_70%)]"
          />
          <h3 className="relative text-2xl font-bold text-foreground sm:text-3xl">
            Ready to transform your practice?
          </h3>
          <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
            Join thousands of healthcare professionals who trust MedAssist AI
            for smarter, faster clinical decisions.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group h-14 w-full rounded-full border-0 bg-gradient-to-r from-primary to-purple-500 px-8 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 sm:w-auto"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="group h-14 w-full rounded-full border-slate-200 bg-white px-8 text-base font-medium text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:backdrop-blur-md dark:hover:border-white/20 dark:hover:bg-white/5 sm:w-auto"
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
