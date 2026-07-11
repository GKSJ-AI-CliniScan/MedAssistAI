"use client";

import { motion } from "framer-motion";
import { LifeBuoy, Search, Book, CreditCard, Settings, User } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

export default function HelpPage() {
  return (
    <main className="relative min-h-screen overflow-hidden dark:bg-background dark:text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <section className="relative pt-8 pb-20 text-center">
        <motion.div initial="hidden" animate="visible" className="mx-auto max-w-3xl px-6">
          <motion.div variants={fadeUp} custom={0} className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20">
              <LifeBuoy className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            How can we help?
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-xl text-neutral-400 mb-10">
            Search our knowledge base or browse categories below to find answers to your questions.
          </motion.p>
          
          <motion.div variants={fadeUp} custom={3} className="relative max-w-2xl mx-auto group">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-6 text-neutral-500 transition-colors group-focus-within:text-blue-400">
              <Search className="h-6 w-6" />
            </div>
            <input 
              type="text" 
              placeholder="Search for articles, guides, and tutorials..." 
              className="w-full rounded-full border border-white/[0.1] bg-white/[0.03] py-5 pl-16 pr-6 text-lg text-white placeholder-neutral-500 shadow-2xl backdrop-blur-md transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] focus:outline-none"
            />
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: User, title: "Getting Started", desc: "Learn how to create an account and complete your profile." },
            { icon: CreditCard, title: "Account & Billing", desc: "Manage your subscription, update payment methods." },
            { icon: Book, title: "Using the Platform", desc: "Tutorials on how to use the symptom checker and AI tools." },
            { icon: Settings, title: "API Configuration", desc: "Developer guides for API keys and webhooks." },
          ].map((cat, i) => (
            <motion.div 
              key={i}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp} 
              custom={i + 4}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-2xl" />
              <cat.icon className="mb-6 h-8 w-8 text-blue-400 opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-300 group-hover:opacity-100" />
              <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-50">{cat.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-400 transition-colors group-hover:text-neutral-300">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
