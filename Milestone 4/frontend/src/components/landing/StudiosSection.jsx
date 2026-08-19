import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BrainCircuit, ShieldAlert, Sparkles, FileText, ChartNoAxesCombined, CalendarDays, UserRound, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudiosSection() {
  const navigate = useNavigate();

  const featuredModule = {
    icon: Activity,
    title: 'Symptom Checker',
    description: 'Describe your symptoms and receive AI-assisted analysis with relevant health insights.',
    route: '/patient/symptoms',
    cta: 'EXPLORE SYMPTOM CHECKER →',
  };

  const supportingModules = [
    {
      icon: BrainCircuit,
      title: 'Disease Prediction',
      description: 'Identify possible conditions based on the available symptom analysis.',
      route: '/patient/prediction',
      cta: 'VIEW PREDICTION →',
    },
    {
      icon: ShieldAlert,
      title: 'Risk Assessment',
      description: 'Review relevant risk indicators and severity information from the analysis.',
      route: '/patient/risk',
      cta: 'VIEW RISK ASSESSMENT →',
    },
    {
      icon: Sparkles,
      title: 'Recommendations',
      description: 'Review health recommendations generated from the available analysis.',
      route: '/patient/recommendations',
      cta: 'VIEW RECOMMENDATIONS →',
    },
    {
      icon: FileText,
      title: 'Health Reports',
      description: 'View structured reports generated from health analysis.',
      route: '/patient/reports',
      cta: 'VIEW REPORTS →',
    },
    {
      icon: ChartNoAxesCombined,
      title: 'Analytics',
      description: 'Review available health analytics and trends.',
      route: '/patient/overview',
      cta: 'VIEW ANALYTICS →',
    },
    {
      icon: CalendarDays,
      title: 'Appointments',
      description: 'Access appointment-related functionality where available for the user\'s role.',
      route: '/patient/appointments',
      cta: 'VIEW APPOINTMENTS →',
    },
    {
      icon: UserRound,
      title: 'Profile Management',
      description: 'Manage registered profile information.',
      route: '/patient/profile',
      cta: 'VIEW PROFILE →',
    },
  ];

  const handleModuleClick = (route) => {
    navigate(route);
  };

  return (
    <section id="studios" className="relative py-24 px-4 sm:px-6 lg:px-8">
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
            The MedAssistAI Ecosystem
          </h2>
          <p className="text-lg text-white/60 max-w-3xl mx-auto">
            Explore the core tools that bring symptom analysis, disease prediction, risk assessment and health insights together in one platform.
          </p>
        </motion.div>

        {/* Featured Module */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div 
            onClick={() => handleModuleClick(featuredModule.route)}
            className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#2563EB]/20 border border-[#06B6D4]/30 backdrop-blur-sm hover:border-[#06B6D4]/50 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icon */}
              <div className="flex-shrink-0 p-6 rounded-2xl bg-[#06B6D4]/30 group-hover:scale-110 transition-transform">
                <featuredModule.icon className="w-16 h-16 text-[#06B6D4]" />
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-3 py-1 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] text-xs font-semibold mb-4">
                  FEATURED MODULE
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{featuredModule.title}</h3>
                <p className="text-white/70 text-lg mb-4">{featuredModule.description}</p>
                <button className="inline-flex items-center gap-2 text-[#06B6D4] font-semibold group-hover:gap-3 transition-all">
                  {featuredModule.cta}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supporting Modules */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportingModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => handleModuleClick(module.route)}
                className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-[#06B6D4]/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="p-3 rounded-lg bg-[#06B6D4]/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <module.icon className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <h4 className="text-base font-semibold text-white mb-2">{module.title}</h4>
                <p className="text-white/60 text-sm mb-4">{module.description}</p>
                <div className="flex items-center gap-2 text-[#06B6D4] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {module.cta}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
