import React from 'react';
import { Lock, Eye, Compass, Trees, Waves, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface MasterPlanSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const MasterPlanSection: React.FC<MasterPlanSectionProps> = ({ onOpenModal }) => {
  return (
    <section id="master-plan" className="py-16 md:py-24 bg-[#141416] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#C5A880] font-semibold">
            THE 14.6-ACRE ENCLAVE
          </span>
          <div className="h-px flex-1 bg-white/10 max-w-xs" />
        </div>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
              Master Plan & Zoning
            </h2>
            <p className="mt-2 text-sm md:text-base text-white/70 font-light">
              Tower clusters, central greens, Olympic lap pool, clubhouse, and retail promenade.
            </p>
          </div>

          <button
            onClick={() => {
              trackEvent('buyer_pack_click', { section: 'master_plan_header_btn' });
              onOpenModal('launch_kit', 'master_plan_header_btn');
            }}
            className="self-start md:self-auto h-11 px-5 rounded-xl bg-[#C5A880] hover:bg-[#d5b990] text-[#18181A] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
          >
            <span>Unlock Master Plan Layout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Gated Master Plan Artwork */}
        <div
          onClick={() => {
            trackEvent('hero_cta_click', { section: 'master_plan_visual_card' });
            onOpenModal('launch_kit', 'master_plan_visual_card');
          }}
          className="relative rounded-3xl overflow-hidden bg-[#0A0A0B] border border-white/15 shadow-2xl cursor-pointer group"
        >
          <div className="relative aspect-[16/10] md:aspect-[21/10] w-full overflow-hidden">
            <img
              src="/src/assets/images/master_plan_sheet_1790331119925.jpg"
              alt="Prestige Thane 14.6 Acre Master Site Plan"
              loading="lazy"
              className="w-full h-full object-cover object-center filter blur-[4px] group-hover:blur-[2.5px] scale-102 group-hover:scale-105 transition-all duration-500 opacity-70"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-black/40 to-transparent" />

            {/* Visual Indicators on the blurred plan */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 text-white">
                <Compass className="w-4 h-4 text-[#C5A880]" />
                <span className="font-semibold">MASTER SITE ELEVATION</span>
                <span className="text-white/40">|</span>
                <span className="text-[#C5A880]">~14.6 ACRE CONTIGUOUS</span>
              </div>
              <span className="bg-black/70 backdrop-blur-md text-[#E8DFC9] border border-white/10 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-semibold">
                CONFIDENTIAL ARCHITECTURAL DRAFT
              </span>
            </div>

            {/* Floating Visual Pin Callouts (Visible through the blur) */}
            <div className="absolute top-24 left-1/4 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-[#C5A880] border border-[#C5A880]/30 hidden sm:flex items-center gap-1.5 shadow-lg">
              <Building className="w-3 h-3" />
              <span>Tower Enclaves</span>
            </div>
            <div className="absolute bottom-28 right-1/3 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-emerald-400 border border-emerald-500/30 hidden sm:flex items-center gap-1.5 shadow-lg">
              <Trees className="w-3 h-3" />
              <span>Central Eco Green Corridor</span>
            </div>
            <div className="absolute top-36 right-1/4 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-blue-400 border border-blue-500/30 hidden sm:flex items-center gap-1.5 shadow-lg">
              <Waves className="w-3 h-3" />
              <span>Olympic Pool & Clubhouse</span>
            </div>

            {/* Frosted Gate Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] text-center">
              <div className="bg-[#141416]/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-[#C5A880]/40 shadow-2xl max-w-md w-full group-hover:scale-102 transition-transform">
                <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center mx-auto mb-3 border border-[#C5A880]/40">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-normal mb-1">
                  UNLOCK SITE MASTER PLAN
                </h3>
                <p className="text-xs text-white/70 mb-5 leading-relaxed">
                  Reveal exact tower placement, internal vehicular routes, clubhouse zone, and high-street retail boulevard.
                </p>

                <button
                  type="button"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E8DFC9] hover:brightness-105 text-[#18181A] font-bold text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>TAP TO UNVEIL HIGH-RES MAP →</span>
                </button>

                <span className="text-[10px] text-white/50 block mt-2.5">
                  Delivered automatically as high-resolution PDF
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Graphic Masterplan Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs text-[#C5A880] font-bold uppercase tracking-wider block mb-1">Zoning 01</span>
            <span className="text-sm font-semibold text-white block">Residences</span>
            <span className="text-xs text-white/60">High-rise luxury towers</span>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs text-[#C5A880] font-bold uppercase tracking-wider block mb-1">Zoning 02</span>
            <span className="text-sm font-semibold text-white block">Clubhouse Hub</span>
            <span className="text-xs text-white/60">Grand recreation pavilion</span>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs text-[#C5A880] font-bold uppercase tracking-wider block mb-1">Zoning 03</span>
            <span className="text-sm font-semibold text-white block">Green Podium</span>
            <span className="text-xs text-white/60">Lush landscaped lawns</span>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs text-[#C5A880] font-bold uppercase tracking-wider block mb-1">Zoning 04</span>
            <span className="text-sm font-semibold text-white block">Retail High-Street</span>
            <span className="text-xs text-white/60">Daily premium shopping</span>
          </div>
        </div>
      </div>
    </section>
  );
};
