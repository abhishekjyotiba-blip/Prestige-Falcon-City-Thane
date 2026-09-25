import React from 'react';
import { Lock, FileSpreadsheet, ArrowRight, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface CostSheetSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const CostSheetSection: React.FC<CostSheetSectionProps> = ({ onOpenModal }) => {
  return (
    <section id="cost-sheet" className="py-16 md:py-24 bg-[#18181A] text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C5A880]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
        {/* Eyebrow */}
        <div className="text-center mb-3">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold">
            FINANCIAL INTELLIGENCE
          </span>
        </div>

        {/* Headlines */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-[1.08] tracking-tight">
            The advertised price is rarely the final price.
          </h2>
          <p className="mt-2 text-sm md:text-base text-[#E8DFC9] font-light">
            Don&apos;t get surprised by taxes and levies later. View the full calculation below.
          </p>
        </div>

        {/* Interactive Blurred Realistic Document Frame */}
        <div
          onClick={() => {
            trackEvent('cost_sheet_click', { section: 'cost_sheet_visual_gate' });
            onOpenModal('cost_sheet', 'cost_sheet_visual_gate');
          }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#0D0D0E] max-w-4xl mx-auto cursor-pointer group"
        >
          {/* Realistic High-Res Document Background with Subtle Translucent Blur */}
          <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden">
            <img
              src="/src/assets/images/cost_sheet_table_1790331159086.jpg"
              alt="Prestige Thane Indicative Cost Sheet Document"
              loading="lazy"
              className="w-full h-full object-cover object-top filter blur-[4px] group-hover:blur-[2.5px] scale-102 group-hover:scale-105 transition-all duration-500 opacity-60"
            />

            {/* Subtle Gradient Veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181A] via-black/40 to-transparent" />

            {/* Document Header Overlay (Looks authentic) */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <FileSpreadsheet className="w-4 h-4 text-[#C5A880]" />
                <span className="font-semibold text-white">ESTATEWISE APPRAISAL SHEET</span>
                <span className="text-white/40">|</span>
                <span className="text-[#C5A880]">PRESTIGE THANE</span>
              </div>
              <span className="bg-red-950/80 text-red-200 border border-red-800/40 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                CONFIDENTIAL DRAFT
              </span>
            </div>

            {/* Realistically Positioned Blurred Rows Display */}
            <div className="absolute top-20 left-4 right-4 md:left-12 md:right-12 space-y-2 pointer-events-none">
              <div className="flex justify-between items-center bg-black/60 backdrop-blur-xs p-2.5 rounded-lg border border-white/10 text-xs">
                <span className="text-white/80">01. Indicative Base Agreement Value (2 BHK)</span>
                <span className="text-white font-serif font-bold text-sm">₹ 1,60,00,000*</span>
              </div>
              <div className="flex justify-between items-center bg-black/60 backdrop-blur-xs p-2.5 rounded-lg border border-white/10 text-xs">
                <span className="text-white/80">02. Floor Rise & Premium Facing Charges</span>
                <span className="text-white/60 filter blur-[5px] select-none font-mono">₹ 8,40,000</span>
              </div>
              <div className="flex justify-between items-center bg-black/60 backdrop-blur-xs p-2.5 rounded-lg border border-white/10 text-xs">
                <span className="text-white/80">03. Maharashtra Govt. Stamp Duty (~6%)</span>
                <span className="text-white/60 filter blur-[5px] select-none font-mono">₹ 9,60,000</span>
              </div>
              <div className="flex justify-between items-center bg-black/60 backdrop-blur-xs p-2.5 rounded-lg border border-white/10 text-xs">
                <span className="text-white/80">04. Under-Construction GST (5%)</span>
                <span className="text-white/60 filter blur-[5px] select-none font-mono">₹ 8,00,000</span>
              </div>
              <div className="flex justify-between items-center bg-black/60 backdrop-blur-xs p-2.5 rounded-lg border border-white/10 text-xs">
                <span className="text-[#C5A880] font-semibold">ESTIMATED ALL-IN OUTLAY</span>
                <span className="text-[#C5A880] filter blur-[6px] select-none font-mono font-bold text-base">₹ 1,92,50,000</span>
              </div>
            </div>

            {/* Prominent Frosted Unlock Callout Box */}
            <div className="absolute inset-0 flex flex-col items-center justify-end md:justify-center p-6 bg-black/40 backdrop-blur-[2px] text-center">
              <div className="bg-[#18181A]/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-[#C5A880]/30 shadow-2xl max-w-md w-full group-hover:scale-102 transition-transform">
                <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center mx-auto mb-3 border border-[#C5A880]/40">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-normal mb-1">
                  UNLOCK COMPLETE COST SHEET
                </h3>
                <p className="text-xs text-white/70 mb-5 leading-relaxed">
                  Tap to unveil the clean unblurred worksheet for 2, 3 & 4 BHK residences.
                </p>

                <button
                  type="button"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E8DFC9] hover:brightness-105 text-[#18181A] font-bold text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>VIEW FULL UNBLURRED PDF →</span>
                </button>

                <span className="text-[10px] text-white/50 block mt-2.5">
                  Instant WhatsApp & PDF download. No spam guaranteed.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Quick Visual Value Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6 text-xs text-white/75">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>Unit-wise payment schedules</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>Stamp duty & GST breakdown</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>Zero hidden brokerage charges</span>
          </div>
        </div>
      </div>
    </section>
  );
};
