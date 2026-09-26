import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Where is the upcoming Prestige project located in Thane?',
      a: 'The development is situated on a contiguous ~14.6-acre land parcel near the Kolshet–Balkum Road corridor in Thane West, strategically positioned with access to Ghodbunder Road, the Eastern Express Highway, and the planned Metro Line 5 Balkum transit station.',
    },
    {
      q: 'What apartment configurations and pricing are expected?',
      a: 'Indicative market presentation guidance begins from approximately ₹1.60 Cr* for 2 BHK, ₹2.40 Cr* for 3 BHK, and ₹3.60 Cr* for 4 BHK. Official developer pricing will be released upon launch.',
    },
    {
      q: 'Has MahaRERA registration been announced?',
      a: 'MahaRERA registration is currently awaited. In strict compliance with RERA regulations, bookings, formal sales, and commercial agreements will only open once the MahaRERA registration number has been officially granted.',
    },
    {
      q: 'When will official architectural floor plans be available?',
      a: 'Official RERA-sanctioned floor plans and carpet area schedules are under statutory review. Registered prospective buyers on EstateWise’s priority list will receive the verified floor plan PDF dossier immediately upon release.',
    },
    {
      q: 'Can EstateWise arrange an advisory consultation and site visit?',
      a: 'Yes. EstateWise provides independent, private advisory services. Our senior Thane specialists can arrange a one-on-one consultation, micro-market benchmarking, and guide you on the exact location access and surroundings.',
    },
  ];

  const toggle = (idx: number) => {
    const next = openIdx === idx ? null : idx;
    setOpenIdx(next);
    if (next !== null) {
      trackEvent('form_start', { faq_expanded: faqs[next].q });
    }
  };

  return (
    <section id="faq" className="py-12 md:py-16 bg-[#F5F1E9] text-[#161616]">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#967E51] font-bold">
            FREQUENT QUESTIONS
          </span>
          <div className="h-px flex-1 bg-[#161616]/10 max-w-xs" />
        </div>

        <div className="mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#66625C] font-light">
            Clear, transparent answers separating verified facts from market benchmarks.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#161616]/10 bg-white overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-4 sm:px-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-sm sm:text-base text-[#161616] font-medium leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-[#F5F1E9] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#161616] text-white' : 'text-[#161616]/70'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-[#66625C] leading-relaxed border-t border-[#161616]/6">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
