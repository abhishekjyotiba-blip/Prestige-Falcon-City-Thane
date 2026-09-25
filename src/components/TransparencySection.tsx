import React from 'react';
import { Check, HelpCircle, Clock, AlertCircle } from 'lucide-react';

export const TransparencySection: React.FC = () => {
  const confirmed = [
    'Developer: Prestige Estates Projects Ltd / Prestige Group',
    'Land parcel: ~14.6 contiguous acres',
    'Development scale: 5M+ sq.ft. potential',
    'Estimated Gross Development Value: ₹6,000 Crore',
    'Strategic location: Near Kolshet–Balkum Road, Thane West',
    'Integrated typology: Residential-led with curated high-street retail component',
  ];

  const indicative = [
    'Configurations: 2, 3 & 4 BHK apartments',
    'Market guidance starting from ₹1.60 Cr* for 2 Bed',
    'Mid-tier 3 Bed guidance from ₹2.40 Cr*',
    'Large 4 Bed residences guidance from ₹3.60 Cr*',
  ];

  const awaited = [
    'Official registered project name (Prestige Thane / Prestige Falcon City Thane)',
    'MahaRERA Registration Number & sanctions',
    'Official developer rate card & payment schedule',
    'Sanctioned RERA carpet area measurements',
    'Architectural floor plans & unit clustering',
    'Tower count, heights, and inventory launch phases',
    'Formal public launch date announcement',
    'Possession & construction milestone calendar',
    'Exhaustive clubhouse & amenity specifications',
  ];

  return (
    <section className="py-20 md:py-32 bg-[#F4EFEB] text-[#18181A] relative">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            10 · Radical Transparency
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Section Headline */}
        <div className="max-w-3xl mb-14 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#18181A] font-normal leading-[1.05] tracking-tight">
            What we know. <br />
            What we don&apos;t. <br />
            Clearly separated.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#555559] font-light leading-relaxed">
            In an industry rampant with speculative claims, EstateWise presents the facts as verified by regulatory filings, corporate announcements, and observable market data.
          </p>
        </div>

        {/* 3 Aesthetic Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Pillar 1: CONFIRMED */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 md:p-8 border border-[#18181A]/8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs uppercase tracking-widest text-emerald-800 font-semibold">
                  CONFIRMED
                </span>
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-[#18181A] mb-4">
                Publicly Verified Facts
              </h3>
              <ul className="space-y-3">
                {confirmed.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#18181A]/85 leading-relaxed">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-[#18181A]/8 text-[11px] text-[#555559] italic">
              Sources: Prestige Group corporate disclosures & stock exchange filings.
            </div>
          </div>

          {/* Pillar 2: INDICATIVE */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 md:p-8 border border-[#18181A]/8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#A07F55]" />
                <span className="text-xs uppercase tracking-widest text-[#A07F55] font-semibold">
                  INDICATIVE
                </span>
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-[#18181A] mb-4">
                Market Intelligence
              </h3>
              <ul className="space-y-3">
                {indicative.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#18181A]/85 leading-relaxed">
                    <HelpCircle className="w-4 h-4 text-[#A07F55] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-[#18181A]/8 text-[11px] text-[#555559] italic">
              Estimated based on comparable Grade-A launches in Kolshet–Balkum.
            </div>
          </div>

          {/* Pillar 3: AWAITED */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 md:p-8 border border-[#18181A]/8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
                  AWAITED
                </span>
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-[#18181A] mb-4">
                Pending Regulatory & Launch
              </h3>
              <ul className="space-y-2.5">
                {awaited.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#18181A]/75 leading-relaxed">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-[#18181A]/8 text-[11px] text-[#555559] italic">
              Will be shared automatically with registered buyers upon disclosure.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
