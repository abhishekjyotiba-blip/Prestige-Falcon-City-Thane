import React from 'react';
import { ArrowRight, Check, Clock, HelpCircle, Bell } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface ProjectStatusSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const ProjectStatusSection: React.FC<ProjectStatusSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="py-12 md:py-18 bg-[#F5F1E9] text-[#161616]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#967E51] font-bold">
            TRANSPARENCY
          </span>
          <div className="h-px flex-1 bg-[#161616]/10 max-w-xs" />
        </div>

        <div className="max-w-xl mb-7">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-normal leading-tight">
            What is confirmed right now?
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#66625C] font-light">
            We separate verified facts from indicative benchmarks and awaited statutory announcements.
          </p>
        </div>

        {/* 3 Status Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
          {/* CONFIRMED */}
          <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#161616]/8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                  CONFIRMED
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#161616]/85">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Developer: Prestige Group</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Location: Kolshet–Balkum corridor</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Land Parcel: ~14.6 contiguous acres</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Development Potential: 5M+ sq.ft.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Est. GDV: ₹6,000 Crore</span>
                </li>
              </ul>
            </div>
            <span className="text-[10px] text-[#66625C] italic mt-4 pt-2 border-t border-[#161616]/5 block">
              Verified corporate stock disclosures
            </span>
          </div>

          {/* INDICATIVE */}
          <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#161616]/8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#B59A68]" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#967E51]">
                  INDICATIVE
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#161616]/85">
                <li className="flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[#B59A68] shrink-0 mt-0.5" />
                  <span>Configurations: 2, 3 & 4 Bed</span>
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[#B59A68] shrink-0 mt-0.5" />
                  <span>2 Bed starting from ₹1.60 Cr*</span>
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[#B59A68] shrink-0 mt-0.5" />
                  <span>3 Bed starting from ₹2.40 Cr*</span>
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[#B59A68] shrink-0 mt-0.5" />
                  <span>4 Bed starting from ₹3.60 Cr*</span>
                </li>
              </ul>
            </div>
            <span className="text-[10px] text-[#66625C] italic mt-4 pt-2 border-t border-[#161616]/5 block">
              Based on neighboring Grade-A benchmarks
            </span>
          </div>

          {/* AWAITED */}
          <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#161616]/8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                  AWAITED
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#161616]/85">
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Official Project Name & Branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>MahaRERA Registration Number</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Developer Official Price Sheet</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Sanctioned Carpet Area Blueprints</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Phase-Wise Launch Schedule</span>
                </li>
              </ul>
            </div>
            <span className="text-[10px] text-[#66625C] italic mt-4 pt-2 border-t border-[#161616]/5 block">
              Dispatched automatically upon official release
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => {
              trackEvent('hero_cta_click', { section: 'project_status_cta' });
              onOpenModal('rera_update', 'project_status_release_alerts');
            }}
            className="w-full sm:w-auto h-13 px-8 rounded-xl bg-[#161616] hover:bg-[#202022] text-white font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-md inline-flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <Bell className="w-4 h-4 text-[#B59A68]" />
            <span>GET ALERTED WHEN NEW DETAILS DROP</span>
            <ArrowRight className="w-4 h-4 text-[#B59A68] transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
