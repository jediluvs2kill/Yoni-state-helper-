import React, { useEffect, useState } from 'react';

interface BreathGuideProps {
  colorClass: string;
}

const BreathGuide: React.FC<BreathGuideProps> = ({ colorClass }) => {
  const [stage, setStage] = useState<'Inhale' | 'Exhale'>('Inhale');
  
  // Clean color extraction for inline styles if needed, 
  // but we primarily use the tailwind class passed in for the ring color.

  useEffect(() => {
    // The cycle is 10s total (4s in, 6s out)
    const cycle = () => {
      setStage('Inhale');
      setTimeout(() => {
        setStage('Exhale');
      }, 4000);
    };

    cycle(); // Immediate start
    const interval = setInterval(cycle, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Glow Ring */}
      <div className={`absolute w-full h-full rounded-full opacity-20 animate-pulse-glow ${colorClass.replace('bg-', 'bg-')}`}></div>
      
      {/* Expanding/Contracting Circle */}
      <div 
        className={`w-32 h-32 rounded-full shadow-2xl backdrop-blur-sm bg-opacity-80 transition-all duration-1000 ease-in-out border border-white/20
          ${stage === 'Inhale' ? 'animate-breathe-in' : 'animate-breathe-out'}
          ${colorClass}
        `}
      ></div>

      {/* Text Label */}
      <div className="absolute z-10 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-light tracking-widest uppercase text-white drop-shadow-md">
          {stage}
        </span>
        <span className="text-xs text-white/60 mt-1 font-mono">
          {stage === 'Inhale' ? '4s' : '6s'}
        </span>
      </div>
    </div>
  );
};

export default BreathGuide;