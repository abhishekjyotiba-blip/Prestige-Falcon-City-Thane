import React, { useState, useEffect } from 'react';
import { X, ArrowRight, FileText } from 'lucide-react';
import { LeadIntent } from '../types';
import { trackEvent } from '../utils/analytics';

interface ExitIntentNoticeProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const ExitIntentNotice: React.FC<ExitIntentNoticeProps> = ({ onOpenModal }) => {
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [showMobileCard, setShowMobileCard] = useState(false);

  useEffect(() => {
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

    // Mobile scroll depth trigger (35% scroll depth)
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        const scrollPct =
          (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        if (scrollPct > 0.35 && scrollPct < 0.75) {
          const mobileDismissed = sessionStorage.getItem('estatewise_floating_card_dismissed');
          if (!mobileDismissed) {
            setShowMobileCard(true);
          }
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const dismissDesktop = () => {
    setShowDesktopModal(false);
    sessionStorage.setItem('estatewise_exit_dismissed', 'true');
  };

  const dismissMobile = () => {
    setShowMobileCard(false);
    sessionStorage.setItem('estatewise_floating_card_dismissed', 'true');
  };

  return (
    <>
      {/* Desktop Exit Intent Modal */}
      {showDesktopModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
          onClick={dismissDesktop}
        >
          <div
            className="w-full max-w-lg bg-[#FAF8F4] text-[#161616] rounded-2xl p-7 shadow-2xl border border-[#161616]/10 relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismissDesktop}
              aria-label="Close dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#161616]/50 hover:text-[#161616] hover:bg-[#161616]/5"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-[#B59A68] font-bold block mb-1">
              ESTATEWISE BUYER PACK
            </span>

            <h3 className="font-serif text-2xl md:text-3xl text-[#161616] font-normal mb-2 leading-tight">
              Before you leave — want the Prestige Thane Buyer Pack?
            </h3>
            <p className="text-xs md:text-sm text-[#66625C] leading-relaxed mb-5 font-light">
              Receive the indicative cost sheet, 2–4 BHK comparison, and verified floor plan alerts directly in one clean PDF document.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  dismissDesktop();
                  onOpenModal('buyer_pack', 'exit_intent_modal');
                }}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#B59A68] to-[#967E51] text-[#161616] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>SEND ME THE BUYER PACK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={dismissDesktop}
                className="px-4 py-3 text-xs text-[#66625C] hover:text-[#161616]"
              >
                No, thank you
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Value Reminder (Small, non-blocking, dismissible card at ~35% scroll depth) */}
      {showMobileCard && (
        <div className="md:hidden fixed bottom-18 left-3 right-3 z-40 bg-[#161616] text-white rounded-xl p-3 shadow-xl border border-white/10 flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B59A68]/20 text-[#B59A68] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                FREE PRESTIGE THANE BUYER PACK
              </div>
              <div className="text-[10px] text-white/70">
                Cost Sheet + Location + Updates
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                dismissMobile();
                onOpenModal('buyer_pack', 'mobile_floating_reminder');
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#B59A68] to-[#967E51] text-[#161616] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs"
            >
              <span>GET IT</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={dismissMobile}
              aria-label="Dismiss notification"
              className="w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
