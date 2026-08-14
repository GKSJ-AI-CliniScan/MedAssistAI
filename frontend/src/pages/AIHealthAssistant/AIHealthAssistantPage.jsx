import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, Brain, AlertTriangle, ShieldCheck, RefreshCw, Volume2, ArrowRight } from 'lucide-react';
import RippleButton from '../../components/ui/RippleButton';
import { toast } from 'react-toastify';

const quickPrompts = [
  { text: 'Analyze severe migraine and nausea', category: 'Symptom' },
  { text: 'Calculate cardiovascular risk factors', category: 'Risk' },
  { text: 'Explain HbA1c blood test report values', category: 'Reports' }
];

export const AIHealthAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Welcome to MedAssist Clinical AI Assistant. I can help analyze symptom profiles, explain lab findings, and outline lifestyle guidelines based on validated clinical diagnostic intelligence. What health inquiry can I assist you with today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    if (!textToSend) setInputValue('');

    const userMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      let botResponse = '';
      const q = query.toLowerCase();
      if (q.includes('migraine') || q.includes('headache')) {
        botResponse = 'Analysis: Migraine profile detected with moderate severity. \n\nSuggested Specialist: Neurologist\nConfidence: 89%\n\nLifestyle Advice: Rest in a dark, quiet room. Maintain consistent sleep patterns. Avoid triggers like aged cheese, red wine, or processed meats.';
      } else if (q.includes('cardio') || q.includes('heart') || q.includes('risk')) {
        botResponse = 'Analysis: Cardiovascular risk mapped from profile. Moderate indicators found in lipids.\n\nRecommended Tests: Lipid Panel, Electrocardiogram (ECG)\nConfidence: 94%\n\nPrecautions: Monitor blood pressure twice daily. Reduce saturated fat and increase dietary fiber.';
      } else if (q.includes('test') || q.includes('hba1c') || q.includes('report')) {
        botResponse = 'Analysis: Glucose homeostasis assessment. An HbA1c value of 6.2% is within the prediabetic range.\n\nSuggested Plan: HbA1c screening test every 6 months, and active carbohydrate tracking.\nConfidence: 97%';
      } else {
        botResponse = "I have mapped your query to our clinical database. Based on the symptom checklist, no severe emergency indicators were highlighted. I recommend checking our specific 'Symptom Analysis' or 'Risk Assessment' tabs for full circular gauge details.";
      }

      setMessages(prev => [...prev, {
        id: `msg_${Date.now() + 1}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto h-[82vh] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="text-cyan-400" /> AI Health Assistant
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Real-time clinical intelligence engine</p>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left main chat console */}
        <div className="md:col-span-2 glass-card rounded-3xl border border-white/8 flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/50 to-transparent pointer-events-none" />

          {/* Messages window */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8.5 h-8.5 rounded-xl border flex items-center justify-center shrink-0 text-xs font-bold
                  ${m.sender === 'user'
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-glow-primary/10'
                    : 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400 shadow-glow-secondary/10'}`}>
                  {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed border whitespace-pre-line
                    ${m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600/10 to-indigo-600/10 border-white/8 text-slate-100 rounded-tr-none'
                      : 'bg-white/3 border-white/5 text-slate-200 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-550 block text-right px-1">{m.timestamp}</span>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-3.5 max-w-[80%]">
                <div className="w-8.5 h-8.5 rounded-xl bg-indigo-500/10 border border-indigo-500/35 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot size={14} />
                </div>
                <div className="p-4 rounded-2xl bg-white/3 border border-white/5 rounded-tl-none flex items-center gap-1">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-indigo-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-indigo-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-indigo-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Inputs */}
          <div className="p-4 border-t border-white/5 bg-slate-950/20 backdrop-blur-md shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2.5"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything about medical cases, diagnostics, remedies..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all duration-200"
              />
              <button
                type="button"
                className="p-3 bg-white/3 hover:bg-white/8 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all focus:outline-none"
                onClick={() => toast.info('Voice Input is simulated.')}
              >
                <Volume2 size={15} />
              </button>
              <RippleButton type="submit" variant="primary" className="px-5 py-3 rounded-xl">
                <Send size={14} />
              </RippleButton>
            </form>
          </div>
        </div>

        {/* Right Info Cards */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Quick Prompts */}
          <div className="glass-card rounded-3xl p-5 border border-white/8 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Brain size={14} className="text-cyan-400" /> Quick Prompts
            </h3>
            <div className="space-y-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  className="w-full p-3 rounded-2xl bg-white/3 hover:bg-cyan-500/5 border border-white/5 hover:border-cyan-500/20 text-left text-[11px] text-slate-350 transition-all focus:outline-none flex items-center justify-between group"
                >
                  <span className="font-semibold">{p.text}</span>
                  <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-cyan-400 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Legal / Medical Disclaimer card */}
          <div className="glass-card rounded-3xl p-5 border border-white/8 bg-rose-500/5 border-rose-500/15 space-y-2.5">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle size={14} /> Clinical Disclaimer
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              MedAssist AI clinical responses are generated using advanced healthcare AI algorithms for clinical decision-support and educational purposes. This is not a substitute for direct physical examination. Always seek direct consultation from certified clinical doctors for severe symptoms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHealthAssistantPage;
