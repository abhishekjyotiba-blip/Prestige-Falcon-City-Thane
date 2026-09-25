import React from 'react';
import { Award, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PrestigeSection: React.FC = () => {
  return (
    <section id="developer" className="py-20 md:py-32 bg-[#FAF8F5] text-[#18181A] relative border-t border-[#18181A]/8">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#A07F55] font-semibold">
            THE DEVELOPER
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Headline */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#18181A] font-normal tracking-tight leading-none">
            PRESTIGE
          </h2>
          <p className="mt-4 font-serif text-2xl md:text-3xl text-[#555559] italic font-light">
            Three decades of development. A legacy of landmark urban transformations across India.
          </p>
          <p className="mt-4 text-sm md:text-base text-[#555559] max-w-2xl font-light leading-relaxed">
            Established in 1986, Prestige Estates Projects Ltd is one of India&apos;s premier publicly listed real estate conglomerates, renowned for iconic commercial centers, Grade-A luxury residences, and integrated townships.
          </p>
        </div>

        {/* Verified Developer Metrics (Clean unboxed typographic layout) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8 border-y border-[#18181A]/10 mb-12">
          <div>
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181A] font-light tabular-nums">
              38<span className="text-[#A07F55] font-thin">+</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#555559] mt-1 font-medium">
              Years of Excellence
            </div>
          </div>

          <div>
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181A] font-light tabular-nums">
              280<span className="text-[#A07F55] font-thin">+</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#555559] mt-1 font-medium">
              Projects Completed
            </div>
          </div>

          <div>
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181A] font-light tabular-nums">
              170M<span className="text-[#A07F55] font-thin">+</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#555559] mt-1 font-medium">
              Sq.Ft. Delivered
            </div>
          </div>

          <div>
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181A] font-light tabular-nums">
              DA1
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#555559] mt-1 font-medium">
              CRISIL Highest Rating
            </div>
          </div>
        </div>

        {/* MMR Commitment Callout */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#F4EFEB] border border-[#18181A]/8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-xs uppercase tracking-wider text-[#A07F55] font-semibold">
              Strategic Mumbai Expansion
            </span>
            <div className="font-serif text-lg md:text-xl text-[#18181A]">
              Prestige’s footprint now spans premier MMR locations including South Mumbai, Bandra, Mulund, and now Thane.
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#18181A]/70 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#A07F55]" />
            <span>Publicly Listed on BSE & NSE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
