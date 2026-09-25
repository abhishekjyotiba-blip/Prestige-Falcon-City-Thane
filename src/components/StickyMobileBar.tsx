import React, { useState, useEffect } from 'react';
import { Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface StickyMobileBarProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
  personalizedTerm?: string;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  onOpenModal,
  personalizedTerm,
}) => {
  const [currentSection, setCurrentSection] = useState<'hero' | 'master_plan' | 'residences' | 'cost_sheet' | 'floor_plan' | 'location' | 'buyer_pack' | 'default'>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;

      const heroEl = document.getElementById('overview');
      const masterPlanEl = document.getElementById('master-plan');
      const residencesEl = document.getElementById('residences');
      const costSheetEl = document.getElementById('cost-sheet');
      const floorPlanEl = document.getElementById('floor-plans');
      const locationEl = document.getElementById('location');
      const buyerPackEl = document.getElementById('buyer-pack');

      if (buyerPackEl && scrollPos >= buyerPackEl.offsetTop) {
        setCurrentSection('buyer_pack');
      } else if (locationEl && scrollPos >= locationEl.offsetTop) {
        setCurrentSection('location');
      } else if (floorPlanEl && scrollPos >= floorPlanEl.offsetTop) {
        setCurrentSection('floor_plan');
      } else if (costSheetEl && scrollPos >= costSheetEl.offsetTop) {
        setCurrentSection('cost_sheet');
      } else if (residencesEl && scrollPos >= residencesEl.offsetTop) {
        setCurrentSection('residences');
      } else if (masterPlanEl && scrollPos >= masterPlanEl.offsetTop) {
        setCurrentSection('master_plan');
      } else {
        setCurrentSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine dynamic CTA text & intent
  const getDynamicAction = (): { label: string; intent: LeadIntent } => {
    // If search term specifies intent, prioritize it initially
    if (personalizedTerm) {
      const lower = personalizedTerm.toLowerCase();
      if (lower.includes('price') || lower.includes('cost')) {
        return { label: 'GET COST SHEET', intent: 'cost_sheet' };
      }
      if (lower.includes('floor') || lower.includes('plan')) {
        return { label: 'GET FLOOR PLANS', intent: 'floor_plan' };
      }
    }

    switch (currentSection) {
      case 'master_plan':
        return { label: 'UNLOCK MASTER PLAN', intent: 'launch_kit' };
      case 'residences':
      case 'cost_sheet':
        return { label: 'UNLOCK COST SHEET', intent: 'cost_sheet' };
      case 'floor_plan':
        return { label: 'UNLOCK FLOOR PLANS', intent: 'floor_plan' };
      case 'location':
        return { label: 'GET LOCATION REPORT', intent: 'location_report' };
      case 'buyer_pack':
        return { label: 'GET BUYER PACK', intent: 'buyer_pack' };
      default:
        return { label: 'UNLOCK LAUNCH KIT', intent: 'launch_kit' };
    }
  };

  const action = getDynamicAction();

  return (
    <aside aria-label="Quick Actions" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#18181A]/10 px-4 py-2.5 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        {/* Direct Call Button (Phone Hitbox >= 44x44) */}
        <a
          href="tel:+919820000000"
          onClick={() => trackEvent('call_click', { source: 'sticky_bar' })}
          aria-label="Direct Phone Consultation"
          className="w-12 h-12 rounded-xl bg-white border border-[#18181A]/15 text-[#18181A] flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-xs"
        >
          <Phone className="w-5 h-5 text-[#A07F55]" />
        </a>

        {/* WhatsApp Direct Chat Trigger */}
        <a
          href={`https://wa.me/919820000000?text=${encodeURIComponent(
            'Hello EstateWise, I am inquiring about Prestige Thane launch kit and indicative pricing.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { source: 'sticky_bar' })}
          aria-label="WhatsApp Priority Message"
          className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        {/* Dynamic Context-Aware Main Button */}
        <button
          onClick={() => {
            trackEvent('hero_cta_click', {
              source: 'sticky_bar',
              section: currentSection,
              intent: action.intent,
            });
            onOpenModal(action.intent, `sticky_bar_${currentSection}`);
          }}
          className="flex-1 h-12 rounded-xl bg-[#18181A] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
        >
          <span>{action.label}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
        </button>
      </div>
    </aside>
  );
};
