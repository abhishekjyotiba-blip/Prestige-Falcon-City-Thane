import React, { useState } from 'react';
import { Lock, Eye, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface FloorPlanSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const FloorPlanSection: React.FC<FloorPlanSectionProps> = ({ onOpenModal }) => {
  const [selectedPlan, setSelectedPlan] = useState<'2bed' | '3bed' | '4bed'>('3bed');

  const plans = [
    {
      id: '2bed' as const,
      type: '02 BED RESIDENCE',
      area: 'Approx. 720 - 790 Sq.Ft.*',
      tag: 'COMPACT LUXURY',
      desc: 'Smart 2-bedroom with separate dining alcove and open deck.',
    },
    {
      id: '3bed' as const,
      type: '03 BED RESIDENCE',
      area: 'Approx. 1,050 - 1,180 Sq.Ft.*',
      tag: 'MOST POPULAR',
      desc: 'Dual-balcony master layout with walk-in wardrobe recess.',
    },
    {
      id: '4bed' as const,
      type: '04 BED SIGNATURE',
      area: 'Approx. 1,550 - 1,750 Sq.Ft.*',
      tag: 'LIMITED EDITION',
      desc: 'Double-living grand entertainment hall with panoramic sky deck.',
    },
  ];

  return (
    <section id="floor-plans" className="py-16 md:py-24 bg-[#FAF8F5] text-[#18181A] relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            ARCHITECTURAL LAYOUTS
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181A] font-normal leading-tight">
              Detailed Floor Plans
            </h2>
            <p className="mt-2 text-sm md:text-base text-[#555559] font-light">
              Explore usable carpet layout, room proportions, and balcony orientation.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex p-1 bg-[#F4EFEB] rounded-xl border border-[#18181A]/10 self-start md:self-auto">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedPlan === p.id
                    ? 'bg-[#18181A] text-white shadow-xs'
                    : 'text-[#18181A]/60 hover:text-[#18181A]'
                }`}
              >
                {p.type.split(' ')[0]} BHK
              </button>
            ))}
          </div>
        </div>

        {/* Visual Gated Blueprint Stage */}
        <div
          onClick={() => {
            trackEvent('floor_plan_click', { plan: selectedPlan });
            onOpenModal('floor_plan', `floor_plan_${selectedPlan}`);
          }}
          className="relative rounded-3xl overflow-hidden bg-[#18181A] border border-[#18181A]/15 shadow-2xl cursor-pointer group"
        >
          {/* Blueprint Graphic with Visible Architecture behind Gentle Blur */}
          <div className="relative aspect-[16/11] md:aspect-[21/10] w-full overflow-hidden">
            <img
              src="/src/assets/images/floor_plan_detailed_1790331139257.jpg"
              alt="Prestige Thane Floor Plan Schematic Blueprint"
              loading="lazy"
              className="w-full h-full object-cover object-center filter blur-[4.5px] group-hover:blur-[2.5px] scale-102 group-hover:scale-105 transition-all duration-500 opacity-65"
            />

            {/* Architectural Grid overlay */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(197, 168, 128, 0.2) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(197, 168, 128, 0.2) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Blueprint Tag Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 text-xs">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 text-white">
                <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                <span className="font-mono text-[11px] text-[#C5A880]">CAD SCHEMATIC</span>
                <span className="text-white/40">·</span>
                <span className="font-semibold">{plans.find((p) => p.id === selectedPlan)?.type}</span>
              </div>
              <span className="bg-black/70 backdrop-blur-md text-[#E8DFC9] border border-white/10 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-semibold">
                {plans.find((p) => p.id === selectedPlan)?.area}
              </span>
            </div>

            {/* Central Tempting Blur Wall Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/45 backdrop-blur-[2px] text-center">
              <div className="bg-[#18181A]/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-[#C5A880]/40 shadow-2xl max-w-md w-full group-hover:scale-102 transition-transform">
                <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center mx-auto mb-3 border border-[#C5A880]/40">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold mb-1">
                  OFFICIAL FLOOR PLANS AWAITED
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-normal mb-1">
                  UNLOCK {selectedPlan.toUpperCase()} BLUEPRINT
                </h3>
                <p className="text-xs text-white/70 mb-5 leading-relaxed">
                  Be the first to inspect sanctioned carpet measurements, room-by-room dimensions, and balcony layouts.
                </p>

                <button
                  type="button"
                  className="w-full h-12 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#18181A] font-bold text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4 text-[#A07F55]" />
                  <span>VIEW HIGH-RESOLUTION LAYOUT →</span>
                </button>

                <span className="text-[10px] text-white/50 block mt-2.5">
                  Download instantly via WhatsApp & PDF
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Interactive Quick Preview Cards for Other Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {plans.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPlan(p.id);
                onOpenModal('floor_plan', `plan_card_${p.id}`);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedPlan === p.id
                  ? 'bg-white border-[#A07F55] shadow-md'
                  : 'bg-[#F4EFEB] border-[#18181A]/8 hover:border-[#18181A]/25'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#18181A]">{p.type}</span>
                <span className="text-[10px] text-[#A07F55] uppercase font-bold">{p.tag}</span>
              </div>
              <div className="text-xs text-[#555559] font-mono">{p.area}</div>
              <div className="mt-2 pt-2 border-t border-[#18181A]/8 flex items-center justify-between text-[11px] text-[#A07F55] font-semibold">
                <span>Unlock Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
