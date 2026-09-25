import React from 'react';

export const ScaleSection: React.FC = () => {
  return (
    <section id="scale" className="py-14 md:py-20 bg-[#FAF8F5] text-[#18181A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            THE SCALE
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Big Graphic Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 md:p-8 rounded-2xl bg-[#F4EFEB] border border-[#18181A]/8">
            <div className="font-serif text-5xl md:text-7xl text-[#18181A] font-light leading-none tabular-nums">
              14.6
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-[#A07F55] font-bold">
              ACRES MASTERPLAN
            </div>
            <p className="mt-1.5 text-xs text-[#555559]">
              Contiguous prime land parcel at Kolshet–Balkum.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-[#F4EFEB] border border-[#18181A]/8">
            <div className="font-serif text-5xl md:text-7xl text-[#18181A] font-light leading-none tabular-nums">
              5M<span className="text-[#A07F55] font-thin">+</span>
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-[#A07F55] font-bold">
              SQ.FT. POTENTIAL
            </div>
            <p className="mt-1.5 text-xs text-[#555559]">
              High-rise towers, landscaped podium & retail high-street.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-[#F4EFEB] border border-[#18181A]/8">
            <div className="font-serif text-5xl md:text-7xl text-[#18181A] font-light leading-none tabular-nums">
              ₹6,000 <span className="text-3xl text-[#A07F55]">CR</span>
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-[#A07F55] font-bold">
              ESTIMATED GDV
            </div>
            <p className="mt-1.5 text-xs text-[#555559]">
              Prestige Group&apos;s flagship development in Thane.
            </p>
          </div>
        </div>

        {/* High-Impact Visual Banner */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/8] md:aspect-[21/8] bg-black shadow-xl">
          <img
            src="/src/assets/images/architecture_scale_exterior_1790328236147.jpg"
            alt="Prestige Thane Scale and Masterplan"
            loading="lazy"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white text-xs">
            <span className="font-serif text-base md:text-xl text-[#E8DFC9]">
              A transformative destination for Northern Thane
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10 hidden sm:inline-block">
              Architectural Concept
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
