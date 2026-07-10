"use client";

import { motion } from "framer-motion";
import { Briefcase, ArrowRight, CheckCircle, Heart, Globe, Users, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" } }),
};

export default function CareersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden dark:bg-background dark:text-foreground pb-20">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[400px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-[400px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <section className="relative pt-8 pb-8 lg:pt-12 lg:pb-12 text-center">
        <motion.div initial="hidden" animate="visible" className="mx-auto max-w-4xl px-6">
          <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
            <Briefcase className="h-4 w-4" /> We are hiring
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl mb-4">
            Join our mission to revolutionize healthcare.
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-400 mb-8">
            We are looking for passionate engineers, researchers, and clinicians to help us build the future of AI-driven medicine. Join a team where your work directly impacts millions of lives.
          </motion.p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="space-y-4">
          <div className="flex items-center justify-between mb-6 border-b border-white/[0.06] pb-4">
            <h2 className="text-2xl font-bold text-white">Open Positions</h2>
            <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">3 Roles Available</span>
          </div>
          
          {[
            { title: "Senior Machine Learning Engineer", loc: "San Francisco, CA / Remote", tag: "Engineering", type: "Full-Time" },
            { title: "Frontend Engineer (React/Next.js)", loc: "New York, NY / Remote", tag: "Product", type: "Full-Time" },
            { title: "Clinical Data Specialist", loc: "London, UK / Remote", tag: "Medical", type: "Contract" }
          ].map((job, i) => (
            <motion.div key={i} variants={fadeUp} custom={i+4} className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-white/[0.04] hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold text-neutral-300 border border-white/10">
                    {job.tag}
                  </span>
                  <span className="text-xs font-medium text-neutral-500">{job.type}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                <p className="text-neutral-400 mt-1 flex items-center gap-1.5 text-sm"><Globe className="h-3.5 w-3.5"/> {job.loc}</p>
              </div>
              <Button className="group shrink-0 h-10 rounded-full bg-white text-black hover:bg-neutral-200 px-6 text-sm font-semibold shadow-lg transition-all hover:scale-105">
                Apply Now <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeUp} custom={0} className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-8">Why work with us?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-rose-400" />
              </div>
              <h3 className="text-base font-bold mb-1">Meaningful Work</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">Save lives and improve health outcomes globally.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-base font-bold mb-1">Top Talent</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">Work alongside ex-Google & Stanford experts.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold mb-1">Autonomy</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">Take ownership of massive architectural decisions.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-base font-bold mb-1">Hyper Growth</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">Fast-paced environment with rapid career scaling.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
