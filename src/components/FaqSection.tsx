import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Where is the upcoming Prestige project located in Thane?',
      a: 'The development is situated on a contiguous ~14.6-acre land parcel near the Kolshet–Balkum Road corridor in Thane West, strategically positioned with access to Ghodbunder Road, the Eastern Express Highway, and the planned Metro Line 5 Balkum transit station.',
    },
    {
      q: 'Is "Prestige Falcon City Thane" the official registered project name?',
      a: 'Prestige Falcon City is the market/search alias commonly referenced based on Prestige’s iconic flagship brand in Bengaluru. The final official registered nomenclature for the Thane development will be formally confirmed upon statutory MahaRERA filing.',
    },
    {
      q: 'What apartment configurations are planned?',
      a: 'The project is envisioned as a residential-led high-rise development featuring curated 2, 3, and 4 BHK premium residences, accompanied by an integrated high-street retail component at the podium level.',
    },
    {
      q: 'What is the indicative starting price?',
      a: 'Based on prevailing Kolshet–Balkum Grade-A market benchmarks, indicative presentation guidance begins from approximately ₹1.60 Cr* for 2 BHK, ₹2.40 Cr* for 3 BHK, and ₹3.60 Cr* for 4 BHK. Note that these are indicative market figures; official developer pricing will be released at launch.',
    },
    {
      q: 'Has MahaRERA registration been announced?',
      a: 'MahaRERA registration is currently awaited. In strict compliance with RERA regulations, bookings, formal sales, and commercial agreements will only open once the MahaRERA registration number has been officially granted.',
    },
    {
      q: 'When will official architectural floor plans be available?',
      a: 'Official RERA-sanctioned floor plans and carpet area schedules are currently under final approval. Registered prospective buyers on EstateWise’s priority list will receive the verified floor plan PDF dossier immediately upon release.',
    },
    {
      q: 'How can I receive the latest indicative cost sheet and breakdown?',
      a: 'You can request the EstateWise Private Launch Kit or Cost Sheet Breakdown through any CTA on this page. We will dispatch the itemized component schedule (base value, statutory taxes, estimated outlays) directly via WhatsApp or email.',
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
    <section className="py-20 md:py-32 bg-[#FAF8F5] text-[#18181A] relative border-t border-[#18181A]/10">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            12 · Buyer Inquiries
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Section Headline */}
        <div className="mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181A] font-normal tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#555559] font-light">
            Clear, transparent answers separating verified developer disclosures from indicative market facts.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#18181A]/10 bg-[#F4EFEB] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4.5 px-5 md:px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base md:text-lg text-[#18181A] font-medium leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-white/70 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#18181A] text-white' : 'text-[#18181A]/70'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 md:px-6 pb-5 pt-1 text-xs md:text-sm text-[#555559] leading-relaxed border-t border-[#18181A]/6">
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
