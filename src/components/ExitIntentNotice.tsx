import React, { useState, useEffect } from 'react';
import { X, BookOpen, ArrowRight } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface ExitIntentNoticeProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const ExitIntentNotice: React.FC<ExitIntentNoticeProps> = ({ onOpenModal }) => {
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [showMobileCard, setShowMobileCard] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Only enable after meaningful dwell time (e.g. 10s)
    const dwellTimer = setTimeout(() => {
      setHasInteracted(true);
    }, 9000);

    // Desktop exit intent: mouse leaves top of viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && window.innerWidth >= 1024) {
        const dismissed = sessionStorage.getItem('estatewise_exit_dismissed');
        if (!dismissed) {
          setShowDesktopModal(true);
          trackEvent('form_open', { trigger: 'desktop_exit_intent' });
          sessionStorage.setItem('estatewise_exit_dismissed', 'true');
        }
      }
    };

    // Mobile scroll depth trigger (55% scroll depth)
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        const scrollPct =
          (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        if (scrollPct > 0.55 && scrollPct < 0.85) {
          const mobileDismissed = sessionStorage.getItem('estatewise_mobile_toast_dismissed');
          if (!mobileDismissed) {
            setShowMobileCard(true);
            sessionStorage.setItem('mobile_toast_shown', 'true');
          }
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(dwellTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasInteracted]);

  const dismissDesktop = () => {
    setShowDesktopModal(false);
    sessionStorage.setItem('estatewise_exit_dismissed', 'true');
  };

  const dismissMobile = () => {
    setShowMobileCard(false);
    sessionStorage.setItem('estatewise_mobile_toast_dismissed', 'true');
  };

  return (
    <>
      {/* Desktop Tasteful Exit Intent Modal */}
      {showDesktopModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
          onClick={dismissDesktop}
        >
          <div
            className="w-full max-w-lg bg-[#FAF8F5] text-[#18181A] rounded-2xl p-7 md:p-8 shadow-2xl border border-[#18181A]/10 relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismissDesktop}
              aria-label="Close dialog"
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#18181A]/50 hover:text-[#18181A] hover:bg-[#18181A]/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-widest text-[#A07F55] font-semibold">
                EstateWise Private Dossier
              </span>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl text-[#18181A] font-normal mb-2 leading-tight">
              Before you leave — want the Prestige Thane Buyer Pack?
            </h3>
            <p className="text-xs md:text-sm text-[#555559] leading-relaxed mb-6 font-light">
              Receive the indicative cost sheet, 2–4 BHK comparison, and verified floor plan alerts directly in one clean PDF document.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  dismissDesktop();
                  onOpenModal('buyer_pack', 'exit_intent_modal');
                }}
                className="flex-1 h-12 rounded-xl bg-[#18181A] hover:bg-[#28282B] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>SEND ME THE BUYER PACK</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>
              <button
                onClick={dismissDesktop}
                className="px-4 py-3 text-xs text-[#555559] hover:text-[#18181A]"
              >
                No, thank you
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Non-Blocking Subtle Card (Appears once after 55% scroll depth) */}
      {showMobileCard && (
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-40 bg-[#18181A] text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-serif font-medium text-white">
                Want all this in one buyer pack?
              </div>
              <button
                onClick={() => {
                  dismissMobile();
                  onOpenModal('buyer_pack', 'mobile_scroll_card');
                }}
                className="text-[11px] text-[#C5A880] font-semibold underline underline-offset-2 flex items-center gap-1 mt-0.5"
              >
                <span>Get it free now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button
            onClick={dismissMobile}
            aria-label="Dismiss notification"
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};
