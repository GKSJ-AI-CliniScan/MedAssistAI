import React from 'react';
import { SyncLoader } from 'react-spinners';

export const PageLoader = ({ message = 'Analyzing clinical datasets...' }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#060913] flex flex-col items-center justify-center gap-4">
      {/* Animated glowing mesh backdrop */}
      <div className="absolute inset-0 mesh-bg">
        <div className="mesh-circle-1" />
        <div className="mesh-circle-2" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Pulsating medical icon indicator */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-75" />
          <div className="absolute inset-2 rounded-full border-2 border-indigo-500/50 animate-pulse" />
          <svg className="w-8 h-8 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <SyncLoader color="#06b6d4" size={10} speedMultiplier={0.7} />
        <span className="text-slate-400 font-semibold tracking-widest uppercase text-xs mt-2">
          {message}
        </span>
      </div>
    </div>
  );
};

export const InlineLoader = ({ size = 8, color = '#06b6d4' }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <SyncLoader color={color} size={size} margin={4} />
    </div>
  );
};

export default PageLoader;
