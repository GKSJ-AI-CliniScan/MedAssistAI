import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BrainCircuit, AlertTriangle, ShieldAlert, Sparkles, FileText, ChevronDown, Stethoscope, BarChart3, TrendingUp } from 'lucide-react';

export default function ExpertiseSection() {
  const pipelineSteps = [
    {
      icon: Activity,
      title: 'Symptom Input',
      description: 'Users provide symptoms and relevant health information through the Symptom Checker.',
    },
    {
      icon: BrainCircuit,
      title: 'Symptom Analysis',
      description: 'The system processes the reported symptoms and identifies relevant patterns and relationships.',
    },
    {
      icon: AlertTriangle,
      title: 'Disease Prediction',
      description: 'The AI generates possible health conditions associated with the available symptom information.',
    },
    {
      icon: ShieldAlert,
      title: 'Risk Assessment',
      description: 'The system evaluates available risk indicators and severity-related information.',
    },
    {
      icon: Sparkles,
      title: 'Recommendations',
      description: 'The system provides relevant guidance based on the generated analysis.',
    },
    {
      icon: FileText,
      title: 'Health Report',
      description: 'The analysis can be presented as a structured health report containing relevant results and insights.',
    },
  ];

  const capabilities = [
    {
      icon: Stethoscope,
      title: 'Symptom Analysis',
      description: 'Analyze reported symptoms and identify meaningful patterns.',
    },
    {
      icon: BrainCircuit,
      title: 'Disease Prediction',
      description: 'Generate possible condition predictions based on the available symptom information.',
    },
    {
      icon: ShieldAlert,
      title: 'Risk Assessment',
      description: 'Review potential risk indicators and severity information.',
    },
    {
      icon: Sparkles,
      title: 'Recommendations',
      description: 'Provide relevant next-step information based on analysis.',
    },
    {
      icon: FileText,
      title: 'Health Reports',
      description: 'Present analysis and results in a structured, understandable format.',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Provide visual and structured insights where supported by the application.',
    },
  ];

  return (
    <section id="expertise" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0A2342]/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            AI-Powered Health Intelligence
          </h2>
          <p className="text-lg text-white/60 max-w-3xl mx-auto">
            Transforming reported symptoms into structured health insights through AI-assisted analysis and prediction.
          </p>
        </motion.div>

        {/* AI Analysis Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-white mb-12 text-center">Analysis Pipeline</h3>
          
          <div className="relative">
            {/* Vertical Pipeline */}
            <div className="max-w-3xl mx-auto">
              {pipelineSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex items-start gap-6 pb-8 last:pb-0"
                >
                  {/* Step Number Badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-[#06B6D4]/20 flex-shrink-0">
                        <step.icon className="w-5 h-5 text-[#06B6D4]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                        <p className="text-white/60 text-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  {index < pipelineSteps.length - 1 && (
                    <div className="absolute left-5 top-full mt-4 text-[#06B6D4]/50">
                      <ChevronDown className="w-6 h-6" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-12 text-center">Our AI Capabilities</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#06B6D4]/30 transition-all duration-300 group"
              >
                <div className="p-3 rounded-xl bg-[#06B6D4]/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <capability.icon className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{capability.title}</h4>
                <p className="text-white/60 text-sm">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
