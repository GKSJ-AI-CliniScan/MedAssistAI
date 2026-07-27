import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Stethoscope, Brain, FileText, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const QUICK_CHIPS = [
  { label: 'Analyze Symptoms', path: '/symptoms', icon: Stethoscope, color: 'from-cyan-500 to-cyan-700' },
  { label: 'Predict Disease', path: '/prediction', icon: Brain, color: 'from-indigo-500 to-indigo-700' },
  { label: 'Generate Report', path: '/reports', icon: FileText, color: 'from-emerald-500 to-emerald-700' },
];

const SUGGESTIONS = [
  'My patient has persistent fever and cough for 3 days.',
  'Analyze chest pain with hypertension history.',
  'What\'s the risk for a 60-year-old diabetic patient?',
  'Recommend treatment for Type 2 diabetes.',
];

const FloatingAssistant = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hello Dr. Yamini! 👋 I\'m your MedAssist AI. Ask me about symptoms, diseases, or patient cases.' },
  ]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: 'ai', text: `I've analyzed your query: "${text}". For a complete diagnosis, please use the Symptom Analysis module. Would you like me to redirect you there?` },
      ]);
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card rounded-2xl border border-cyan-500/25 overflow-hidden shadow-2xl shadow-cyan-500/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/8 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[12px] font-black text-white">MedAssist AI</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-emerald-400 font-semibold">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex gap-2 p-3 border-b border-white/5 flex-wrap">
              {QUICK_CHIPS.map(chip => {
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.label}
                    onClick={() => { setOpen(false); navigate(chip.path); }}
                    className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r ${chip.color} text-white hover:opacity-90 transition-all`}
                  >
                    <Icon size={10} /> {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 p-3 h-52 overflow-y-auto">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[11px] leading-relaxed font-medium
                    ${msg.from === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white'
                      : 'bg-white/8 border border-white/10 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="px-3 pb-2">
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Suggestions</p>
              <div className="flex flex-col gap-1">
                {SUGGESTIONS.slice(0, 2).map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-left text-[10px] text-slate-400 hover:text-cyan-400 transition-colors truncate font-medium px-2 py-1 rounded-lg hover:bg-white/5"
                  >
                    → {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/8">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe symptoms or ask anything..."
                  className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white disabled:opacity-40 transition-all hover:scale-110"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all"
        style={{ filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.5))' }}
      >
        <motion.div animate={open ? { rotate: 180 } : { rotate: 0 }} transition={{ duration: 0.3 }}>
          {open ? <X size={22} className="text-white" /> : <Sparkles size={22} className="text-white" />}
        </motion.div>

        {/* Pulse ring */}
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-cyan-400"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />
        )}
      </motion.button>
    </>
  );
};

export default FloatingAssistant;
