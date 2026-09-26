import React from 'react';
import { ArrowRight, Check, Phone, MessageSquare, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface HeroSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string, config?: string) => void;
  personalizedTerm?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal, personalizedTerm }) => {
  return (
    <section id="overview" className="relative pt-20 pb-8 md:pt-28 md:pb-14 overflow-hidden bg-[#F5F1E9] text-[#161616]">
      {/* Background Architectural Canvas with subtle gradient fade */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/hero_prestige_thane_1790328223186.jpg"
          alt="Prestige Thane architectural perspective"
          fetchPriority="high"
          className="w-full h-full object-cover object-center filter contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1E9]/80 via-[#F5F1E9]/95 to-[#F5F1E9]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 w-full">
        {/* Top Eyebrow Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B59A68] animate-pulse" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#967E51] font-bold">
              AN UPCOMING PRESTIGE ADDRESS · KOLSHET–BALKUM · THANE
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-[#66625C] bg-[#161616]/5 px-2 py-0.5 rounded hidden sm:inline-block">
            Prestige Group · ~14.6 Acres
          </span>
        </div>

        {/* Main Brand Title & Value Statement */}
        <div className="mb-4">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[0.98] text-[#161616] font-normal">
            PRESTIGE <span className="text-[#B59A68] font-light italic">×</span> THANE
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-[#66625C] font-light max-w-xl leading-snug">
            A landmark residential-led development envisioned across ~14.6 acres near Kolshet–Balkum Road.
          </p>
        </div>

        {/* Pricing Hook: Indicative From ₹1.60 CR* */}
        <div className="mb-5 p-3.5 md:p-4 rounded-2xl bg-white border border-[#161616]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest text-[#B59A68] font-bold">
              INDICATIVE 2, 3 & 4 BED RESIDENCES*
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs text-[#66625C] font-light">Indicative starting from</span>
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#161616] font-medium tabular-nums">
                ₹1.60 CR*
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#66625C] italic self-start sm:self-center">
            <span>*Market benchmark. Developer rate card awaited.</span>
          </div>
        </div>

        {/* HIGH-CONVERTING HERO VALUE BOX: Unlock Launch Kit Directly */}
        <div className="rounded-2xl md:rounded-3xl bg-[#161616] text-white p-5 md:p-7 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Subtle gold decorative accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#B59A68]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Left Value Points */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#B59A68]/20 border border-[#B59A68]/40 text-[#F3ECE0] text-[10px] uppercase font-bold tracking-wider">
                  Complimentary Access
                </span>
                <span className="text-xs text-white/50">·</span>
                <span className="text-xs text-white/70">EstateWise Buyer Desk</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
                Get the Prestige Thane Private Launch Kit
              </h2>

              {/* 4 Value Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-white/85">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#B59A68]/20 text-[#B59A68] flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>Indicative Cost Sheet</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#B59A68]/20 text-[#B59A68] flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>Configuration Comparison</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#B59A68]/20 text-[#B59A68] flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>Location & Metro Report</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#B59A68]/20 text-[#B59A68] flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>Launch / RERA Updates</span>
                </div>
              </div>
            </div>

            {/* Right Action Callout */}
            <div className="lg:col-span-5 flex flex-col space-y-2">
              <button
                onClick={() => {
                  trackEvent('hero_cta_click', { cta: 'hero_value_box_launch_kit' });
                  onOpenModal('launch_kit', 'hero_value_box');
                }}
                className="w-full h-13 px-6 rounded-xl bg-gradient-to-r from-[#B59A68] to-[#967E51] hover:brightness-105 text-[#161616] font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
              >
                <span>GET MY FREE LAUNCH KIT</span>
                <ArrowRight className="w-4 h-4 text-[#161616] transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-white/55 px-1">
                <span>⚡ Takes less than 20 seconds</span>
                <span>🔒 No spam guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Clickable Sub-Actions: Call & WhatsApp subtle row */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#66625C] px-1">
          <div className="flex items-center gap-3">
            <a
              href="tel:+919820000000"
              onClick={() => trackEvent('call_click', { source: 'hero_micro_row' })}
              className="hover:text-[#161616] flex items-center gap-1 font-medium transition-colors"
            >
              <Phone className="w-3 h-3 text-[#B59A68]" />
              <span>Direct Advisor Call</span>
            </a>
            <span>·</span>
            <a
              href={`https://wa.me/919820000000?text=${encodeURIComponent(
                'Hello EstateWise, please share the Prestige Thane launch kit and indicative cost sheet.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { source: 'hero_micro_row' })}
              className="hover:text-emerald-700 flex items-center gap-1 font-medium text-emerald-800 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp Connect</span>
            </a>
          </div>

          {personalizedTerm && (
            <span className="text-[10px] text-[#B59A68] hidden md:inline-block font-medium">
              Filtered for &ldquo;{personalizedTerm}&rdquo;
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
