"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Cpu, ClipboardList, Stethoscope } from "lucide-react";

const steps = [
  {
    title: "Choose Symptoms",
    description: "Select from a comprehensive list of symptoms and specify severity, duration, and other details.",
    icon: ClipboardList,
  },
  {
    title: "AI Analysis",
    description: "Our advanced models analyze your inputs against millions of data points instantly.",
    icon: Cpu,
  },
  {
    title: "Disease Prediction",
    description: "Review a ranked list of potential conditions with detailed confidence percentages.",
    icon: Stethoscope,
  },
  {
    title: "Generate Report",
    description: "Download a detailed PDF report to share with your healthcare provider for next steps.",
    icon: CheckCircle2,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-background py-16">
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            A simple, intuitive process to get the medical insights you need in minutes.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Background Connecting Line */}
          <div className="absolute left-[12.5%] top-10 z-0 hidden h-[2px] w-[75%] bg-white/5 md:block" />
          
          {/* Animated Connecting Line */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "75%" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            className="absolute left-[12.5%] top-10 z-0 hidden h-[2px] bg-gradient-to-r from-blue-500 via-primary to-indigo-500 md:block" 
          />

          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Icon Container with Badge */}
                <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md transition-all duration-300 group-hover:-translate-y-2 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
                  {/* Step Number Badge */}
                  <div className="absolute -right-2 -top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-primary shadow-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    {index + 1}
                  </div>
                  <step.icon className="relative z-10 h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                
                <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary">{step.title}</h3>
                <p className="max-w-[200px] text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
