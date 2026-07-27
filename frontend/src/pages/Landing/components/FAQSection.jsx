import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import faqData from '../../../data/faq.json';

const FAQItem = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      className={`
        rounded-2xl border overflow-hidden transition-all duration-300
        ${open
          ? 'border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.08)]'
          : 'border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5'
        }
      `}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none group"
        aria-expanded={open}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-btn-${item.id}`}
      >
        <span className={`text-sm font-semibold transition-colors duration-200 ${open ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'}`}>
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`shrink-0 ml-4 transition-colors ${open ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-answer-${item.id}`}
            role="region"
            aria-labelledby={`faq-btn-${item.id}`}
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Separator line top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-3">
              Frequently Asked Questions
            </p>
            <h2 className="text-4xl font-extrabold text-slate-100 mb-4 leading-tight">
              Everything you want to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                know
              </span>
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
              Have more questions? Our support team is always ready to help via the Settings → Support panel inside the portal.
            </p>
          </motion.div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqData.map((item, index) => (
            <FAQItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
