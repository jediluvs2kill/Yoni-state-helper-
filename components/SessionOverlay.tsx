import React, { useEffect, useState } from 'react';
import { YoniDefinition } from '../types';
import BreathGuide from './BreathGuide';
import { audioEngine } from '../services/audioEngine';

interface SessionOverlayProps {
  yoni: YoniDefinition;
  onClose: () => void;
}

const SessionOverlay: React.FC<SessionOverlayProps> = ({ yoni, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(90); // Default to max 90s
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Start Audio Engine
    audioEngine.startSession(yoni.soundHz, yoni.pulseHz, yoni.vibrationHz);
    setIsActive(true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleStop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      audioEngine.stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yoni]);

  const handleStop = () => {
    setIsActive(false);
    audioEngine.stopSession();
    setTimeout(onClose, 1000); // Allow fade out visual
  };

  // Calculate dynamic pulse duration
  const pulseDuration = `${1 / yoni.pulseHz}s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-opacity duration-500">
      
      <div className="flex flex-col items-center w-full max-w-md p-8 space-y-12">
        
        {/* Header Info */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <span 
              className={`inline-block w-3 h-3 rounded-full ${yoni.colorClass} shadow-[0_0_10px_currentColor] animate-pulse`}
              style={{ animationDuration: pulseDuration }}
            ></span>
            <h2 className="text-3xl font-light tracking-[0.2em] text-white">YONI {yoni.id}</h2>
            <span 
              className={`inline-block w-3 h-3 rounded-full ${yoni.colorClass} shadow-[0_0_10px_currentColor] animate-pulse`}
              style={{ animationDuration: pulseDuration }}
            ></span>
          </div>
          <p className="text-astral-cyan tracking-widest uppercase text-xs opacity-80">{yoni.levelName}</p>
          <div className="flex justify-center space-x-4 text-[10px] text-slate-500 font-mono mt-2">
            <span>{yoni.soundHz.toFixed(1)} Hz Tone</span>
            <span>•</span>
            <span>{yoni.pulseHz.toFixed(1)} Hz Pulse</span>
          </div>
        </div>

        {/* Dynamic Breath Visual & Pulse Anchor */}
        <div className={`relative transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'} flex items-center justify-center`}>
           <BreathGuide colorClass={yoni.colorClass} />
           
           {/* Synced Pulse Ring */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div 
               className={`w-48 h-48 rounded-full border border-current opacity-30 animate-pulse ${yoni.colorClass.replace('bg-', 'text-')}`}
               style={{ animationDuration: pulseDuration }}
             ></div>
              {/* Inner Core Pulse */}
             <div 
               className={`absolute w-1 h-1 rounded-full ${yoni.colorClass} shadow-[0_0_15px_currentColor] animate-pulse opacity-80`}
               style={{ animationDuration: pulseDuration }}
             ></div>
           </div>
        </div>

        {/* Instruction */}
        <div className="text-center space-y-4">
           <p className="text-slate-400 text-sm font-light italic">
             "Do not chase visuals, chase steadiness."
           </p>
           <p className="text-slate-500 text-xs uppercase tracking-widest">
             Feel the vibration at one fixed location
           </p>
        </div>

        {/* Controls */}
        <div className="w-full flex flex-col items-center space-y-6">
          <div className="font-mono text-4xl text-white/90 tabular-nums">
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
          
          <button 
            onClick={handleStop}
            className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 text-sm tracking-widest uppercase"
          >
            End Session
          </button>
        </div>

      </div>
    </div>
  );
};

export default SessionOverlay;