import React from 'react';
import { PhoneCall, Calendar, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface SiteVisitSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const SiteVisitSection: React.FC<SiteVisitSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="py-20 md:py-32 bg-[#18181A] text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="/src/assets/images/architecture_scale_exterior_1790328236147.jpg"
          alt="Site visit ambiance"
          loading="lazy"
          className="w-full h-full object-cover object-center filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181A] via-[#18181A]/80 to-[#18181A]" />
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-8 relative z-10 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold">
            11 · One-on-One Engagement
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.05] tracking-tight mb-6 text-balance">
          Prefer to understand it <br />
          before everyone else does?
        </h2>

        {/* Subtext */}
        <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto font-light leading-relaxed mb-10">
          Speak with an EstateWise senior project advisor for the latest available project information, micro-market comparisons, and site-visit guidance.
        </p>

        {/* Action Pair */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => {
              trackEvent('site_visit_click', { cta: 'arrange_private_consultation' });
              onOpenModal('site_visit', 'site_visit_section');
            }}
            className="w-full sm:w-auto flex-1 h-13 px-6 rounded-xl bg-[#C5A880] hover:bg-[#d5b990] text-[#18181A] font-semibold text-xs md:text-sm tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>ARRANGE PRIVATE CONSULTATION</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              trackEvent('call_click', { cta: 'request_callback' });
              onOpenModal('callback', 'site_visit_callback');
            }}
            className="w-full sm:w-auto h-13 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs tracking-wider uppercase border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4 text-[#C5A880]" />
            <span>Request Callback</span>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/45">
          <ShieldCheck className="w-4 h-4 text-[#C5A880]/80 shrink-0" />
          <span>Strictly confidential advisory. Your information is never sold.</span>
        </div>
      </div>
    </section>
  );
};
