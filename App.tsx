import React, { useState, useMemo } from 'react';
import { YONI_DATA } from './constants';
import { YoniDefinition, DomainGroup } from './types';
import SessionOverlay from './components/SessionOverlay';

const App: React.FC = () => {
  const [selectedYoni, setSelectedYoni] = useState<YoniDefinition | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  // Group data by Level for the chart visualization
  const domainGroups = useMemo(() => {
    const groups: Record<string, DomainGroup> = {};
    
    YONI_DATA.forEach(yoni => {
      const key = yoni.levelName;
      if (!groups[key]) {
        groups[key] = {
          name: yoni.domainName,
          level: yoni.levelName,
          yonis: []
        };
      }
      groups[key].yonis.push(yoni);
    });

    return Object.values(groups).sort((a, b) => b.yonis[0].id - a.yonis[0].id);
  }, []);

  const handleYoniClick = (yoni: YoniDefinition) => {
    setSelectedYoni(yoni);
  };

  return (
    <div className="min-h-screen bg-deep-space text-slate-200 selection:bg-astral-cyan selection:text-black pb-24 relative overflow-hidden">
      
      {/* Ambient Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10"
           style={{
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      ></div>
      
      {/* Intro / Training Modal */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 transition-all duration-500">
          <div className="bg-slate-900/80 border border-slate-700/50 p-8 max-w-2xl w-full rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-astral-cyan to-transparent opacity-50"></div>

            <h1 className="text-3xl font-light text-white mb-6 tracking-[0.2em] uppercase">Protocol Initialization</h1>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>There is no scientifically validated frequency that guarantees a state. This system builds a <strong>repeatable sensory anchor</strong>.</p>
              <div className="bg-slate-800/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
                <h3 className="text-astral-cyan font-bold uppercase text-xs mb-4 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-astral-cyan animate-pulse"></span>
                  Session Rules
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <li className="flex flex-col"><span className="text-slate-500 uppercase">Duration</span> <span className="text-white">45-90s / press</span></li>
                  <li className="flex flex-col"><span className="text-slate-500 uppercase">Breath</span> <span className="text-white">In 4s, Out 6s</span></li>
                  <li className="flex flex-col"><span className="text-slate-500 uppercase">Attention</span> <span className="text-white">Fixed body location</span></li>
                  <li className="flex flex-col"><span className="text-slate-500 uppercase">Goal</span> <span className="text-white">Chase steadiness</span></li>
                </ul>
              </div>
              <p className="text-[10px] text-slate-500 mt-4 font-mono uppercase text-center border-t border-white/5 pt-4">Audio & Haptics Required</p>
            </div>
            <button 
              onClick={() => setShowIntro(false)}
              className="mt-8 w-full bg-white/5 hover:bg-astral-cyan hover:text-black border border-astral-cyan/30 hover:border-astral-cyan text-astral-cyan font-bold py-4 rounded-xl transition-all duration-300 tracking-[0.2em] uppercase text-xs shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              Enter the Matrix
            </button>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div className="relative z-10">
        <header className="pt-16 pb-12 px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-thin tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            84 YONI <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-astral-cyan to-blue-500 font-medium">MATRIX</span>
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] md:text-xs text-slate-500 tracking-widest uppercase font-mono">
             <span>Sound</span>
             <span className="w-1 h-1 rounded-full bg-slate-700"></span>
             <span>Vibration</span>
             <span className="w-1 h-1 rounded-full bg-slate-700"></span>
             <span>Pulse</span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 overflow-x-auto pb-12 scrollbar-hide">
          <div className="min-w-[900px] flex flex-col space-y-8 pl-4 pr-4">
            
            {/* Header Axis */}
            <div className="grid grid-cols-12 gap-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 border-b border-slate-800/50 pb-4">
              <div className="col-span-2 text-left pl-4 opacity-50">Domain</div>
              <div className="col-span-10 text-center opacity-50">Frequency Complexity Gradient &rarr;</div>
            </div>

            {/* Rows */}
            {domainGroups.map((group, index) => (
              <div key={group.name} className="relative grid grid-cols-12 gap-6 items-center group/row">
                
                {/* Connecting Track Line behind buttons */}
                <div className="absolute left-[16.66%] right-0 top-1/2 h-[1px] bg-gradient-to-r from-slate-800 via-slate-800 to-transparent -z-10 opacity-30"></div>

                {/* Y-Axis Label */}
                <div className="col-span-2 flex flex-col justify-center border-r border-slate-800/50 pr-6 h-full text-right relative">
                  <span className="text-sm md:text-base font-medium text-slate-200 group-hover/row:text-white transition-colors duration-500">
                    {group.level}
                  </span>
                  <span className="text-[9px] text-astral-cyan uppercase tracking-widest font-mono opacity-60 group-hover/row:opacity-100 transition-opacity">
                    {group.name}
                  </span>
                  {/* Active indicator dot */}
                  <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-700 group-hover/row:bg-astral-cyan group-hover/row:shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-500"></div>
                </div>

                {/* Buttons Area */}
                <div className="col-span-10 flex items-center justify-between relative">
                  {group.yonis.map((yoni, i) => (
                    <button
                      key={yoni.id}
                      onClick={() => handleYoniClick(yoni)}
                      // The text color utility is used to drive the border and shadow colors dynamically via currentColor
                      className={`
                        group/btn relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center 
                        transition-all duration-500 ease-out outline-none
                        ${yoni.colorClass.replace('bg-', 'text-')}
                      `}
                    >
                      {/* Glass Body */}
                      <div className="absolute inset-0 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/5 group-hover/btn:border-current group-hover/btn:bg-slate-900/90 transition-all duration-300 z-10"></div>
                      
                      {/* Inner Core Light */}
                      <div className="absolute inset-[35%] rounded-full bg-current opacity-20 group-hover/btn:opacity-100 group-hover/btn:inset-[42%] transition-all duration-500 blur-[2px] z-20 shadow-[0_0_15px_currentColor]"></div>
                      
                      {/* Hover Halo Ring */}
                      <div className="absolute inset-[-4px] rounded-full border border-current opacity-0 scale-90 group-hover/btn:scale-100 group-hover/btn:opacity-20 transition-all duration-500 z-0"></div>

                      {/* Number */}
                      <span className="relative z-30 text-[10px] md:text-xs font-mono font-bold text-slate-500 group-hover/btn:text-white transition-colors duration-300">
                        {yoni.id}
                      </span>

                      {/* Tooltip */}
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 translate-y-2 group-hover/btn:translate-y-0 transition-all duration-300 bg-slate-950/90 border border-white/10 px-4 py-2 rounded-lg text-center pointer-events-none z-50 backdrop-blur-xl shadow-2xl min-w-[100px]">
                        <div className="text-white text-xs font-bold tracking-widest">{yoni.soundHz.toFixed(1)} <span className="text-[9px] text-slate-500 font-normal">Hz</span></div>
                        <div className="text-[9px] text-astral-cyan uppercase font-mono mt-1">{yoni.pulseHz} Hz Pulse</div>
                        {/* Little triangle arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 border-r border-b border-white/10 rotate-45"></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* X-Axis Footer */}
             <div className="grid grid-cols-12 gap-6 text-[9px] uppercase tracking-widest text-slate-600 mt-8 pt-4 border-t border-slate-800/30 font-mono">
              <div className="col-span-2"></div>
              <div className="col-span-10 flex justify-between px-2 opacity-60">
                <span>Inception</span>
                <span>Gathering</span>
                <span>Friction</span>
                <span>Resonance</span>
                <span>Integration</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {selectedYoni && (
        <SessionOverlay 
          yoni={selectedYoni} 
          onClose={() => setSelectedYoni(null)} 
        />
      )}
    </div>
  );
};

export default App;