import React, { useState, useMemo } from 'react';
import { YONI_DATA } from './constants';
import { YoniDefinition, DomainGroup } from './types';
import SessionOverlay from './components/SessionOverlay';

const App: React.FC = () => {
  const [selectedYoni, setSelectedYoni] = useState<YoniDefinition | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  // Group data by Level for the chart visualization
  // The levels in the constants are ordered 1-84 (ascending IDs).
  // Visual chart shows ascending from bottom (Tamas) to top (Liberated).
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

    // We want to render in reverse order of the typical list to make a "Ladder"
    // Tamas (ID 1) at bottom, Liberated (ID 84) at top.
    // The keys currently might be inserted in order of encounter. 
    // Let's rely on the IDs to sort the groups.
    return Object.values(groups).sort((a, b) => b.yonis[0].id - a.yonis[0].id);
  }, []);

  const handleYoniClick = (yoni: YoniDefinition) => {
    setSelectedYoni(yoni);
  };

  return (
    <div className="min-h-screen bg-deep-space text-slate-200 selection:bg-astral-cyan selection:text-black pb-20">
      
      {/* Intro / Training Modal */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 p-8 max-w-2xl w-full rounded-2xl shadow-2xl">
            <h1 className="text-3xl font-light text-white mb-6 tracking-widest">PROTOCOL INITIALIZATION</h1>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>There is no scientifically validated frequency that guarantees a state. This system builds a <strong>repeatable sensory anchor</strong>.</p>
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-astral-cyan">
                <h3 className="text-astral-cyan font-bold uppercase text-xs mb-2 tracking-widest">Session Rules</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Duration:</strong> 45 to 90 seconds per press.</li>
                  <li><strong>Breath:</strong> Inhale 4s, Exhale 6s.</li>
                  <li><strong>Attention:</strong> Feel the vibration at <em>one</em> fixed location in the body.</li>
                  <li><strong>Goal:</strong> Do not chase visuals. Chase steadiness.</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 mt-4">Note: Ensure your device is not in Silent Mode for haptics/audio.</p>
            </div>
            <button 
              onClick={() => setShowIntro(false)}
              className="mt-8 w-full bg-astral-cyan hover:bg-cyan-400 text-deep-space font-bold py-4 rounded-lg transition-colors tracking-widest uppercase text-sm"
            >
              Enter the Matrix
            </button>
          </div>
        </div>
      )}

      {/* Main UI */}
      <header className="pt-12 pb-8 px-6 text-center">
        <h1 className="text-2xl md:text-4xl font-extralight tracking-[0.15em] text-white">
          THE 84 YONI <br className="hidden md:block"/>
          <span className="text-astral-cyan font-normal">CONSCIOUSNESS MATRIX</span>
        </h1>
        <p className="mt-2 text-xs md:text-sm text-slate-500 tracking-widest uppercase">
          Precision-Grade Frequency System
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 overflow-x-auto">
        <div className="min-w-[800px] flex flex-col space-y-6">
          
          {/* Chart Header Axis */}
          <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-widest text-slate-600 mb-2 border-b border-slate-800 pb-2">
            <div className="col-span-2 text-left pl-4">Depth</div>
            <div className="col-span-10 text-center">Complexity of Experience &rarr;</div>
          </div>

          {/* Rows */}
          {domainGroups.map((group) => (
            <div key={group.name} className="relative grid grid-cols-12 gap-4 items-center group">
              
              {/* Y-Axis Label */}
              <div className="col-span-2 flex flex-col justify-center border-r border-slate-800 pr-4 h-full">
                <span className="text-sm font-bold text-slate-200">{group.level}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">{group.name}</span>
              </div>

              {/* Buttons Area */}
              <div className="col-span-10 flex items-center gap-3">
                {group.yonis.map((yoni) => (
                  <button
                    key={yoni.id}
                    onClick={() => handleYoniClick(yoni)}
                    className={`
                      relative w-12 h-12 rounded-full flex items-center justify-center 
                      bg-slate-800 border border-slate-700 
                      hover:scale-110 hover:border-white transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-white/50
                      group/btn
                    `}
                  >
                    {/* Inner Colored Indicator */}
                    <div className={`absolute inset-0 m-1 rounded-full opacity-30 group-hover/btn:opacity-60 transition-opacity ${yoni.colorClass}`}></div>
                    
                    {/* Number */}
                    <span className="relative z-10 text-xs font-mono font-medium text-slate-300 group-hover/btn:text-white">
                      {yoni.id}
                    </span>

                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-slate-900 border border-slate-700 px-3 py-1 rounded text-[10px] whitespace-nowrap pointer-events-none z-20 shadow-xl">
                      <div className="text-astral-cyan font-bold">{yoni.soundHz.toFixed(1)} Hz</div>
                      <div className="text-slate-400">{yoni.pulseHz} Hz Pulse</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Horizontal Guidelines */}
              <div className="absolute inset-x-0 bottom-0 border-b border-slate-800/30 -z-10 translate-y-3"></div>
            </div>
          ))}

          {/* X-Axis Footer */}
           <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-widest text-slate-600 mt-4 pt-2 border-t border-slate-800">
            <div className="col-span-2"></div>
            <div className="col-span-10 flex justify-between px-2">
              <span>Simple</span>
              <span>Reactive</span>
              <span>Social</span>
              <span>Strategic</span>
              <span>Abstract</span>
              <span>Meta</span>
              <span>Non-Dual</span>
            </div>
          </div>

        </div>
      </main>

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