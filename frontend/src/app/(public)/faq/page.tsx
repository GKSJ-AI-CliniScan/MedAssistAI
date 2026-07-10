"use client";

import { motion } from "framer-motion";
import { MessageCircle, HelpCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const faqs = [
  {
    q: "Is MedAssist AI a replacement for my doctor?",
    a: "No. MedAssist AI is designed to augment and assist in health tracking and provide preliminary insights, but it is not a substitute for professional medical advice, diagnosis, or treatment."
  },
  {
    q: "How secure is my health data?",
    a: "We use bank-level AES-256 encryption for all data at rest and in transit. We are fully HIPAA and GDPR compliant, ensuring your medical history remains entirely private."
  },
  {
    q: "Can I cancel my Premium subscription at any time?",
    a: "Yes, you can cancel your subscription from your account settings at any time without any hidden fees. Your premium access will continue until the end of your billing cycle."
  },
  {
    q: "How accurate is the Symptom Checker AI?",
    a: "Our models have been trained on over 5 million clinical cases and peer-reviewed medical literature. It currently operates with a 94% diagnostic accuracy rate, but should always be validated by a physician."
  },
  {
    q: "Do you offer an API for developers?",
    a: "Yes! We offer a comprehensive REST API for integrating our diagnostic engine into EHRs and third-party healthcare apps. See our API Docs for more information."
  }
];

export default function FAQPage() {
  return (
    <main className="relative min-h-screen overflow-hidden dark:bg-background dark:text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <section className="relative pt-8 pb-16 text-center">
        <motion.div initial="hidden" animate="visible" className="mx-auto max-w-3xl px-6">
          <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            <MessageCircle className="h-4 w-4" /> FAQs
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Frequently Asked <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">Questions</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-xl text-neutral-400 mb-10">
            Find quick answers to the most common questions about the MedAssist AI platform, security, and billing.
          </motion.p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-32">
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp} 
              custom={i + 3}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-violet-500/10"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-violet-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="mb-3 flex items-start gap-3 text-xl font-bold text-white transition-colors group-hover:text-violet-50">
                <HelpCircle className="mt-0.5 h-6 w-6 shrink-0 text-violet-400 opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:text-violet-300 group-hover:opacity-100" />
                {faq.q}
              </h3>
              <p className="ml-9 leading-relaxed text-neutral-400 transition-colors group-hover:text-neutral-300">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
