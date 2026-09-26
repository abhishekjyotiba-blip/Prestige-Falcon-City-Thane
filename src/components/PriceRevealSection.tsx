import React from 'react';
import { Lock, Eye, Download, ArrowRight, CheckCircle2, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface PriceRevealSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const PriceRevealSection: React.FC<PriceRevealSectionProps> = ({ onOpenModal }) => {
  return (
    <section id="cost-sheet" className="py-12 md:py-18 bg-[#F5F1E9] text-[#161616] relative">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#967E51] font-bold">
            FINANCIAL TRANSPARENCY
          </span>
          <div className="h-px flex-1 bg-[#161616]/10 max-w-xs" />
        </div>

        <div className="max-w-xl mb-7">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-normal leading-tight">
            What does a home here actually cost?
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#66625C] font-light">
            Base price is only part of the picture. Understand statutory levies, floor rise, and total consideration before taking a decision.
          </p>
        </div>

        {/* 3 Starting Price Tiles */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-7 text-center">
          <div
            onClick={() => {
              trackEvent('cost_sheet_click', { tier: '2bed_reveal' });
              onOpenModal('cost_sheet', 'price_reveal_2bed');
            }}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#161616]/10 shadow-xs cursor-pointer hover:border-[#B59A68] transition-all"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#66625C] block">2 BED</span>
            <span className="font-serif text-xl sm:text-3xl text-[#161616] font-normal block my-0.5">₹1.60 Cr+*</span>
            <span className="text-[9px] sm:text-[10px] text-[#B59A68] font-semibold block">Unlock Cost Sheet →</span>
          </div>

          <div
            onClick={() => {
              trackEvent('cost_sheet_click', { tier: '3bed_reveal' });
              onOpenModal('cost_sheet', 'price_reveal_3bed');
            }}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border-2 border-[#B59A68] shadow-xs cursor-pointer hover:shadow-md transition-all relative"
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#B59A68] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full">
              Flagship
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#66625C] block">3 BED</span>
            <span className="font-serif text-xl sm:text-3xl text-[#161616] font-normal block my-0.5">₹2.40 Cr+*</span>
            <span className="text-[9px] sm:text-[10px] text-[#B59A68] font-semibold block">Unlock Cost Sheet →</span>
          </div>

          <div
            onClick={() => {
              trackEvent('cost_sheet_click', { tier: '4bed_reveal' });
              onOpenModal('cost_sheet', 'price_reveal_4bed');
            }}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#161616]/10 shadow-xs cursor-pointer hover:border-[#B59A68] transition-all"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#66625C] block">4 BED</span>
            <span className="font-serif text-xl sm:text-3xl text-[#161616] font-normal block my-0.5">₹3.60 Cr+*</span>
            <span className="text-[9px] sm:text-[10px] text-[#B59A68] font-semibold block">Unlock Cost Sheet →</span>
          </div>
        </div>

        {/* Partially Obscured Cost Sheet Sample Card */}
        <div
          onClick={() => {
            trackEvent('cost_sheet_click', { section: 'partially_obscured_worksheet' });
            onOpenModal('cost_sheet', 'price_reveal_worksheet');
          }}
          className="relative rounded-2xl md:rounded-3xl bg-[#161616] text-white p-5 md:p-8 shadow-xl border border-white/10 cursor-pointer group overflow-hidden"
        >
          {/* Subtle glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#B59A68]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#B59A68]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Indicative Cost Sheet & Taxes Worksheet
                </span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-red-950/80 text-red-200 border border-red-800/40 px-2 py-0.5 rounded">
                Gated Document
              </span>
            </div>

            {/* Obscured Cost Rows (Clean UI placeholders, no fake numbers) */}
            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white/80">Base Agreement Value</span>
                <span className="font-serif text-sm font-semibold text-white">₹ XX,XX,XXX (Indicative from ₹1.60 Cr*)</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white/80">Floor Premium Multiplier</span>
                <span className="font-mono text-white/40 tracking-widest select-none">••••••••</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white/80">Dedicated Covered Parking</span>
                <span className="font-mono text-white/40 tracking-widest select-none">••••••••</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white/80">Statutory Stamp Duty & GST</span>
                <span className="font-mono text-white/40 tracking-widest select-none">••••••••</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#B59A68]/15 border border-[#B59A68]/30">
                <span className="text-[#F3ECE0] font-semibold">Estimated Total Consideration</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-red-900/60 text-red-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" /> LOCKED
                </span>
              </div>
            </div>

            {/* Prominent Unlock Action Bar */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-white/70 self-start sm:self-center">
                <ShieldCheck className="w-4 h-4 text-[#B59A68] shrink-0" />
                <span>Receive itemized breakdown instantly on WhatsApp & Email</span>
              </div>

              <button
                type="button"
                className="w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-[#B59A68] to-[#967E51] hover:brightness-105 text-[#161616] font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>UNLOCK COST SHEET</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Micro note */}
        <div className="mt-2 text-center text-[10px] text-[#66625C] italic">
          *Indicative market information. Official developer pricing awaited. Statutory charges calculated per Maharashtra government norms.
        </div>
      </div>
    </section>
  );
};
