import React, { useState, useEffect } from 'react';
import { Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface StickyMobileBarProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
  personalizedTerm?: string;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  onOpenModal,
  personalizedTerm,
}) => {
  const [currentSection, setCurrentSection] = useState<'hero' | 'price' | 'residences' | 'floor_plan' | 'location' | 'bottom' | 'default'>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;

      const heroEl = document.getElementById('overview');
      const costSheetEl = document.getElementById('cost-sheet');
      const residencesEl = document.getElementById('residences');
      const floorPlanEl = document.getElementById('floor-plans');
      const locationEl = document.getElementById('location');
      const bottomEl = document.getElementById('faq');

      if (bottomEl && scrollPos >= bottomEl.offsetTop) {
        setCurrentSection('bottom');
      } else if (locationEl && scrollPos >= locationEl.offsetTop) {
        setCurrentSection('location');
      } else if (floorPlanEl && scrollPos >= floorPlanEl.offsetTop) {
        setCurrentSection('floor_plan');
      } else if (residencesEl && scrollPos >= residencesEl.offsetTop) {
        setCurrentSection('residences');
      } else if (costSheetEl && scrollPos >= costSheetEl.offsetTop) {
        setCurrentSection('price');
      } else {
        setCurrentSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine dynamic CTA text & intent
  const getDynamicAction = (): { label: string; intent: LeadIntent | string } => {
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
      case 'price':
        return { label: 'GET COST SHEET', intent: 'cost_sheet' };
      case 'residences':
        return { label: 'GET CONFIG DETAILS', intent: 'cost_sheet' };
      case 'floor_plan':
        return { label: 'GET FLOOR PLANS', intent: 'floor_plan' };
      case 'location':
        return { label: 'GET LOCATION REPORT', intent: 'location_report' };
      case 'bottom':
        return { label: 'TALK TO ADVISOR', intent: 'advisor_call' };
      default:
        return { label: 'GET BUYER PACK', intent: 'buyer_pack' };
    }
  };

  const action = getDynamicAction();

  return (
    <aside aria-label="Quick Actions" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-t border-[#161616]/10 px-4 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Direct Call Button */}
        <a
          href="tel:+919820000000"
          onClick={() => trackEvent('call_click', { source: 'sticky_bar' })}
          aria-label="Direct Phone Consultation"
          className="w-11 h-11 rounded-xl bg-white border border-[#161616]/15 text-[#161616] flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-xs"
        >
          <Phone className="w-4 h-4 text-[#B59A68]" />
        </a>

        {/* WhatsApp Direct Chat Trigger */}
        <a
          href={`https://wa.me/919820000000?text=${encodeURIComponent(
            'Hello EstateWise, please share the Prestige Thane Buyer Pack and indicative cost sheet.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { source: 'sticky_bar' })}
          aria-label="WhatsApp Priority Message"
          className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4" />
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
          className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#B59A68] to-[#967E51] text-[#161616] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
        >
          <span>{action.label}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
