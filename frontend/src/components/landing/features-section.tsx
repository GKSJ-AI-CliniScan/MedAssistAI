"use client";

import { motion } from "framer-motion";
import { Activity, ShieldAlert, FileText, BrainCircuit, History, Stethoscope } from "lucide-react";

const features = [
  {
    title: "Symptom Checker",
    description: "Input your symptoms and let our advanced AI analyze potential underlying causes instantly.",
    icon: Stethoscope,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Disease Prediction",
    description: "Receive accurate disease predictions with confidence scores based on thousands of medical records.",
    icon: Activity,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Risk Assessment",
    description: "Identify potential health risks early with predictive modeling and lifestyle analysis.",
    icon: ShieldAlert,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Health Reports",
    description: "Generate comprehensive, easy-to-understand medical reports you can share with your doctor.",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "AI Recommendations",
    description: "Get personalized actionable advice on diet, exercise, and next steps for your well-being.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Medical History",
    description: "Securely store and track your past predictions, appointments, and medication logs.",
    icon: History,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="pt-4 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Powerful Features for Your Health</h2>
          <p className="text-lg text-muted-foreground">
            Experience the future of healthcare with our suite of AI-driven tools designed to provide you with unparalleled medical insights.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-card dark:bg-slate-800/40 rounded-[2rem] p-8 border border-primary dark:border-primary/20 shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <div className={`h-14 w-14 rounded-full ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
