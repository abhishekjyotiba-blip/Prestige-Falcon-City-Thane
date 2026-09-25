import React from 'react';

export const IntegratedDevelopmentSection: React.FC = () => {
  const pillars = [
    { title: 'RESIDENCES', desc: 'High-volume apartments designed with deep balconies and expansive vistas.' },
    { title: 'LANDSCAPE', desc: 'Curated central green lungs, pedestrian trails, and tranquil garden enclaves.' },
    { title: 'RETAIL', desc: 'Integrated high-street shopping, daily conveniences, and boutique dining promenade.' },
    { title: 'LIFESTYLE', desc: 'Multi-tiered leisure hubs supporting health, wellness, and multi-generation recreation.' },
    { title: 'CONNECTION', desc: 'Seamless vehicular circulation segregating pedestrian zones from access corridors.' },
  ];

  return (
    <section className="py-20 md:py-32 bg-[#FAF8F5] text-[#18181A] relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            07 · Masterplan Enclave
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Section Headline */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#18181A] font-normal leading-[1.05] tracking-tight">
            A neighbourhood, <br />
            not simply a tower.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#555559] font-light leading-relaxed">
            Prestige’s development philosophy bridges residential sanctuary with a self-sufficient urban ecosystem.
          </p>
        </div>

        {/* Visual Showcase + Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xl bg-[#E8DFC9]/30 border border-[#18181A]/10 aspect-[16/9]">
            <img
              src="/src/assets/images/lifestyle_retail_landscape_1790328269532.jpg"
              alt="Integrated retail and landscape masterplan vision"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
              <span className="text-[10px] tracking-wider uppercase bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-white/10">
                Integrated Promenade · Representative visual
              </span>
              <span className="hidden sm:inline-block text-xs text-[#E8DFC9] font-serif">
                Residential-Led with High-Street Retail
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-serif text-2xl md:text-3xl text-[#18181A] font-normal leading-snug">
              Every daily rhythm answered without stepping onto arterial roads.
            </h3>
            <p className="text-xs md:text-sm text-[#555559] font-light leading-relaxed">
              Envisioned across ~14.6 acres, the masterplan integrates retail boulevards for daily essentials, serene courtyards insulated from traffic noise, and dedicated residential drop-offs.
            </p>
          </div>
        </div>

        {/* 5 Masterplan Pillars (Refined typographical layout) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 pt-8 border-t border-[#18181A]/10">
          {pillars.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="text-xs text-[#A07F55] font-serif tabular-nums font-semibold">
                0{idx + 1}
              </div>
              <div className="font-serif text-lg md:text-xl text-[#18181A] font-medium tracking-tight">
                {item.title}
              </div>
              <p className="text-xs text-[#555559] font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
