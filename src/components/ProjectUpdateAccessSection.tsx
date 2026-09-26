import React from 'react';
import { ArrowRight, Bell, ShieldCheck } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface ProjectUpdateAccessSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const ProjectUpdateAccessSection: React.FC<ProjectUpdateAccessSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="py-10 md:py-14 bg-[#EFE9DE] text-[#161616] border-y border-[#161616]/10">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="rounded-2xl md:rounded-3xl bg-white p-5 md:p-8 border border-[#161616]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#967E51] bg-[#B59A68]/15 px-2.5 py-0.5 rounded-full">
              <Bell className="w-3 h-3" />
              <span>Low-Pressure Option</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl text-[#161616] font-normal leading-snug">
              Don&apos;t want a sales call yet? <br />
              <span className="text-[#66625C] font-light">Get only important project updates.</span>
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#66625C] pt-1">
              <span>✓ Official Price Release</span>
              <span>·</span>
              <span>✓ Floor Plan Release</span>
              <span>·</span>
              <span>✓ RERA Announcement</span>
              <span>·</span>
              <span>✓ Launch Schedule</span>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center gap-2">
            <button
              onClick={() => {
                trackEvent('hero_cta_click', { section: 'project_updates_low_pressure' });
                onOpenModal('project_updates', 'low_pressure_section');
              }}
              className="w-full md:w-auto h-12 px-7 rounded-xl bg-[#161616] hover:bg-[#202022] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-98"
            >
              <span>KEEP ME UPDATED</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B59A68]" />
            </button>
            <span className="text-[10px] text-[#66625C]">Direct WhatsApp / SMS updates only</span>
          </div>
        </div>
      </div>
    </section>
  );
};
