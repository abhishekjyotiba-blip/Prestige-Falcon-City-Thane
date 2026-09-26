import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, BedDouble, ShieldCheck } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface ConfigurationSelectorSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string, config?: string) => void;
}

export const ConfigurationSelectorSection: React.FC<ConfigurationSelectorSectionProps> = ({ onOpenModal }) => {
  const [activeTab, setActiveTab] = useState<'2bed' | '3bed' | '4bed'>('2bed');

  const configs = {
    '2bed': {
      label: '2 BED',
      name: 'Curated 2 BHK Residences',
      price: '₹1.60 Cr+*',
      carpet: 'Approx. 720 – 790 Sq.Ft.*',
      status: 'High Demand · Ideal for Young Families & Investors',
      desc: 'Smart, highly efficient spatial planning with dedicated dining alcove and open balcony deck overlooking landscaped podium courtyards.',
      intent: '2bhk',
      cta: 'GET 2 BED DETAILS →',
      features: [
        'Optimal zero-corridor layout',
        'Private deck with green podium orientation',
        'Modern modular kitchen with utility wash alcove',
      ],
    },
    '3bed': {
      label: '3 BED',
      name: 'Expansive 3 BHK Residences',
      price: '₹2.40 Cr+*',
      carpet: 'Approx. 1,050 – 1,180 Sq.Ft.*',
      status: 'Flagship Configuration · Multi-Generational Living',
      desc: 'Dual-aspect living-dining promenade with floor-to-ceiling glass exposure, twin master suites, and cross-ventilation designed for expansive family comfort.',
      intent: '3bhk',
      cta: 'GET 3 BED DETAILS →',
      features: [
        'Grand double living & dining promenade',
        'Private master suite with wardrobe recess',
        'Dual balconies with unhindered city vistas',
      ],
    },
    '4bed': {
      label: '4 BED',
      name: 'Signature 4 BHK Residences',
      price: '₹3.60 Cr+*',
      carpet: 'Approx. 1,550 – 1,750 Sq.Ft.*',
      status: 'Ultra-Exclusive · Limited Tower Inventory',
      desc: 'Trophy homes with palatial entertaining halls, double panoramic sky decks, and staff accommodations tailored for prestigious family estates.',
      intent: '4bhk',
      cta: 'GET 4 BED DETAILS →',
      features: [
        'Palatial entertaining hall with deep sky deck',
        'Ensuite washrooms for all bedrooms',
        'Dedicated staff quarters & private service entry',
      ],
    },
  };

  const current = configs[activeTab];

  return (
    <section id="residences" className="py-12 md:py-18 bg-[#EFE9DE] text-[#161616] relative border-y border-[#161616]/10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#967E51] font-bold">
            CONFIGURATION SELECTOR
          </span>
          <div className="h-px flex-1 bg-[#161616]/10 max-w-xs" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-normal leading-tight">
              Find your fit.
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#66625C] font-light">
              Interactive preview of 2, 3 & 4 BHK residences designed around Thane&apos;s next lifestyle rhythm.
            </p>
          </div>
        </div>

        {/* Segmented Selector Buttons */}
        <div className="grid grid-cols-3 p-1.5 bg-white rounded-2xl border border-[#161616]/10 shadow-xs mb-6 max-w-md">
          {(['2bed', '3bed', '4bed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                trackEvent('form_start', { configuration_tab: tab });
              }}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#161616] text-white shadow-xs'
                  : 'text-[#66625C] hover:text-[#161616]'
              }`}
            >
              {configs[tab].label}
            </button>
          ))}
        </div>

        {/* Selected Configuration Editorial Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-[#161616]/10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B59A68]/15 text-[#967E51] px-2.5 py-0.5 rounded-full">
                  {current.status}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#161616] font-normal">
                  {current.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xs text-[#66625C]">Indicative Starting</span>
                  <span className="font-serif text-2xl md:text-3xl text-[#161616] font-medium tabular-nums">
                    {current.price}
                  </span>
                  <span className="text-xs text-[#66625C]">· {current.carpet}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#66625C] leading-relaxed font-light">
                {current.desc}
              </p>

              {/* Highlights */}
              <div className="space-y-2 pt-1 border-t border-[#161616]/8">
                {current.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#161616]/85">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B59A68] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    trackEvent('cost_sheet_click', { configuration: current.label });
                    onOpenModal(current.intent, `configuration_${activeTab}`, current.label);
                  }}
                  className="w-full sm:w-auto h-12 px-7 rounded-xl bg-[#161616] hover:bg-[#202022] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                >
                  <span>{current.cta}</span>
                  <ArrowRight className="w-4 h-4 text-[#B59A68] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Residence Architecture Visual */}
            <div className="lg:col-span-5 relative aspect-[16/11] rounded-2xl overflow-hidden bg-[#FAF8F4] border border-[#161616]/10">
              <img
                src="/src/assets/images/residences_interior_balcony_1790328253674.jpg"
                alt="Prestige Thane Residence View"
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="text-[9px] uppercase tracking-wider bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                  Representative Concept
                </span>
                <span className="text-[#F3ECE0] font-serif">
                  {current.label} Living Promenade
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
