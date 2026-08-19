import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GetStartedSection() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Secure & Private',
      description: 'Your health data is protected',
    },
    {
      icon: Zap,
      title: 'Fast & Accurate',
      description: 'Quick AI-powered analysis',
    },
    {
      icon: BrainCircuit,
      title: 'AI-Powered',
      description: 'Advanced machine learning',
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Your Health, Our Priority
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Ready to analyze your symptoms and get intelligent insights? 
            Start your health journey with MedAssistAI today.
          </p>

          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-10 py-4 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#06B6D4]/30 transition-all duration-300 flex items-center gap-3 mx-auto text-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="p-3 rounded-full bg-[#06B6D4]/20">
                  <benefit.icon className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <h3 className="text-sm font-semibold text-white">{benefit.title}</h3>
                <p className="text-xs text-white/60">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
