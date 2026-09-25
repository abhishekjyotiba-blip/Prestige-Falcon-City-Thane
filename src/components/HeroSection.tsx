import React from 'react';
import { ArrowDown, ArrowRight, Shield } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface HeroSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
  personalizedTerm?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal, personalizedTerm }) => {
  return (
    <section id="overview" className="relative min-h-[100svh] flex flex-col justify-between pt-24 pb-8 md:pt-32 md:pb-12 overflow-hidden bg-[#121214] text-white">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_prestige_thane_1790328223186.jpg"
          alt="Prestige Thane architectural vision"
          fetchPriority="high"
          className="w-full h-full object-cover object-center opacity-75 scale-105 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
        />
        {/* Subtle Scrim gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/65 to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#121214]/30 to-[#121214]/80" />
      </div>

      {/* Representative Visual Label */}
      <div className="absolute top-20 md:top-24 right-4 md:right-8 z-10">
        <span className="text-[10px] tracking-wider uppercase text-white/50 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
          Representative visual
        </span>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 w-full my-auto flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-4 md:mb-6">
          <span className="h-px w-6 md:w-10 bg-[#C5A880]/60" />
          <span className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-[#E8DFC9] font-medium">
            AN UPCOMING PRESTIGE ADDRESS · THANE
          </span>
          <span className="h-px w-6 md:w-10 bg-[#C5A880]/60" />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white mb-5 md:mb-6 font-normal">
          PRESTIGE <br className="sm:hidden" />
          <span className="text-[#C5A880] font-light italic mx-1.5 md:mx-3">×</span>
          THANE
        </h1>

        {/* Subheadline */}
        <p className="max-w-xl text-base md:text-xl text-white/80 font-light leading-relaxed mb-6 md:mb-8 text-balance">
          A landmark residential development envisioned near{' '}
          <span className="text-white font-normal underline decoration-[#C5A880]/60 underline-offset-4">
            Kolshet–Balkum Road
          </span>
          .
        </p>

        {/* Primary Signals (Clean unboxed typographic figures, no pill boxes) */}
        <div className="w-full max-w-2xl grid grid-cols-3 gap-2 md:gap-6 py-4 md:py-5 mb-6 md:mb-8 border-y border-white/15">
          <div className="flex flex-col items-center">
            <span className="font-serif text-xl sm:text-2xl md:text-3xl text-[#C5A880] tabular-nums font-normal">
              ~14.6
            </span>
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/70 mt-0.5">
              Acres Parcel
            </span>
          </div>
          <div className="flex flex-col items-center border-x border-white/15">
            <span className="font-serif text-xl sm:text-2xl md:text-3xl text-[#C5A880] tabular-nums font-normal">
              5M+
            </span>
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/70 mt-0.5">
              Sq.Ft. Potential
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif text-xl sm:text-2xl md:text-3xl text-[#C5A880] tabular-nums font-normal">
              ₹6,000 Cr
            </span>
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/70 mt-0.5">
              Estimated GDV
            </span>
          </div>
        </div>

        {/* Indicative Pricing & Configurations Cards (Tempting clickable previews) */}
        <div className="w-full max-w-xl grid grid-cols-3 gap-2.5 mb-6 text-center">
          <div
            onClick={() => onOpenModal('cost_sheet', 'hero_2bed_badge')}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 cursor-pointer transition-all hover:scale-102 group"
          >
            <span className="text-[10px] uppercase tracking-wider text-white/70 block">2 Bed Luxury</span>
            <span className="font-serif text-lg md:text-xl text-[#C5A880] font-normal block">₹1.60 Cr*</span>
            <span className="text-[9px] text-white/50 group-hover:text-white transition-colors">Tap to Unlock Cost Sheet</span>
          </div>

          <div
            onClick={() => onOpenModal('cost_sheet', 'hero_3bed_badge')}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-[#C5A880]/40 cursor-pointer transition-all hover:scale-102 group relative"
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#C5A880] text-black text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              Popular
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/70 block">3 Bed Grand</span>
            <span className="font-serif text-lg md:text-xl text-[#C5A880] font-normal block">₹2.40 Cr*</span>
            <span className="text-[9px] text-white/50 group-hover:text-white transition-colors">Tap to Unlock Cost Sheet</span>
          </div>

          <div
            onClick={() => onOpenModal('cost_sheet', 'hero_4bed_badge')}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 cursor-pointer transition-all hover:scale-102 group"
          >
            <span className="text-[10px] uppercase tracking-wider text-white/70 block">4 Bed Signature</span>
            <span className="font-serif text-lg md:text-xl text-[#C5A880] font-normal block">₹3.60 Cr*</span>
            <span className="text-[9px] text-white/50 group-hover:text-white transition-colors">Tap to Unlock Cost Sheet</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="w-full max-w-md flex flex-col items-center">
          <button
            onClick={() => {
              trackEvent('hero_cta_click', { cta: 'hero_primary_launch_kit' });
              onOpenModal('launch_kit', 'hero_main');
            }}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-[#FAF8F5] via-[#E8DFC9] to-white hover:brightness-105 text-[#18181A] font-bold text-xs md:text-sm tracking-widest uppercase transition-all shadow-xl shadow-black/50 flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <span>UNLOCK PRIVATE LAUNCH KIT</span>
            <ArrowRight className="w-4 h-4 text-[#A07F55] transition-transform group-hover:translate-x-1" />
          </button>

          {/* Locked assets teaser badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] text-white/80">
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-ping" />
              Locked: 2026 Price Sheet
            </span>
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              Locked: Master Plan
            </span>
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              Locked: 2/3/4 BHK Layouts
            </span>
          </div>
        </div>
      </div>

      {/* Hero Bottom / Scroll Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full flex items-center justify-between text-xs text-white/40 pt-4">
        <div className="flex items-center gap-2 text-[11px]">
          <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Independent Advisory by EstateWise</span>
        </div>
        <a
          href="#scale"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
          onClick={() => trackEvent('form_start', { action: 'scroll_indicator_click' })}
        >
          <span>Scroll to discover</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
