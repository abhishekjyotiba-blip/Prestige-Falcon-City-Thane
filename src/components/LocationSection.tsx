import React from 'react';
import { MapPin, Navigation, Train, ShoppingBag, Hospital, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface LocationSectionProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenModal }) => {
  const nodes = [
    { title: 'Metro Line 5 (Balkum Station)', detail: 'Direct rail corridor connecting Thane & Kalyan.', icon: Train },
    { title: 'Metro Line 4 (Wadala–Kasarvadavali)', detail: 'Direct access to South Mumbai & island city hubs.', icon: Train },
    { title: 'Eastern Express Highway & GB Road', detail: 'Twin primary arterial gateways to BKC & Western suburbs.', icon: Navigation },
    { title: 'Viviana Mall & Korum Mall', detail: 'Premier lifestyle retail, dining, and IMAX cinema.', icon: ShoppingBag },
    { title: 'Jupiter Hospital & Bethany', detail: 'Tertiary multi-specialty healthcare institutions.', icon: Hospital },
    { title: 'CP Goenka & Singhania Schools', detail: 'Premier ICSE & Cambridge academic campuses.', icon: MapPin },
  ];

  return (
    <section id="location" className="py-12 md:py-18 bg-[#EFE9DE] text-[#161616] relative border-y border-[#161616]/10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[#967E51] font-bold">
            STRATEGIC LOCATION
          </span>
          <div className="h-px flex-1 bg-[#161616]/10 max-w-xs" />
        </div>

        <div className="max-w-2xl mb-7">
          <div className="text-xs uppercase tracking-widest text-[#B59A68] font-bold">
            KOLSHET–BALKUM
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161616] font-normal leading-tight mt-0.5">
            In the path of a changing Thane.
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#66625C] font-light">
            Situated at the strategic convergence of the Eastern Express Highway bypass and the upcoming Metro Line 5 corridor.
          </p>
        </div>

        {/* Map & Anchors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch mb-7">
          {/* Left: Graphic Map Infographic */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-white border border-[#161616]/10 shadow-sm aspect-[16/11]">
            <img
              src="/src/assets/images/location_report_map_1790332367021.jpg"
              alt="Kolshet Balkum Metro and Highway Map"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-semibold text-white">Prestige Address Enclave (~14.6 Acres)</span>
              <span className="text-[10px] text-[#F3ECE0] font-mono">Balkum-Kolshet Road</span>
            </div>
          </div>

          {/* Right: 6 Key Important Nodes */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {nodes.map((n, i) => {
              const IconComp = n.icon;
              return (
                <div key={i} className="p-3 rounded-xl bg-white border border-[#161616]/8 shadow-xs flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F1E9] text-[#B59A68] flex items-center justify-center shrink-0 mt-0.5">
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#161616] block">{n.title}</span>
                    <span className="text-[11px] text-[#66625C] block leading-tight">{n.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Locked Report Card: Location Intelligence Report */}
        <div
          onClick={() => {
            trackEvent('location_report_click', { section: 'location_locked_card' });
            onOpenModal('location_report', 'location_locked_card');
          }}
          className="rounded-2xl bg-[#161616] text-white p-5 md:p-6 shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B59A68]/20 text-[#B59A68] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#B59A68]">
                ESTATEWISE LOCATION INTELLIGENCE REPORT
              </div>
              <h3 className="font-serif text-lg md:text-xl text-white font-normal">
                Metro connectivity · Road infrastructure · Schools · Hospitals · Retail
              </h3>
            </div>
          </div>

          <button
            type="button"
            className="w-full md:w-auto h-12 px-6 rounded-xl bg-gradient-to-r from-[#B59A68] to-[#967E51] hover:brightness-105 text-[#161616] font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>SEND ME THE LOCATION REPORT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
