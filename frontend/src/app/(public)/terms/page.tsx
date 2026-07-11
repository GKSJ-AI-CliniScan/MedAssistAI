"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 dark:bg-background dark:text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[150px]" />
      </div>

      <div className="container mx-auto max-w-4xl px-6 pt-12 md:pt-16">
        <motion.div initial="hidden" animate="visible" className="mb-12 text-center md:text-left">
          <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            <Scale className="mr-2 h-4 w-4" /> Legal Document
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="mb-4 bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl lg:text-6xl">
            Terms of Service
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-neutral-400">
            Last updated: July 3, 2026
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp} 
          custom={3}
          className="prose prose-lg prose-invert relative max-w-none overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl shadow-violet-500/5 backdrop-blur-xl md:p-12"
        >
          <div className="pointer-events-none absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-violet-500/10 blur-[100px]" />
          
          <p className="lead text-xl leading-relaxed text-neutral-300">
            Please read these Terms of Service carefully before using the MedAssist AI platform.
          </p>
          
          <h2 className="mb-6 mt-12 border-b border-white/10 pb-4 text-2xl font-bold text-white">1. Acceptance of Terms</h2>
          <p className="leading-relaxed text-neutral-400">By accessing or using our platform, you agree to be bound by these Terms and our Privacy Policy.</p>
          
          <h2 className="mb-6 mt-12 border-b border-white/10 pb-4 text-2xl font-bold text-white">2. Medical Disclaimer</h2>
          <p className="leading-relaxed text-neutral-400">MedAssist AI provides informational services and AI-generated insights. IT IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. Always seek the advice of your physician.</p>
          
          <h2 className="mb-6 mt-12 border-b border-white/10 pb-4 text-2xl font-bold text-white">3. Subscription and Billing</h2>
          <p className="leading-relaxed text-neutral-400">Premium features require an active subscription. You agree to provide accurate billing information and authorize us to charge your payment method on a recurring basis.</p>
        </motion.div>
      </div>
    </main>
  );
}
