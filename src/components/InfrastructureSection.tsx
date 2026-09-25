import React from 'react';
import { ArrowRight, Layers, TrendingUp, Check } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface InfrastructureSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const InfrastructureSection: React.FC<InfrastructureSectionProps> = ({ onOpenModal }) => {
  const infraFacts = [
    {
      title: 'Metro Line 4 (Wadala–Kasarvadavali)',
      fact: '32.3 km elevated corridor under MMRDA execution connecting central Thane with Wadala and suburban interchange networks.',
      status: 'Advanced civil construction',
    },
    {
      title: 'Metro Line 5 (Thane–Bhiwandi–Kalyan)',
      fact: '24.9 km orbital transit route linking Thane to the eastern logistical and residential hubs, with planned Balkum interchange.',
      status: 'Phase 1 construction in progress',
    },
    {
      title: 'Thane–Borivali Twin Tunnel Project',
      fact: '11.8 km subterranean highway bypass cutting transit time between Thane and Western Suburbs to ~15-20 minutes without Ghodbunder bottlenecks.',
      status: 'Approved infrastructure undertaking',
    },
    {
      title: 'Eastern Express Highway & Coastal Linkages',
      fact: 'Multi-lane grade separators and planned elevated road extensions enhancing flow to BKC, South Mumbai, and the upcoming Navi Mumbai Airport.',
      status: 'Ongoing regional highway upgrades',
    },
  ];

  return (
    <section id="infrastructure" className="py-20 md:py-32 bg-[#FAF8F5] text-[#18181A] relative">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            06 · Infrastructure Horizon
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Section Headline */}
        <div className="max-w-3xl mb-14 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#18181A] font-normal leading-[1.08] tracking-tight">
            More than a home. <br />
            A bet on where the city is moving.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#555559] font-light leading-relaxed">
            Government infrastructure commitments are actively reshaping Thane from a suburban bedroom enclave into a self-sustaining transit metropolis.
          </p>
        </div>

        {/* Facts-Based Infrastructure Grid (No ungrounded financial promises) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {infraFacts.map((item, idx) => (
            <div
              key={idx}
              className="p-6 md:p-8 rounded-2xl bg-[#F4EFEB] border border-[#18181A]/8 flex flex-col justify-between hover:border-[#18181A]/20 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#A07F55] font-semibold">
                    MMRDA & State Initiative
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#18181A]/60 bg-white/70 px-2 py-0.5 rounded-sm border border-[#18181A]/5">
                    {item.status}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-[#18181A] mb-3">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-[#555559] leading-relaxed font-light">
                  {item.fact}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#18181A]/8 flex items-center gap-2 text-xs text-[#18181A]/70">
                <Check className="w-3.5 h-3.5 text-[#A07F55]" />
                <span>Verified Public Planning Information</span>
              </div>
            </div>
          ))}
        </div>

        {/* Infrastructure CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              trackEvent('location_report_click', { section: 'infrastructure_report' });
              onOpenModal('location_report', 'infrastructure_report');
            }}
            className="w-full sm:w-auto h-13 px-8 rounded-xl bg-[#18181A] hover:bg-[#28282B] text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-md inline-flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <span>GET THE THANE INFRASTRUCTURE REPORT</span>
            <ArrowRight className="w-4 h-4 text-[#C5A880] transition-transform group-hover:translate-x-1" />
          </button>
          <div className="mt-3 text-xs text-[#555559] italic">
            Prepared by EstateWise Research Desk · Transit maps & timeline milestones
          </div>
        </div>
      </div>
    </section>
  );
};
