import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ArrowRight, Train, Building, GraduationCap, Hospital, ShoppingBag } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface LocationSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenModal }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'transit' | 'retail' | 'social'>('all');

  const anchors = [
    {
      name: 'Metro Line 5 (Thane–Balkum–Kalyan)',
      type: 'transit',
      category: 'Transit Arterial',
      detail: 'Planned Balkum station corridor offering direct orbital rail connectivity.',
      icon: Train,
    },
    {
      name: 'Metro Line 4 (Wadala–Kasarvadavali)',
      type: 'transit',
      category: 'Transit Arterial',
      detail: 'Connecting central Thane directly to Mumbai island city business hubs.',
      icon: Train,
    },
    {
      name: 'Eastern Express Highway & Ghodbunder Rd',
      type: 'transit',
      category: 'Road Network',
      detail: 'Twin primary arterial gateways connecting BKC, South Mumbai and Western suburbs.',
      icon: Navigation,
    },
    {
      name: 'Viviana Mall & Korum Mall',
      type: 'retail',
      category: 'Lifestyle & Retail',
      detail: 'Premier destination shopping, IMAX cinema, and multi-cuisine restaurant strips.',
      icon: ShoppingBag,
    },
    {
      name: 'Jupiter Hospital & Bethany Hospital',
      type: 'social',
      category: 'Healthcare Centers',
      detail: 'Multi-speciality tertiary healthcare institutions recognized across MMR.',
      icon: Hospital,
    },
    {
      name: 'Singhania & CP Goenka International',
      type: 'social',
      category: 'Premier Academics',
      detail: 'Renowned ICSE and Cambridge curricula schools serving the Balkum-Kolshet belt.',
      icon: GraduationCap,
    },
    {
      name: 'Wagle Estate & Orion Business Hub',
      type: 'social',
      category: 'Commercial Corridors',
      detail: 'Established corporate parks hosting technology firms and financial back-offices.',
      icon: Building,
    },
    {
      name: 'Thane Railway Junction',
      type: 'transit',
      category: 'Central Rail',
      detail: 'Major interchange hub for Central Railway main line and Trans-Harbour networks.',
      icon: Train,
    },
  ];

  const filteredAnchors =
    activeCategory === 'all'
      ? anchors
      : anchors.filter((a) => a.type === activeCategory);

  return (
    <section id="location" className="py-20 md:py-32 bg-[#F4EFEB] text-[#18181A] relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            05 · Strategic Geography
          </span>
          <div className="h-px flex-1 bg-[#18181A]/10 max-w-xs" />
        </div>

        {/* Section Headline */}
        <div className="max-w-2xl mb-8 md:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181A] font-normal leading-tight">
            Prime Kolshet–Balkum Nexus
          </h2>
          <p className="mt-2 text-sm md:text-base text-[#555559] font-light">
            Strategically placed between Ghodbunder Road and the Eastern Express Highway with upcoming Metro connectivity.
          </p>
        </div>

        {/* Main Location Grid: Stylized Map + Anchors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* Stylized Minimal Vector Map Canvas */}
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-3xl p-6 md:p-8 border border-[#18181A]/10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#18181A]/8 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#A07F55]" />
                <span className="text-xs uppercase tracking-wider font-semibold text-[#18181A]">
                  Kolshet–Balkum Urban Nexus
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#555559] bg-[#18181A]/5 px-2.5 py-1 rounded-sm">
                Stylized Schematic
              </span>
            </div>

            {/* Stylized Visual Map Diagram */}
            <div className="relative aspect-[16/11] bg-[#EFE9DF]/50 rounded-2xl border border-[#18181A]/8 p-4 flex flex-col justify-between overflow-hidden">
              {/* Subtle Road Arterials (SVG Lines) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                {/* Ghodbunder Road Curve */}
                <path d="M 20 50 Q 200 120 400 60" fill="none" stroke="#A07F55" strokeWidth="3" strokeDasharray="6,4" />
                {/* Eastern Express Highway Spine */}
                <path d="M 80 400 Q 250 260 480 140" fill="none" stroke="#18181A" strokeWidth="4" />
                {/* Balkum-Kolshet Link Road */}
                <path d="M 260 180 L 420 320" fill="none" stroke="#A07F55" strokeWidth="2.5" />
                {/* Metro Line 4 & 5 Corridors */}
                <path d="M 120 390 Q 280 230 460 80" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4,4" />
              </svg>

              {/* Pin 1: Prestige Thane Enclave (Anchor Center) */}
              <div className="absolute top-[42%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#18181A] text-[#C5A880] flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-[#C5A880]/30 animate-pulse">
                    <MapPin className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="mt-1 bg-[#18181A] text-white px-2.5 py-1 rounded-md text-[10px] uppercase font-semibold tracking-wider shadow-md whitespace-nowrap border border-[#C5A880]/40">
                  Prestige Address (~14.6 Ac)
                </div>
              </div>

              {/* Surrounding Context Anchors on Map */}
              <div className="absolute top-[18%] left-[28%] z-10 text-[9px] uppercase tracking-wider text-[#18181A]/70 bg-white/80 px-2 py-0.5 rounded-sm border border-[#18181A]/10">
                Ghodbunder Road
              </div>
              <div className="absolute bottom-[20%] left-[18%] z-10 text-[9px] uppercase tracking-wider text-[#18181A]/70 bg-white/80 px-2 py-0.5 rounded-sm border border-[#18181A]/10">
                Viviana & Jupiter Hospital
              </div>
              <div className="absolute bottom-[10%] right-[22%] z-10 text-[9px] uppercase tracking-wider text-[#18181A]/70 bg-white/80 px-2 py-0.5 rounded-sm border border-[#18181A]/10">
                Thane Station Hub
              </div>
              <div className="absolute top-[15%] right-[15%] z-10 text-[9px] uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                Metro Line 5 Balkum
              </div>

              {/* Map Legend */}
              <div className="mt-auto relative z-10 flex flex-wrap gap-2 text-[10px] text-[#18181A]/70 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-[#18181A]/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#18181A]" />
                  <span>Prestige Development</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-blue-600" />
                  <span>Metro Line 4 & 5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-[#18181A]" />
                  <span>Eastern Express Highway</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-[#555559] leading-relaxed">
              Situated in the emerging northern micro-market of Thane West, the Kolshet–Balkum sector benefits from wide multi-lane bypass roads, reduced congestion compared to traditional city pockets, and proximity to major commercial hubs.
            </p>
          </div>

          {/* Right Anchor Cards with Filter Tabs */}
          <div className="lg:col-span-5 space-y-4">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#18181A]/8">
              {[
                { id: 'all', label: 'All Anchors' },
                { id: 'transit', label: 'Transit' },
                { id: 'retail', label: 'Retail & Mall' },
                { id: 'social', label: 'Healthcare & Schools' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`flex-1 py-1.5 px-2 text-[11px] font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                    activeCategory === tab.id
                      ? 'bg-[#18181A] text-white shadow-xs'
                      : 'text-[#18181A]/60 hover:text-[#18181A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Anchor List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredAnchors.map((anchor, idx) => {
                const IconComponent = anchor.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#18181A]/8 hover:border-[#A07F55]/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F4EFEB] text-[#A07F55] flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#18181A]">
                          {anchor.name}
                        </div>
                        <div className="text-[11px] text-[#A07F55] font-medium">
                          {anchor.category}
                        </div>
                        <p className="mt-1 text-xs text-[#555559] leading-relaxed">
                          {anchor.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location Conversion Strip */}
        <div className="bg-[#18181A] text-white rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold block mb-1">
              Comprehensive Corridor Intelligence
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-white">
              Want the complete location analysis?
            </h3>
            <p className="mt-1 text-xs md:text-sm text-white/70">
              Connectivity · Infrastructure · Metro Line 4 & 5 Timelines · Social Infrastructure Directory
            </p>
          </div>

          <button
            onClick={() => {
              trackEvent('location_report_click', { section: 'location_cta_strip' });
              onOpenModal('location_report', 'location_cta_strip');
            }}
            className="w-full md:w-auto h-13 px-8 rounded-xl bg-[#C5A880] hover:bg-[#d5b990] text-[#18181A] font-semibold text-xs md:text-sm tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <span>GET LOCATION REPORT</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
