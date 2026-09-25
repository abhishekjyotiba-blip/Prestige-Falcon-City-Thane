import React from 'react';
import { ArrowRight, Phone, ShieldCheck, Check } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface FinalConversionSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const FinalConversionSection: React.FC<FinalConversionSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="py-24 md:py-36 bg-[#121214] text-white relative overflow-hidden">
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-8 text-center relative z-10">
        {/* Subtle Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
            ESTATEWISE PRIVATE DESK
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal leading-[0.98] tracking-tight mb-6">
          Be early. <br />
          <span className="text-[#C5A880] italic font-light">But be informed.</span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-base md:text-lg text-white/75 max-w-xl mx-auto font-light leading-relaxed mb-8">
          Get the latest verified Prestige Thane updates, indicative cost sheet, and sanctioned floor plan alerts directly from the EstateWise team.
        </p>

        {/* Subtle Buyer Pack Content Pills */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/60 mb-10 max-w-2xl mx-auto">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Indicative Cost Sheet
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Configuration Comparison
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Location Report
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Priority RERA Updates
          </span>
        </div>

        {/* Action Pair */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => {
              trackEvent('hero_cta_click', { cta: 'final_conversion_launch_kit' });
              onOpenModal('launch_kit', 'final_conversion');
            }}
            className="w-full sm:w-auto flex-1 h-14 px-8 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#18181A] font-semibold text-xs md:text-sm tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <span>GET PRIVATE LAUNCH KIT</span>
            <ArrowRight className="w-4 h-4 text-[#A07F55] transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              trackEvent('call_click', { cta: 'final_conversion_advisor' });
              onOpenModal('callback', 'final_conversion_callback');
            }}
            className="w-full sm:w-auto h-14 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs tracking-wider uppercase border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-[#C5A880]" />
            <span>Speak to an Advisor</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/40">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]/80" />
          <span>No spam. Project-related communication only.</span>
        </div>
      </div>
    </section>
  );
};
