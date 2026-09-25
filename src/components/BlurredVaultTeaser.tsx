import React from 'react';
import { Lock, Eye, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface BlurredVaultTeaserProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const BlurredVaultTeaser: React.FC<BlurredVaultTeaserProps> = ({ onOpenModal }) => {
  const secretAssets = [
    {
      title: '14.6-Acre Master Site Plan',
      category: 'TOWERS & CLUBHOUSE ORIENTATION',
      image: '/src/assets/images/master_plan_sheet_1790331119925.jpg',
      intent: 'launch_kit' as LeadIntent,
      cta: 'Unlock Master Plan',
      badge: 'Confidential Plan',
      peekText: 'Tower Footprints & Central Green Spine',
    },
    {
      title: 'Architectural Floor Plans (2, 3 & 4 Bed)',
      category: 'SANCTIONED CARPET & DECK DIMENSIONS',
      image: '/src/assets/images/floor_plan_detailed_1790331139257.jpg',
      intent: 'floor_plan' as LeadIntent,
      cta: 'Unlock All Floor Plans',
      badge: 'CAD Blueprints',
      peekText: 'Room Dimensions, Balcony Decks & Vastu Orientations',
    },
    {
      title: 'Complete Cost Sheet & Payment Schedule',
      category: 'ITEMIZED BASE + TAXES + STAMP DUTY',
      image: '/src/assets/images/cost_sheet_table_1790331159086.jpg',
      intent: 'cost_sheet' as LeadIntent,
      cta: 'Unlock Cost Sheet',
      badge: 'Price Breakdown',
      peekText: 'Floor Rise, 6% Stamp Duty, GST & Net All-in Outlay',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#141416] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Eyebrow & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.26em] text-[#C5A880] font-semibold">
                RESTRICTED BUYER ACCESS
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
              Curious about what lies inside?
            </h2>
            <p className="mt-2 text-sm md:text-base text-white/70 max-w-xl font-light">
              Tap any document below to peek through the blur and receive instant unblurred access.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#C5A880] bg-[#C5A880]/10 px-3.5 py-2 rounded-xl border border-[#C5A880]/20 self-start md:self-auto">
            <Lock className="w-4 h-4 shrink-0" />
            <span>3 Documents Awaiting Unlock</span>
          </div>
        </div>

        {/* 3 Tempting Blurred Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {secretAssets.map((asset, index) => (
            <div
              key={index}
              onClick={() => {
                trackEvent('floor_plan_click', { card: asset.title });
                onOpenModal(asset.intent, `blurred_vault_${index}`);
              }}
              className="group relative rounded-2xl overflow-hidden bg-[#1E1E22] border border-white/10 hover:border-[#C5A880]/50 transition-all duration-300 shadow-2xl cursor-pointer hover:-translate-y-1"
            >
              {/* Document Image with Heavy Blur & Hover Reveal Effect */}
              <div className="relative aspect-[16/11] overflow-hidden bg-black">
                <img
                  src={asset.image}
                  alt={asset.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center filter blur-[5px] group-hover:blur-[3px] scale-105 group-hover:scale-110 transition-all duration-500 opacity-70 group-hover:opacity-85"
                />

                {/* Subtle Grid Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E22] via-transparent to-black/40" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-black/60 backdrop-blur-md text-[#E8DFC9] px-2.5 py-1 rounded-md border border-white/15">
                    {asset.badge}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider bg-red-950/80 text-red-200 px-2 py-0.5 rounded flex items-center gap-1 border border-red-800/40">
                    <Lock className="w-2.5 h-2.5" /> Gated
                  </span>
                </div>

                {/* Center "Tap to Reveal" Glass Shield */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="w-12 h-12 rounded-full bg-black/65 backdrop-blur-md text-[#C5A880] border border-[#C5A880]/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    Tap to Peek & Unlock
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                  {asset.category}
                </div>
                <h3 className="font-serif text-xl text-white font-normal group-hover:text-[#E8DFC9] transition-colors leading-snug">
                  {asset.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {asset.peekText}
                </p>

                <div className="pt-2">
                  <button className="w-full h-11 rounded-xl bg-white/10 group-hover:bg-[#C5A880] group-hover:text-[#18181A] text-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-white/15 group-hover:border-transparent">
                    <span>{asset.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Micro-Banner */}
        <div className="mt-8 py-3.5 px-4 rounded-xl bg-white/5 border border-white/8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>EstateWise delivers all 3 files in one confidential mobile PDF package.</span>
          </div>
          <button
            onClick={() => onOpenModal('launch_kit', 'vault_strip')}
            className="text-[#C5A880] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Unlock All 3 Simultaneously</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </section>
  );
};
