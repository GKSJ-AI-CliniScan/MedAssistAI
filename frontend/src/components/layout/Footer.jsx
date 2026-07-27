import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#070b14]/85 py-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            MA
          </div>
          <span className="text-xs font-semibold tracking-wider text-slate-400">
            &copy; {new Date().getFullYear()} MedAssist AI. All rights reserved.
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Architected with</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
          <span>for clinical diagnostic precision</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-450">
          <a href="#privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
          <a href="#clinical-disclaimer" className="hover:text-cyan-400 transition-colors">Clinical Disclaimer</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
