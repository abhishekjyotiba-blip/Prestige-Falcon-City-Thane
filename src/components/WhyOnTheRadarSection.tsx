import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface WhyOnTheRadarSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const WhyOnTheRadarSection: React.FC<WhyOnTheRadarSectionProps> = ({ onOpenModal }) => {
  const reasons = [
    { title: 'PRESTIGE GROUP', desc: 'Established national conglomerate with 38+ years and CRISIL DA1 rating.' },
    { title: 'KOLSHET–BALKUM', desc: 'Established Thane residential corridor with wide avenues and infrastructure upgrades.' },
    { title: '~14.6 ACRES', desc: 'Contiguous land parcel offering rare masterplan scale in Northern Thane.' },
    { title: '5M+ SQ.FT.', desc: 'Significant development potential integrating towers, podium greens, and lifestyle amenities.' },
    { title: 'INTEGRATED RETAIL', desc: 'Residential-led mixed-use vision with gourmet retail high-street at doorstep.' },
    { title: 'UPCOMING INFRASTRUCTURE', desc: 'Metro Line 4 & 5 corridors, Thane-Borivali bypass link, and flyover grade separators.' },
  ];

  return (
    <section className="py-12 md:py-18 bg-[#F5F1E9] text-[#161616]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#967E51] font-bold">
            STRATEGIC SIGNALS
          </span>
          <div className="h-px flex-1 bg-[#161616]/10 max-w-xs" />
        </div>

        <div className="max-w-xl mb-7">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-normal leading-tight">
            Why this launch is on the radar.
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#66625C] font-light">
            Genuine project fundamentals that make Prestige Thane one of the most closely tracked MMR launches.
          </p>
        </div>

        {/* Compact Editorial Rows */}
        <div className="space-y-2.5 mb-7">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#161616]/8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:border-[#B59A68]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-serif text-sm font-semibold text-[#B59A68] w-6">
                  0{i + 1}
                </span>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#161616]">
                  {r.title}
                </span>
              </div>
              <span className="text-xs text-[#66625C] sm:text-right font-light">
                {r.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={() => {
              trackEvent('hero_cta_click', { section: 'why_on_the_radar_cta' });
              onOpenModal('launch_kit', 'why_on_the_radar_btn');
            }}
            className="w-full sm:w-auto h-13 px-8 rounded-xl bg-[#161616] hover:bg-[#202022] text-white font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-md inline-flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <span>GET COMPLETE PROJECT BRIEF</span>
            <ArrowRight className="w-4 h-4 text-[#B59A68] transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
