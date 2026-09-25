import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface ResidencesSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const ResidencesSection: React.FC<ResidencesSectionProps> = ({ onOpenModal }) => {
  const [activeTab, setActiveTab] = useState<'2bed' | '3bed' | '4bed'>('2bed');

  const configurations = [
    {
      id: '2bed' as const,
      type: '02 BED',
      name: 'Curated 2 BHK Residences',
      price: '₹1.60 Cr*',
      bracket: 'Optimal compact luxury for discerning urban families',
      features: [
        'Efficient spatial planning with minimal corridor wastage',
        'Deep deck / balcony orientation toward open internal greens',
        'Dedicated utility & well-proportioned modern kitchen layout',
        'Ideal for young professionals and high-yield investors',
      ],
      cta: 'GET 2 BED COST SHEET →',
      intent: 'cost_sheet' as LeadIntent,
      tag: 'High Liquidity & Demand',
    },
    {
      id: '3bed' as const,
      type: '03 BED',
      name: 'Expansive 3 BHK Residences',
      price: '₹2.40 Cr*',
      bracket: 'Grand living designed for modern multi-generational comfort',
      features: [
        'Generous living-dining promenade with floor-to-ceiling glass exposure',
        'Private master suite with dedicated wardrobe recess',
        'Cross-ventilated dual-aspect planning for maximum natural breeze',
        'Premium high-floor vantage overlooking landscaped podium gardens',
      ],
      cta: 'GET 3 BED COST SHEET →',
      intent: 'cost_sheet' as LeadIntent,
      tag: 'Flagship Configuration',
    },
    {
      id: '4bed' as const,
      type: '04 BED',
      name: 'Signature 4 BHK Residences',
      price: '₹3.60 Cr*',
      bracket: 'Limited edition trophy residences for elevated family estates',
      features: [
        'Palatial double-living entertaining space with panoramic balcony',
        'Twin master suites with luxury ensuite proportions',
        'Staff quarter / separate service entry provisions envisioned',
        'Exclusive tower positioning for unmatched privacy and stature',
      ],
      cta: 'GET 4 BED COST SHEET →',
      intent: 'cost_sheet' as LeadIntent,
      tag: 'Ultra-Exclusive Inventory',
    },
  ];

  const current = configurations.find((c) => c.id === activeTab) || configurations[0];

  return (
    <section id="residences" className="py-20 md:py-32 bg-[#F4EFEB] text-[#18181A] relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            02 · The Residences
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Section Title */}
        <div className="max-w-2xl mb-8 md:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181A] font-normal leading-tight">
            Curated Residences
          </h2>
          <p className="mt-2 text-sm md:text-base text-[#555559] font-light">
            Generous deck volumes, dual-aspect ventilation, and unhindered podium garden vistas.
          </p>
        </div>

        {/* Configuration Selector (Accessible Functional Buttons) */}
        <div className="flex border-b border-[#18181A]/15 mb-10 overflow-x-auto no-scrollbar gap-2 md:gap-8">
          {configurations.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                trackEvent('form_start', { configuration_tab: item.type });
              }}
              className={`pb-4 px-2 text-left transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === item.id
                  ? 'text-[#18181A] font-medium'
                  : 'text-[#18181A]/45 hover:text-[#18181A]/75'
              }`}
            >
              <span className="font-serif text-2xl md:text-3xl block">{item.type}</span>
              <span className="text-[11px] uppercase tracking-wider block mt-0.5">
                From {item.price}
              </span>
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A07F55]" />
              )}
            </button>
          ))}
        </div>

        {/* Configuration Editorial Detail View */}
        <div className="bg-[#FAF8F5] rounded-3xl p-6 md:p-12 border border-[#18181A]/10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-[#A07F55] font-semibold">
                  {current.tag}
                </span>
                <span className="text-[#18181A]/20">·</span>
                <span className="text-xs text-[#555559]">Indicative Configuration</span>
              </div>

              <div>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#18181A] font-normal">
                  {current.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xs uppercase tracking-wider text-[#555559]">Indicative from</span>
                  <span className="font-serif text-3xl md:text-4xl text-[#18181A] tabular-nums font-medium">
                    {current.price}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#555559] italic font-light">
                  {current.bracket}
                </p>
              </div>

              {/* Editorial Highlights */}
              <div className="space-y-3 pt-2 border-t border-[#18181A]/8">
                {current.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs md:text-sm text-[#18181A]/80">
                    <CheckCircle2 className="w-4 h-4 text-[#A07F55] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    trackEvent('cost_sheet_click', { configuration: current.type });
                    onOpenModal('cost_sheet', `residences_${current.id}`);
                  }}
                  className="w-full sm:w-auto h-12 px-7 rounded-xl bg-[#18181A] hover:bg-[#28282B] text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                >
                  <span>{current.cta}</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Editorial Image Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#E8DFC9]/40 border border-[#18181A]/10">
                <img
                  src="/src/assets/images/residences_interior_balcony_1790328253674.jpg"
                  alt={`Prestige Thane ${current.type} residence concept`}
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-[10px] tracking-wider uppercase bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-xs">
                    Representative visual
                  </span>
                  <span className="text-[11px] text-[#E8DFC9] font-serif">
                    Living & Terrace Panorama
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="mt-6 text-center text-xs text-[#555559] italic">
          *Indicative market information. Official developer pricing is awaited and subject to change.
        </div>
      </div>
    </section>
  );
};
