import React from 'react';
import { ArrowRight, Phone, ShieldCheck, Download, Check } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface FinalConversionSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const FinalConversionSection: React.FC<FinalConversionSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="py-14 md:py-22 bg-[#121212] text-white relative overflow-hidden">
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#B59A68_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
        {/* Subtle Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.28em] text-[#B59A68] font-bold">
            ESTATEWISE PRIVATE ACCESS
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.05] tracking-tight mb-4">
          You&apos;ve seen the overview. <br />
          <span className="text-[#B59A68] italic font-light">Now get the numbers that matter.</span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-lg mx-auto font-light leading-relaxed mb-6">
          Get the complete Prestige Thane Buyer Pack delivered to your mobile in under 20 seconds.
        </p>

        {/* Buyer Pack Visual Pill Checklist */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/80 mb-8 max-w-xl mx-auto">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#B59A68]" /> Indicative Cost Sheet
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#B59A68]" /> Configuration Comparison
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#B59A68]" /> Location Analysis
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#B59A68]" /> Floor Plan Updates
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#B59A68]" /> RERA / Launch Updates
          </span>
        </div>

        {/* Action Pair */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={() => {
              trackEvent('hero_cta_click', { cta: 'final_conversion_buyer_pack' });
              onOpenModal('buyer_pack', 'final_conversion');
            }}
            className="w-full sm:w-auto flex-1 h-13 px-8 rounded-xl bg-gradient-to-r from-[#B59A68] to-[#967E51] hover:brightness-105 text-[#161616] font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-[#161616]" />
            <span>GET MY FREE BUYER PACK</span>
            <ArrowRight className="w-4 h-4 text-[#161616] transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              trackEvent('call_click', { cta: 'final_conversion_advisor' });
              onOpenModal('advisor_call', 'final_conversion_advisor');
            }}
            className="w-full sm:w-auto h-13 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wider uppercase border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-[#B59A68]" />
            <span>Speak to an Advisor</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-white/45">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B59A68]" />
          <span>No spam. Project-related communication only. No obligation to purchase.</span>
        </div>
      </div>
    </section>
  );
};
