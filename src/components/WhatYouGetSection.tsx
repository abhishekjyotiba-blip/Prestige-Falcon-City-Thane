import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface WhatYouGetSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const WhatYouGetSection: React.FC<WhatYouGetSectionProps> = ({ onOpenModal }) => {
  const items = [
    { num: '01', title: 'Latest Indicative Pricing', desc: 'Current 2, 3 & 4 BHK benchmark brackets.' },
    { num: '02', title: 'Estimated Cost Breakdown', desc: 'Base rate, 6% stamp duty, 5% GST & outlays.' },
    { num: '03', title: '2 / 3 / 4 Bed Comparison', desc: 'Carpet efficiency, balcony decks & suitability.' },
    { num: '04', title: 'Floor Plan Updates', desc: 'Direct alerts when sanctioned RERA plans drop.' },
    { num: '05', title: 'Location & Metro Analysis', desc: 'Metro 4 & 5 timelines, bypass corridors & anchors.' },
    { num: '06', title: 'Launch / RERA Updates', desc: 'MahaRERA sanction alerts & priority access windows.' },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#F5F1E9] text-[#161616]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Eyebrow */}
        <div className="text-center mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.26em] text-[#967E51] font-bold">
            EVERYTHING YOU NEED
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#161616] font-normal leading-tight">
            Before you speak to sales.
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#66625C] font-light">
            Don&apos;t walk into meetings unprepared. Get the complete independent buyer brief first.
          </p>
        </div>

        {/* Compact 2x3 Mobile Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-7">
          {items.map((item) => (
            <div
              key={item.num}
              className="p-3.5 md:p-4 rounded-xl bg-white border border-[#161616]/8 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-lg md:text-xl text-[#B59A68] font-light block mb-1">
                  {item.num}
                </span>
                <span className="text-xs md:text-sm font-semibold text-[#161616] block leading-snug">
                  {item.title}
                </span>
              </div>
              <p className="text-[11px] text-[#66625C] mt-1.5 leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Big Action Button */}
        <div className="text-center">
          <button
            onClick={() => {
              trackEvent('buyer_pack_click', { section: 'what_you_get_all_6' });
              onOpenModal('buyer_pack', 'what_you_get_all_6');
            }}
            className="w-full sm:w-auto h-13 px-8 rounded-xl bg-[#161616] hover:bg-[#202022] text-white font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-md inline-flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <span>GET ALL 6 IN THE BUYER PACK</span>
            <ArrowRight className="w-4 h-4 text-[#B59A68] transition-transform group-hover:translate-x-1" />
          </button>
          <div className="text-[11px] text-[#66625C] mt-2">
            100% Free · No obligation · Delivered to your mobile in seconds
          </div>
        </div>
      </div>
    </section>
  );
};
