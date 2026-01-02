import React, { useEffect, useState, useMemo } from 'react';
import { YoniDefinition } from '../types';
import BreathGuide from './BreathGuide';
import { audioEngine } from '../services/audioEngine';
import { getKnowledge } from '../utils/knowledge';

interface SessionOverlayProps {
  yoni: YoniDefinition;
  onClose: () => void;
}

const DURATIONS = [45, 60, 90];

const SessionOverlay: React.FC<SessionOverlayProps> = ({ yoni, onClose }) => {
  const [duration, setDuration] = useState(90); // Default duration
  const [timeLeft, setTimeLeft] = useState(90);
  const [hasStarted, setHasStarted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Generate knowledge text based on the selected Yoni
  const knowledge = useMemo(() => getKnowledge(yoni.id, yoni.domainName), [yoni]);

  // Sync timeLeft with duration changes while in setup mode
  useEffect(() => {
    if (!hasStarted) {
      setTimeLeft(duration);
    }
  }, [duration, hasStarted]);

  // Timer logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (hasStarted && !isExiting) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleStop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, isExiting]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopSession();
    };
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    audioEngine.startSession(yoni.soundHz, yoni.pulseHz, yoni.vibrationHz);
  };

  const handleStop = () => {
    setIsExiting(true);
    audioEngine.stopSession();
    setTimeout(onClose, 1000); // Allow fade out visual
  };

  // Calculate dynamic pulse duration
  const pulseDuration = `${1 / yoni.pulseHz}s`;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      
      <div className="flex flex-col items-center w-full max-w-md p-8 space-y-10 overflow-y-auto max-h-screen">
        
        {/* Header Info - Always Visible */}
        <div className="text-center space-y-2 shrink-0">
          <div className="flex items-center justify-center space-x-3">
            <span 
              className={`inline-block w-3 h-3 rounded-full ${yoni.colorClass} shadow-[0_0_10px_currentColor] ${hasStarted ? 'animate-pulse' : 'opacity-50'}`}
              style={{ animationDuration: hasStarted ? pulseDuration : undefined }}
            ></span>
            <h2 className="text-3xl font-light tracking-[0.2em] text-white">YONI {yoni.id}</h2>
            <span 
              className={`inline-block w-3 h-3 rounded-full ${yoni.colorClass} shadow-[0_0_10px_currentColor] ${hasStarted ? 'animate-pulse' : 'opacity-50'}`}
              style={{ animationDuration: hasStarted ? pulseDuration : undefined }}
            ></span>
          </div>
          <p className="text-astral-cyan tracking-widest uppercase text-xs opacity-80">{yoni.levelName}</p>
          <div className="flex justify-center space-x-4 text-[10px] text-slate-500 font-mono mt-2">
            <span>{yoni.soundHz.toFixed(1)} Hz Tone</span>
            <span>•</span>
            <span>{yoni.pulseHz.toFixed(1)} Hz Pulse</span>
          </div>
        </div>

        {!hasStarted ? (
          /* SETUP PHASE */
          <div className="w-full flex flex-col items-center space-y-8 animate-[fadeIn_0.5s_ease-out]">
             {/* Knowledge Block */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 w-full text-center space-y-3 backdrop-blur-sm">
              <h3 className={`text-xs uppercase tracking-widest font-bold ${yoni.colorClass.replace('bg-', 'text-')}`}>
                {knowledge.stageTitle}
              </h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                {knowledge.description}
              </p>
            </div>

            {/* Duration Selector */}
            <div className="space-y-4 w-full">
              <p className="text-center text-[10px] uppercase tracking-widest text-slate-500">Select Protocol Duration</p>
              <div className="grid grid-cols-3 gap-3">
                {DURATIONS.map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setDuration(sec)}
                    className={`
                      py-3 rounded-lg border text-xs font-mono transition-all duration-300
                      ${duration === sec 
                        ? `border-astral-cyan bg-astral-cyan/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]` 
                        : 'border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300'}
                    `}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className={`
                w-full py-4 rounded-xl font-bold tracking-[0.2em] uppercase text-sm transition-all duration-300
                bg-white text-black hover:bg-astral-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]
              `}
            >
              Initiate Link
            </button>
          </div>
        ) : (
          /* ACTIVE SESSION PHASE */
          <>
            {/* Dynamic Breath Visual & Pulse Anchor */}
            <div className="shrink-0 relative flex items-center justify-center animate-[fadeIn_1s_ease-out]">
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

            {/* Controls */}
            <div className="w-full flex flex-col items-center space-y-6 shrink-0 animate-[slideUp_0.5s_ease-out]">
              <div className="font-mono text-4xl text-white/90 tabular-nums">
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
              
              <div className="space-y-3 flex flex-col items-center w-full">
                <button 
                  onClick={handleStop}
                  className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 text-sm tracking-widest uppercase w-48"
                >
                  Terminate
                </button>
                <p className="text-slate-600 text-[10px] uppercase tracking-widest">
                  Focus on the Vibration
                </p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SessionOverlay;