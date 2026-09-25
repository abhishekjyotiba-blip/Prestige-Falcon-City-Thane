import React from 'react';
import { ArrowRight, Gift, ShieldCheck, Download, Check } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface BuyerAdvantageSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const BuyerAdvantageSection: React.FC<BuyerAdvantageSectionProps> = ({ onOpenModal }) => {
  const dossierItems = [
    { num: '01', title: 'Indicative Cost Sheet', desc: 'Itemized base rate, estimated taxes & net outlays.' },
    { num: '02', title: 'Sanctioned Floor Plans', desc: 'Sanctioned carpet & private balcony layouts.' },
    { num: '03', title: 'Master Plan Blueprint', desc: '14.6-acre tower footprints & podium layout.' },
    { num: '04', title: 'Metro Infrastructure Report', desc: 'Metro 4 & 5 timelines & road bypass analysis.' },
  ];

  return (
    <section id="buyer-pack" className="py-16 md:py-24 bg-[#FAF8F5] text-[#18181A] relative border-t border-[#18181A]/10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            THE BUYER DOSSIER
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Visual Box Layout */}
        <div className="relative rounded-3xl bg-[#141416] text-white p-6 md:p-12 overflow-hidden shadow-2xl border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image of the Luxury VIP Dossier Box */}
            <div className="lg:col-span-6 relative">
              <div
                onClick={() => {
                  trackEvent('buyer_pack_click', { section: 'dossier_box_img' });
                  onOpenModal('buyer_pack', 'dossier_box_img');
                }}
                className="relative rounded-2xl overflow-hidden aspect-[16/11] border border-[#C5A880]/30 shadow-2xl cursor-pointer group"
              >
                <img
                  src="/src/assets/images/vip_pass_invite_1790331184113.jpg"
                  alt="EstateWise Prestige Thane VIP Priority Buyer Pack"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] uppercase font-bold text-[#E8DFC9] border border-white/15">
                    Curated Digital Kit
                  </span>
                  <span className="text-[#C5A880] font-serif">Instant WhatsApp Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Quick Bullet Points & One-Click Unlock */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold block mb-1">
                  ESTATEWISE BUYER PACK
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-white font-normal leading-tight">
                  Everything you need to know in one clean mobile dossier.
                </h3>
              </div>

              {/* 4 Clean Visual Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                {dossierItems.map((item) => (
                  <div key={item.num} className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-0.5">
                      <span className="text-[#C5A880]">{item.num}.</span>
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-white/60 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    trackEvent('buyer_pack_click', { section: 'buyer_pack_dossier' });
                    onOpenModal('buyer_pack', 'buyer_pack_dossier');
                  }}
                  className="w-full sm:w-auto h-13 px-8 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E8DFC9] hover:brightness-105 text-[#18181A] font-bold text-xs tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD COMPLETE BUYER PACK</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="flex items-center gap-1.5 text-[11px] text-white/50 mt-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Free. 100% confidential. No spam or endless agent calls.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
