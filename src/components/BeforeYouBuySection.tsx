import React from 'react';
import { ArrowRight, ShieldCheck, Scale, PhoneCall } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface BeforeYouBuySectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const BeforeYouBuySection: React.FC<BeforeYouBuySectionProps> = ({ onOpenModal }) => {
  const capabilities = [
    { title: 'Pricing Verification', desc: 'Evaluating base rates vs. neighboring Grade-A benchmarks.' },
    { title: 'Configuration Analysis', desc: 'Analyzing carpet efficiency, balcony proportions, and privacy.' },
    { title: 'Statutory Charges', desc: 'Calculating exact stamp duty, GST, and infrastructure levies.' },
    { title: 'Location Evaluation', desc: 'Assessing real commute impact and upcoming road widenings.' },
    { title: 'Launch Updates', desc: 'Priority notifications for pre-booking windows and price releases.' },
    { title: 'Site Visit Guidance', desc: 'Direct on-ground access guidance and orientation with a senior advisor.' },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#161616] text-white relative overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#B59A68]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#B59A68] font-bold">
            ESTATEWISE BUYER DESK
          </span>
          <div className="h-px flex-1 bg-white/10 max-w-xs" />
        </div>

        <div className="max-w-2xl mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
            The developer sells the project. <br />
            <span className="text-[#B59A68] italic font-light">We help you understand the deal.</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/70 font-light">
            EstateWise provides confidential advisory to evaluate pricing, additional statutory charges, floor orientations, and launch schedules without broker bias.
          </p>
        </div>

        {/* 6 Clean Assistance Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {capabilities.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/8 hover:border-[#B59A68]/30 transition-colors">
              <span className="text-xs font-semibold text-white block mb-1">
                {c.title}
              </span>
              <p className="text-[11px] text-white/60 leading-snug font-light">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-[#B59A68]/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F3ECE0]">
              <ShieldCheck className="w-4 h-4 text-[#B59A68]" />
              <span>Independent Buyer Guidance · Zero Brokerage Fees</span>
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">
              Speak directly with an EstateWise senior Thane advisor.
            </div>
          </div>

          <button
            onClick={() => {
              trackEvent('site_visit_click', { section: 'before_you_buy_advisor' });
              onOpenModal('advisor_call', 'before_you_buy_advisor');
            }}
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-[#B59A68] to-[#967E51] hover:brightness-105 text-[#161616] font-bold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-98"
          >
            <span>SPEAK TO A BUYER ADVISOR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
