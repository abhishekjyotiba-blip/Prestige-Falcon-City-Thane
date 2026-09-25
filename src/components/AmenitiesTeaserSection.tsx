import React from 'react';
import { ArrowRight, Waves, Dumbbell, Coffee, Sparkles } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface AmenitiesTeaserSectionProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const AmenitiesTeaserSection: React.FC<AmenitiesTeaserSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="py-16 md:py-24 bg-[#F4EFEB] text-[#18181A] relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Eyebrow */}
        <div className="text-center mb-3">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#A07F55] font-semibold">
            CLUBHOUSE & LEISURE
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-xl mx-auto mb-8 md:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181A] font-normal leading-tight">
            Resort-Class Amenities
          </h2>
          <p className="mt-2 text-sm md:text-base text-[#555559] font-light">
            Envisioned with sky decks, infinity edge pools, health clubs, and pedestrian promenades.
          </p>
        </div>

        {/* Cinematic Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          {/* Main Visual Image Card */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl bg-black min-h-[340px] md:min-h-[460px] group">
            <img
              src="/src/assets/images/luxury_infinity_pool_1790331171326.jpg"
              alt="Luxury cantilevered infinity pool at twilight"
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-4 left-4">
              <span className="text-[10px] uppercase tracking-wider text-white bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-semibold">
                Representative Amenity Visual
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-widest text-[#E8DFC9] font-medium block mb-1">
                Elevated Wellness & Sky Cabanas
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-white font-normal">
                Infinity lap pool floating above the Thane city skyline.
              </h3>
            </div>
          </div>

          {/* Quick 3 Amenity Mini Visual Cards */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div
              onClick={() => onOpenModal('amenities_update', 'amenity_card_sports')}
              className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#18181A]/10 shadow-xs hover:border-[#A07F55]/40 transition-all cursor-pointer group flex-1 flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#F4EFEB] text-[#A07F55] flex items-center justify-center group-hover:bg-[#18181A] group-hover:text-white transition-colors">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#18181A] font-medium">Grand Aquatic Zone</h4>
                  <span className="text-[11px] text-[#A07F55] uppercase font-semibold">Infinity Pool & Kids Splash</span>
                </div>
              </div>
              <p className="text-xs text-[#555559] leading-relaxed">
                Olympic-length temperature-controlled pool flanked by shaded sun cabanas.
              </p>
            </div>

            <div
              onClick={() => onOpenModal('amenities_update', 'amenity_card_fitness')}
              className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#18181A]/10 shadow-xs hover:border-[#A07F55]/40 transition-all cursor-pointer group flex-1 flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#F4EFEB] text-[#A07F55] flex items-center justify-center group-hover:bg-[#18181A] group-hover:text-white transition-colors">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#18181A] font-medium">Sports & Fitness Arena</h4>
                  <span className="text-[11px] text-[#A07F55] uppercase font-semibold">CrossFit & Indoor Courts</span>
                </div>
              </div>
              <p className="text-xs text-[#555559] leading-relaxed">
                Full-scale gymnasium, badminton courts, squash court, and yoga studio.
              </p>
            </div>

            <div
              onClick={() => onOpenModal('amenities_update', 'amenity_card_retail')}
              className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#18181A]/10 shadow-xs hover:border-[#A07F55]/40 transition-all cursor-pointer group flex-1 flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#F4EFEB] text-[#A07F55] flex items-center justify-center group-hover:bg-[#18181A] group-hover:text-white transition-colors">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#18181A] font-medium">Retail Promenade</h4>
                  <span className="text-[11px] text-[#A07F55] uppercase font-semibold">Integrated Shopping</span>
                </div>
              </div>
              <p className="text-xs text-[#555559] leading-relaxed">
                Gourmet cafes, convenience stores, and salons at your doorstep.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="text-center">
          <button
            onClick={() => {
              trackEvent('buyer_pack_click', { section: 'amenity_teaser_btn' });
              onOpenModal('amenities_update', 'amenity_teaser_btn');
            }}
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-[#18181A] hover:bg-[#28282B] text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-md inline-flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <span>GET FULL AMENITIES LIST & BROCHURE</span>
            <ArrowRight className="w-4 h-4 text-[#C5A880] transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
