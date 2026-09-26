import React from 'react';
import { ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface ScaleSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const ScaleSection: React.FC<ScaleSectionProps> = ({ onOpenModal }) => {
  return (
    <section id="scale" className="py-12 md:py-16 bg-[#EFE9DE] text-[#161616] relative border-b border-[#161616]/10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#967E51] font-bold">
            PROJECT MAGNITUDE
          </span>
          <div className="h-px flex-1 bg-[#161616]/10 max-w-xs" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-normal leading-[1.05]">
              The scale speaks quietly.
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#66625C] font-light max-w-md">
              A flagship mixed-use masterplan envisioned for Thane West by Prestige Estates Projects Ltd.
            </p>
          </div>

          <button
            onClick={() => {
              trackEvent('hero_cta_click', { section: 'scale_project_brief_btn' });
              onOpenModal('launch_kit', 'scale_project_brief');
            }}
            className="self-start md:self-auto h-11 px-5 rounded-xl bg-white hover:bg-[#FAF8F4] text-[#161616] font-bold text-xs uppercase tracking-wider transition-all border border-[#161616]/15 shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>GET PROJECT BRIEF</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B59A68]" />
          </button>
        </div>

        {/* 2x2 Dense Mobile Composition */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {/* Item 1 */}
          <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#161616]/8 shadow-xs">
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-light leading-none tabular-nums">
              ~14.6
            </div>
            <div className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider text-[#967E51] font-bold">
              ACRES
            </div>
            <p className="mt-1 text-[11px] text-[#66625C] leading-snug">
              Contiguous prime parcel near Kolshet–Balkum Road.
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#161616]/8 shadow-xs">
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-light leading-none tabular-nums">
              5M<span className="text-[#B59A68] font-thin">+</span>
            </div>
            <div className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider text-[#967E51] font-bold">
              SQ.FT.
            </div>
            <p className="mt-1 text-[11px] text-[#66625C] leading-snug">
              Estimated development potential across phases.
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#161616]/8 shadow-xs">
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-light leading-none tabular-nums">
              ₹6,000 <span className="text-xl sm:text-2xl text-[#B59A68]">CR</span>
            </div>
            <div className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider text-[#967E51] font-bold">
              EST. GDV
            </div>
            <p className="mt-1 text-[11px] text-[#66625C] leading-snug">
              Gross Development Value of the proposed enclave.
            </p>
          </div>

          {/* Item 4 */}
          <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#161616]/8 shadow-xs">
            <div className="font-serif text-2xl sm:text-3xl text-[#161616] font-light leading-none">
              PRESTIGE
            </div>
            <div className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider text-[#967E51] font-bold">
              GROUP
            </div>
            <p className="mt-1 text-[11px] text-[#66625C] leading-snug">
              CRISIL DA1 highest developer rating in India.
            </p>
          </div>
        </div>

        {/* Compact Editorial Visual Strip */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[24/8] bg-black shadow-md">
          <img
            src="/src/assets/images/architecture_scale_exterior_1790328236147.jpg"
            alt="Prestige Thane Scale and Vision"
            loading="lazy"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
            <span className="font-serif text-sm sm:text-base text-[#F3ECE0]">
              Residential-Led Enclave with Integrated High-Street Retail
            </span>
            <span className="text-[9px] uppercase tracking-wider bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10 hidden sm:inline-block">
              Representative Visual
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
