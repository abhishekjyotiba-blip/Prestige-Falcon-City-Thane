import React from 'react';
import { ArrowRight, Lock, CheckCircle2, ShieldCheck, FileText, Download } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface VisualBuyerPackMockupSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const VisualBuyerPackMockupSection: React.FC<VisualBuyerPackMockupSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="py-12 md:py-16 bg-[#EFE9DE] text-[#161616] relative border-y border-[#161616]/10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#967E51] font-bold">
                VISUAL PROOF OF VALUE
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#161616] font-normal leading-tight">
              Curated Buyer Intelligence Dossier
            </h2>
            <p className="text-xs sm:text-sm text-[#66625C] font-light max-w-lg mt-1">
              Tangible research documents prepared for serious homebuyers evaluating the Prestige Thane opportunity.
            </p>
          </div>

          <div className="self-start md:self-auto flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-[#B59A68]/15 text-[#967E51] px-2.5 py-1 rounded-md border border-[#B59A68]/30">
              COMPLIMENTARY BUYER PACK
            </span>
          </div>
        </div>

        {/* High-Resolution Document Mockup Visual Container */}
        <div
          onClick={() => {
            trackEvent('buyer_pack_click', { section: 'visual_mockup_dossier' });
            onOpenModal('buyer_pack', 'visual_mockup_dossier');
          }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-white border border-[#161616]/15 shadow-xl cursor-pointer group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            {/* Left Mockup Image */}
            <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-[#FAF8F4]">
              <img
                src="/src/assets/images/buyer_pack_mockups_1790332353943.jpg"
                alt="Prestige Thane Buyer Brief, Cost Analysis, and Location Intelligence"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/40 lg:to-white" />
              
              <div className="absolute top-3 left-3">
                <span className="text-[9px] uppercase tracking-wider text-[#161616] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs font-semibold border border-[#161616]/10">
                  EstateWise Research Desk
                </span>
              </div>
            </div>

            {/* Right Quick Breakdown & Unlock Trigger */}
            <div className="lg:col-span-5 p-6 md:p-8 space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#B59A68] font-bold">
                  PRESTIGE THANE BUYER BRIEF
                </div>
                <h3 className="font-serif text-2xl text-[#161616] font-normal leading-snug">
                  See what&apos;s inside the complete dossier.
                </h3>
              </div>

              {/* 3 Pillars */}
              <div className="space-y-2.5 text-xs text-[#66625C]">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F5F1E9] border border-[#161616]/5">
                  <FileText className="w-4 h-4 text-[#B59A68] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#161616] block">01 · Cost & Cashflow Sheet</strong>
                    <span>Base value, floor rise, 6% stamp duty, 5% GST and net all-in outlay.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F5F1E9] border border-[#161616]/5">
                  <FileText className="w-4 h-4 text-[#B59A68] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#161616] block">02 · Location Intelligence</strong>
                    <span>Metro Line 4 & 5 timelines, Balkum connectivity, and school matrices.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F5F1E9] border border-[#161616]/5">
                  <FileText className="w-4 h-4 text-[#B59A68] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#161616] block">03 · Configuration Guide</strong>
                    <span>Detailed comparison of 2, 3 & 4 BHK layouts and carpet orientations.</span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  type="button"
                  className="w-full h-12 rounded-xl bg-[#161616] group-hover:bg-[#202022] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#B59A68]" />
                  <span>UNLOCK THE FULL PACK →</span>
                </button>
                <span className="text-[10px] text-[#66625C] block text-center mt-2">
                  Delivered securely via WhatsApp & PDF. Takes less than 20 seconds.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
