"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 dark:bg-background dark:text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      <div className="container mx-auto max-w-4xl px-6 pt-12 md:pt-16">
        <motion.div initial="hidden" animate="visible" className="mb-12 text-center md:text-left">
          <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
            <Scale className="mr-2 h-4 w-4" /> Legal Document
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="mb-4 bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl lg:text-6xl">
            Privacy Policy
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
          className="prose prose-lg prose-invert relative max-w-none overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl shadow-blue-500/5 backdrop-blur-xl md:p-12"
        >
          <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
          
          <p className="lead text-xl leading-relaxed text-neutral-300">
            Your privacy is our primary concern. MedAssist AI is committed to protecting your personal and medical data in compliance with global standards, including HIPAA and GDPR.
          </p>
          
          <h2 className="mb-6 mt-12 border-b border-white/10 pb-4 text-2xl font-bold text-white">1. Data Collection</h2>
          <p className="leading-relaxed text-neutral-400">We collect information you provide directly to us when you create an account, fill out your medical profile, or use our AI consultation features.</p>
          
          <h2 className="mb-6 mt-12 border-b border-white/10 pb-4 text-2xl font-bold text-white">2. Data Usage</h2>
          <p className="leading-relaxed text-neutral-400">Your data is exclusively used to provide and improve our healthcare diagnostic services. We do NOT sell your data to advertisers or third-party data brokers.</p>
          
          <h2 className="mb-6 mt-12 border-b border-white/10 pb-4 text-2xl font-bold text-white">3. Data Security</h2>
          <p className="leading-relaxed text-neutral-400">All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Access to your raw health records is strictly controlled and logged.</p>
        </motion.div>
      </div>
    </main>
  );
}
