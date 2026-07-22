import React from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 text-slate-100 transition-opacity duration-500">
      <div className="relative flex items-center justify-center">
        {/* Glowing backdrop circle */}
        <div className="absolute w-32 h-32 bg-sky-500/20 rounded-full blur-xl animate-pulse"></div>
        
        {/* Animated outer spinning ring */}
        <div className="w-24 h-24 rounded-full border-2 border-slate-800 border-t-sky-400 border-r-sky-500 animate-spin"></div>
        
        {/* Center Logo initials */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            EA
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mt-0.5">
            Portfolio
          </span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h4 className="text-sm font-medium text-slate-300 tracking-wide mb-1">
          Evan Akbar
        </h4>
        <p className="text-xs text-sky-400/80 font-mono animate-pulse">
          Loading Portfolio & Admin System...
        </p>
      </div>
    </div>
  );
};
