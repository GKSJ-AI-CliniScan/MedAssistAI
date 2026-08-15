import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, BrainCircuit, FileCheck, AlertCircle, Sparkles, ShieldCheck, BarChart3, Info } from 'lucide-react';

export default function StorySection() {
  const journeySteps = [
    {
      number: '01',
      title: 'Understand',
      icon: BrainCircuit,
      description: 'Describe your symptoms and provide relevant health information.',
    },
    {
      number: '02',
      title: 'Analyze',
      icon: Sparkles,
      description: 'MedAssistAI analyzes the available information to identify symptom patterns, possible conditions and relevant risk indicators.',
    },
    {
      number: '03',
      title: 'Take Action',
      icon: FileCheck,
      description: 'Review the generated insights, recommendations and reports and use them to better understand what to discuss with a qualified healthcare professional.',
    },
  ];

  const whyMedAssistAI = [
    {
      icon: Sparkles,
      title: 'AI-Assisted Analysis',
      description: 'Helps organize and analyze reported symptoms using the project\'s AI-powered analysis workflow.',
    },
    {
      icon: AlertCircle,
      title: 'Early Health Insights',
      description: 'Helps users explore possible conditions and understand relevant risk indicators based on the information they provide.',
    },
    {
      icon: BarChart3,
      title: 'Structured Results',
      description: 'Converts analysis into understandable predictions, recommendations and reports.',
    },
    {
      icon: ShieldCheck,
      title: 'Informed Decisions',
      description: 'Helps users prepare for better conversations and decisions with healthcare professionals.',
    },
  ];

  return (
    <section id="story" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Mission & Impact
          </h2>
          <p className="text-lg text-white/60 max-w-3xl mx-auto">
            Helping people understand their symptoms earlier and make more informed healthcare decisions.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <p className="text-lg text-white/80 leading-relaxed max-w-4xl mx-auto text-center">
            MedAssistAI is an AI-powered Symptom Analysis and Disease Prediction System designed to help users organize their reported symptoms, explore possible health conditions, understand potential health risks, and receive relevant recommendations. The system is designed as a decision-support and health-information tool. It does not replace professional medical diagnosis or treatment.
          </p>
        </motion.div>

        {/* 3-Step Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-white mb-12 text-center">Your Health Journey</h3>
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#06B6D4]/50 to-transparent transform -translate-y-1/2" />
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="p-4 rounded-xl bg-[#06B6D4]/20 w-fit mb-6">
                      <step.icon className="w-8 h-8 text-[#06B6D4]" />
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                    <p className="text-white/60 leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Arrow */}
                  {index < journeySteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#06B6D4]/50">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Why MedAssistAI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-12 text-center">Why MedAssistAI?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {whyMedAssistAI.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-[#06B6D4]/20 flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-start gap-4 p-6 rounded-xl bg-[#06B6D4]/5 border border-[#06B6D4]/20"
        >
          <div className="p-2 rounded-lg bg-[#06B6D4]/20 flex-shrink-0">
            <Info className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            <strong className="text-white">Medical Disclaimer:</strong> MedAssistAI provides AI-assisted health information and decision support. Results may be inaccurate or incomplete and should not be considered a medical diagnosis. Consult a qualified healthcare professional for medical concerns.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
