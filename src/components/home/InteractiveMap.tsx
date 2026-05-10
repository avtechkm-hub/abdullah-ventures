"use client";
import React, { useState } from 'react';
import { Target, Search, Clock, ShieldCheck, Zap } from 'lucide-react';
import WorldMapPNG from '../../assets/world-map.png';

const hubData = [
  {
    id: 'me',
    name: 'Middle East',
    desc: 'Oil, gas & energy sector partnerships',
    icon: Zap,
    top: '41%', // Coordinates adjusted for the strict AR lock
    left: '54%',
  },
  {
    id: 'bd',
    name: 'Bangladesh',
    desc: 'HQ & Main Operations Center',
    icon: ShieldCheck,
    top: '52%',
    left: '68%',
  },
  {
    id: 'sk',
    name: 'South Korea',
    desc: 'Technology & Medical Sourcing',
    icon: Search,
    top: '38%',
    left: '78%',
  },
  {
    id: 'sa',
    name: 'South Africa',
    desc: 'Mining & Minerals Sourcing Network',
    icon: Clock,
    top: '76%',
    left: '54%',
  },
  {
    id: 'in',
    name: 'India',
    desc: 'Agricultural Commodities Hub',
    icon: Target,
    top: '56%',
    left: '65%',
  },
];

const InteractiveMap = () => {
  const [activeHubId, setActiveHubId] = useState('bd'); // Default to HQ

  const activeHub = hubData.find((hub) => hub.id === activeHubId);

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-slate-50 px-4 sm:px-6 lg:px-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Global Trade <span className="text-blue-600">Infrastructure</span>
          </h2>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto mt-4 mb-4"></div>
          <p className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-[0.2em] sm:tracking-[0.4em]">
            9+ Nations | Strategic Hubs | Real-time Logistics
          </p>
        </div>

        {/* --- Map Container: STRICT ASPECT RATIO LOCK for COORDINATE FIX --- */}
        {/* We use aspect-[16/10] to strictly lock the container to the image's geometry. */}
        <div className="relative aspect-[16/10] max-w-6xl mx-auto rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 sm:border-8 border-slate-900 bg-slate-900">
          <img
            src={WorldMapPNG.src}
            alt="World Trade Map"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />

          {/* Scanning Line Animation (RESTORING PREVIOUS DESIGN) */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent h-1/2 w-full animate-scan z-0"></div>

          {/* Interactive Layer */}
          <div className="absolute inset-0 z-10">
            {hubData.map((hub) => {
              const isActive = activeHubId === hub.id;

              return (
                <button
                  key={hub.id}
                  onClick={() => setActiveHubId(hub.id)}
                  onMouseEnter={() => setActiveHubId(hub.id)}
                  className={`absolute group flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-10 h-10 bg-blue-600 scale-110 z-30'
                      : 'w-6 h-6 bg-white/20 hover:bg-white/40 z-20'
                  }`}
                  style={{ top: hub.top, left: hub.left, transform: 'translate(-50%, -50%)' }}
                >
                  {/* Inner Dot */}
                  <div className={`rounded-full transition-all duration-300 ${
                    isActive ? 'w-4 h-4 bg-white shadow-[0_0_15px_#fff]' : 'w-2 h-2 bg-blue-400'
                  }`} />
                  
                  {/* Radar Pulse (RESTORING PREVIOUS DESIGN) */}
                  {isActive && (
                    <>
                      <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75"></span>
                      <span className="absolute inset-[-8px] rounded-full border border-blue-400/30 animate-pulse"></span>
                    </>
                  )}
                </button>
              );
            })}

            {/* Premium Glassmorphism Tooltip (Desktop Only): RESTORING PREVIOUS DESIGN with COORDINATE FIX */}
            {activeHub && (
              <div
                className="absolute z-40 hidden md:flex w-[320px] bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/30 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] items-start gap-5 transition-all duration-500 animate-fadeIn"
                style={{
                  top: activeHub.top,
                  left: activeHub.left,
                  // Anchor directly above the point and lift by its height
                  transform: 'translate(-50%, calc(-100% - 20px))',
                }}
              >
                {/* Connector Triangle */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[12px] border-t-slate-900/90 border-r-[10px] border-r-transparent"></div>
                
                <div className="bg-blue-600 p-3 rounded-lg text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <activeHub.icon size={20} />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none">Active Hub</span>
                  </div>
                  <h4 className="font-black text-lg uppercase italic text-white leading-none tracking-tighter">
                    {activeHub.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-2.5 leading-relaxed">
                    {activeHub.desc}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Info Card (Stays fixed at bottom for usability) */}
            {activeHub && (
              <div className="absolute bottom-3 left-3 right-3 z-40 md:hidden bg-slate-900 p-4 rounded-xl border border-blue-500/30 flex items-center gap-3 shadow-xl">
                <div className="bg-blue-600 p-3 rounded-xl text-white">
                  <activeHub.icon size={16} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase italic text-white tracking-tighter leading-none">{activeHub.name}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-tight">{activeHub.desc}</p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 opacity-60"></div>
        </div>
      </div>
      
      {/* Tailwind Animation CSS */}
      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(200%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default InteractiveMap;