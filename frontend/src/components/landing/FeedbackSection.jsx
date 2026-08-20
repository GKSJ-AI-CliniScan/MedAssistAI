import React from 'react';
import { motion } from 'framer-motion';
import { Star, Stethoscope, UserRound, GraduationCap, Users, Clock, MessageSquareMore } from 'lucide-react';

export default function FeedbackSection() {
  const feedback = [
    {
      name: 'Dr. Diksha',
      role: 'Doctor',
      icon: Stethoscope,
      content: 'MedAssistAI provides valuable insights that help me understand patient symptoms better. The AI-powered analysis is impressive.',
    },
    {
      name: 'SAI KIRAN BOYA',
      role: 'Patient',
      icon: UserRound,
      content: 'The symptom checker helped me understand my health concerns better. The recommendations were very helpful.',
    },
    {
      name: 'SANVI SAWANTH',
      role: 'Healthcare Mentor',
      icon: GraduationCap,
      content: 'An excellent tool for preliminary health assessment. The disease prediction feature is remarkably accurate.',
    },
    {
      name: 'Drushhti Kuhikar',
      role: 'Doctor',
      icon: Stethoscope,
      content: 'The risk assessment module provides comprehensive analysis. Great for early detection and preventive care.',
    },
    {
      name: 'Vishuddhi Jain',
      role: 'Patient',
      icon: UserRound,
      content: 'Easy to use and provides clear insights. The health reports are detailed and easy to understand.',
    },
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Doctor':
        return Stethoscope;
      case 'Patient':
        return UserRound;
      case 'Healthcare Mentor':
        return GraduationCap;
      default:
        return UserRound;
    }
  };

  const metrics = [
    {
      value: '2,200+',
      label: 'USERS SUPPORTED',
      icon: Users,
      prominent: true,
    },
    {
      value: '4.79/5',
      label: 'USER RATING',
      icon: Star,
      prominent: false,
    },
    {
      value: '24/7',
      label: 'AI-POWERED ASSISTANCE',
      icon: Clock,
      prominent: false,
    },
  ];

  return (
    <section id="feedback" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0A2342]/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Users
          </h2>
          <p className="text-lg text-white/60 max-w-3xl mx-auto">
            Real experiences from patients and healthcare professionals using MedAssistAI.
          </p>
        </motion.div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-[#06B6D4]/30 transition-all duration-300 ${
                  metric.prominent ? 'md:col-span-1' : ''
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 rounded-lg bg-[#06B6D4]/20">
                    <metric.icon className="w-5 h-5 text-[#06B6D4]" />
                  </div>
                  <div className={`font-bold text-[#06B6D4] ${metric.prominent ? 'text-4xl lg:text-5xl' : 'text-2xl lg:text-3xl'}`}>
                    {metric.value}
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-[#06B6D4]/30 transition-all duration-300"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#06B6D4] text-[#06B6D4]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                "{item.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#06B6D4]/20 border border-[#06B6D4]/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#06B6D4]">
                    {getInitials(item.name)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {(() => {
                      const RoleIcon = getRoleIcon(item.role);
                      return <RoleIcon className="w-3 h-3 text-[#06B6D4]" />;
                    })()}
                    <span className="text-xs text-white/60">{item.role}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Many More Voices */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#06B6D4]/10 to-[#2563EB]/10 border border-[#06B6D4]/20 backdrop-blur-sm hover:bg-[#06B6D4]/15 hover:border-[#06B6D4]/40 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[280px]"
          >
            <div className="p-4 rounded-2xl bg-[#06B6D4]/20 mb-4">
              <MessageSquareMore className="w-8 h-8 text-[#06B6D4]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">+ MANY MORE VOICES</h4>
            <p className="text-white/60 text-sm">
              Feedback from our growing MedAssistAI user community.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
