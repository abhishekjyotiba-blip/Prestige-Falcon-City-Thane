import React from 'react';
import { Lock, Eye, Bell, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface FloorPlanCuriositySectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string, config?: string) => void;
}

export const FloorPlanCuriositySection: React.FC<FloorPlanCuriositySectionProps> = ({ onOpenModal }) => {
  const layouts = [
    {
      type: '2 BED',
      area: 'Approx. 720 – 790 Sq.Ft.*',
      tag: 'COMPACT LUXURY',
      desc: 'Smart 2-bedroom with separate dining alcove and open deck.',
      intent: '2bhk',
    },
    {
      type: '3 BED',
      area: 'Approx. 1,050 – 1,180 Sq.Ft.*',
      tag: 'FLAGSHIP POPULAR',
      desc: 'Dual-balcony master layout with walk-in wardrobe recess.',
      intent: '3bhk',
    },
    {
      type: '4 BED',
      area: 'Approx. 1,550 – 1,750 Sq.Ft.*',
      tag: 'LIMITED SIGNATURE',
      desc: 'Double-living grand entertainment hall with sky deck.',
      intent: '4bhk',
    },
  ];

  return (
    <section id="floor-plans" className="py-12 md:py-18 bg-[#F5F1E9] text-[#161616] relative">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#967E51] font-bold">
            ARCHITECTURAL BLUEPRINTS
          </span>
          <div className="h-px flex-1 bg-[#161616]/10 max-w-xs" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 gap-3">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-normal leading-tight">
              How does the space live?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#66625C] font-light max-w-md">
              Sanctioned architectural CAD blueprints showing usable carpet area, balcony deck dimensions, and Vastu orientations.
            </p>
          </div>

          <button
            onClick={() => {
              trackEvent('floor_plan_click', { cta: 'floor_plan_main_btn' });
              onOpenModal('floor_plan', 'floor_plan_header_btn');
            }}
            className="self-start md:self-auto h-11 px-5 rounded-xl bg-[#161616] hover:bg-[#202022] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Bell className="w-3.5 h-3.5 text-[#B59A68]" />
            <span>NOTIFY ME + SEND FLOOR PLANS</span>
          </button>
        </div>

        {/* 3 Locked Preview Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
          {layouts.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                trackEvent('floor_plan_click', { layout: item.type });
                onOpenModal(item.intent, `floor_plan_tile_${item.type}`, item.type);
              }}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#161616]/10 hover:border-[#B59A68] transition-all duration-300 shadow-md cursor-pointer p-4 flex flex-col justify-between"
            >
              <div>
                {/* Blueprint Crop with Frosted Blur Wall */}
                <div className="relative aspect-[16/11] rounded-xl overflow-hidden bg-[#161616] mb-3">
                  <img
                    src="/src/assets/images/floor_plan_detailed_1790331139257.jpg"
                    alt={`Prestige Thane ${item.type} Blueprint`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center filter blur-[4px] group-hover:blur-[2.5px] scale-105 group-hover:scale-110 transition-all duration-500 opacity-60"
                  />

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[9px]">
                    <span className="font-bold uppercase tracking-wider bg-black/70 backdrop-blur-xs text-[#F3ECE0] px-2 py-0.5 rounded border border-white/10">
                      {item.tag}
                    </span>
                    <span className="bg-red-950/80 text-red-200 border border-red-800/40 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Gated
                    </span>
                  </div>

                  {/* Centered Lock Stamp */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md text-[#B59A68] border border-[#B59A68]/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-1">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
                      FLOOR PLAN AVAILABLE ON RELEASE
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-xl text-[#161616] font-normal">
                    {item.type} RESIDENCE
                  </h3>
                  <span className="text-[10px] font-mono font-semibold text-[#B59A68]">
                    {item.area}
                  </span>
                </div>
                <p className="text-[11px] text-[#66625C] leading-snug">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#161616]/8 flex items-center justify-between text-xs font-bold text-[#967E51] group-hover:text-[#161616] transition-colors">
                <span>Unlock Sanctioned Layout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Micro note */}
        <div className="p-3 rounded-xl bg-white border border-[#161616]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#66625C] gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B59A68] shrink-0" />
            <span>Receive verified MahaRERA sanctioned layouts immediately when officially released.</span>
          </div>
          <button
            onClick={() => onOpenModal('floor_plan', 'floor_plan_micro_strip')}
            className="text-[#967E51] font-bold hover:underline cursor-pointer whitespace-nowrap"
          >
            Join Layout Release Alert →
          </button>
        </div>
      </div>
    </section>
  );
};
