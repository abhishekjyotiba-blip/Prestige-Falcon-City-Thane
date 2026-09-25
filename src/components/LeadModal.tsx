import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Phone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { LeadIntent, LeadSubmission } from '../types';
import { saveLead, updateLeadSecondary, trackEvent } from '../utils/analytics';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadIntent: LeadIntent;
  sourceSection?: string;
}

const INTENT_CONFIG: Record<
  LeadIntent,
  {
    title: string;
    subtitle: string;
    perks: string[];
    ctaText: string;
    assetName: string;
  }
> = {
  launch_kit: {
    title: 'Get the Prestige Thane Private Launch Kit',
    subtitle: 'Receive the complete preliminary buyer dossier directly via WhatsApp & Email.',
    perks: [
      'Indicative Cost Sheet & Estimated Outlays',
      '2, 3 & 4 BHK Configuration Comparison',
      'Kolshet–Balkum Infrastructure & Location Report',
      'Priority MahaRERA & Official Launch Alerts',
    ],
    ctaText: 'SEND ME THE LAUNCH KIT →',
    assetName: 'Private Launch Kit',
  },
  cost_sheet: {
    title: 'Get the Detailed Indicative Cost Sheet',
    subtitle: 'Understand estimated base rate, floor rise, statutory charges & complete outlay before deciding.',
    perks: [
      'Itemized Component Estimates (Base + Taxes + Levies)',
      'Unit-by-Unit Indicative Payment Schedule',
      'Phase-Wise Commercial Disclosures',
    ],
    ctaText: 'UNLOCK COMPLETE COST SHEET →',
    assetName: 'Indicative Cost Sheet',
  },
  floor_plan: {
    title: 'Get Floor Plan Updates & Layout Analysis',
    subtitle: 'Be the first to receive verified architectural plans and carpet area disclosures upon release.',
    perks: [
      'Instant Alert When Official Plans Are Released',
      'Usable Carpet Area & Balcony Space Breakdown',
      'Vastu & Spatial Orientation Overview',
    ],
    ctaText: 'NOTIFY ME WHEN PLANS ARE READY →',
    assetName: 'Floor Plan Dossier',
  },
  location_report: {
    title: 'Get the Kolshet–Balkum Location Dossier',
    subtitle: 'In-depth connectivity, metro timelines, upcoming flyovers, and social infrastructure analysis.',
    perks: [
      'Metro Line 4 & Line 5 Transit Impact Map',
      'Social Infrastructure Directory (Top Schools & Hospitals)',
      'Real Micro-Market Commute Insights',
    ],
    ctaText: 'SEND ME THE LOCATION REPORT →',
    assetName: 'Location & Connectivity Report',
  },
  buyer_pack: {
    title: 'Get the Prestige Thane Buyer Pack',
    subtitle: 'Free, curated 8-part advisory dossier prepared by EstateWise for serious homebuyers.',
    perks: [
      'Cost Sheet + Layout Comparison + Location Analysis',
      'Upcoming MahaRERA & Possession Timelines',
      'Priority Site Visit Coordination',
    ],
    ctaText: 'RECEIVE MY BUYER PACK →',
    assetName: 'EstateWise Buyer Pack',
  },
  site_visit: {
    title: 'Schedule a Private Project Consultation',
    subtitle: 'Connect with an EstateWise senior Thane advisor for unbiased advisory and site walkthrough guidance.',
    perks: [
      '1-on-1 Confidential Discussion',
      'Actual Location & Road Access Guidance',
      'Comparative Analysis vs. Neighboring Kolshet Projects',
    ],
    ctaText: 'SCHEDULE PRIVATE CONSULTATION →',
    assetName: 'Private Consultation Booking',
  },
  callback: {
    title: 'Request a Direct Callback',
    subtitle: 'Speak with a senior property advisor regarding the upcoming Prestige development in Thane.',
    perks: [
      'Direct Senior Advisor Discussion',
      'Latest Verified Public Disclosures',
      'Unbiased Thane Micro-Market Overview',
    ],
    ctaText: 'REQUEST CALL FROM ADVISOR →',
    assetName: 'Advisor Callback',
  },
  price_update: {
    title: 'Get Latest Indicative Price Updates',
    subtitle: 'Stay informed on tentative unit brackets and early release commercial updates.',
    perks: [
      '2, 3 & 4 BHK Tentative Brackets',
      'Early Notification On Pre-Booking Windows',
    ],
    ctaText: 'SEND ME PRICE UPDATES →',
    assetName: 'Pricing Update Alert',
  },
  offer_update: {
    title: 'Request Launch Privilege Updates',
    subtitle: 'Receive early announcements on prospective launch privileges and priority windows.',
    perks: [
      'Priority Window Disclosures',
      'Direct Project Communication Only',
    ],
    ctaText: 'JOIN PRIORITY UPDATES →',
    assetName: 'Launch Privilege Information',
  },
  amenities_update: {
    title: 'Get Envisioned Amenities & Masterplan Updates',
    subtitle: 'Prestige has indicated integrated retail, clubhouse, and landscaped open spaces.',
    perks: [
      'Clubhouse, Retail & Sports Masterplan Updates',
      'Phased Delivery & Open Space Insights',
    ],
    ctaText: 'SEND ME AMENITY UPDATES →',
    assetName: 'Masterplan & Amenities Update',
  },
};

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  leadIntent,
  sourceSection,
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<LeadSubmission | null>(null);

  // Optional step 2 states (non-blocking post-submission)
  const [configuration, setConfiguration] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [secondarySaved, setSecondarySaved] = useState(false);

  const config = INTENT_CONFIG[leadIntent] || INTENT_CONFIG.launch_kit;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError('');
      trackEvent('form_open', {
        intent: leadIntent,
        source: sourceSection,
      });
    } else {
      document.body.style.overflow = '';
      // Reset state after close animation
      const timer = setTimeout(() => {
        setSubmittedLead(null);
        setName('');
        setMobile('');
        setError('');
        setConfiguration('');
        setTimeframe('');
        setSecondarySaved(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, leadIntent, sourceSection]);

  if (!isOpen) return null;

  const validateMobile = (num: string) => {
    // Strip non-digits
    const clean = num.replace(/\D/g, '');
    return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanMobile = mobile.replace(/\D/g, '');

    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }

    if (!validateMobile(cleanMobile)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsSubmitting(true);
    trackEvent('lead_submit', {
      intent: leadIntent,
      source: sourceSection,
    });

    try {
      const saved = saveLead({
        name: name.trim(),
        mobile: cleanMobile,
        leadIntent,
        sourceSection,
        project: 'Prestige Thane',
      });

      setSubmittedLead(saved);
      setIsSubmitting(false);
    } catch {
      setError('Something went wrong. Please try again or tap Call directly.');
      setIsSubmitting(false);
    }
  };

  const handleSecondarySubmit = (configChoice?: string, timeChoice?: string) => {
    if (!submittedLead) return;
    const finalConfig = configChoice || configuration;
    const finalTime = timeChoice || timeframe;

    updateLeadSecondary(submittedLead.id, {
      configurationInterested: finalConfig,
      timeframe: finalTime,
    });
    setSecondarySaved(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center p-0 md:p-4 bg-black/65 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-lg bg-[#FAF8F5] text-[#18181A] rounded-t-3xl md:rounded-2xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col border border-[#18181A]/10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="md:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1 bg-[#18181A]/20 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-[#18181A]/8">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#A07F55] font-semibold">
              EstateWise Advisory
            </span>
            <span className="text-[#18181A]/30">·</span>
            <span className="text-xs text-[#18181A]/60">Prestige Thane</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#18181A]/60 hover:text-[#18181A] hover:bg-[#18181A]/5 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-7">
          {!submittedLead ? (
            /* STEP 1: Core Low-Friction Form */
            <div>
              <h2
                id="lead-modal-title"
                className="font-serif text-2xl md:text-3xl leading-tight text-[#18181A] mb-2 font-normal"
              >
                {config.title}
              </h2>
              <p className="text-sm text-[#555559] leading-relaxed mb-5">
                {config.subtitle}
              </p>

              {/* What you receive checkmarks */}
              <div className="bg-[#F4EFEB] p-4 rounded-xl mb-6 space-y-2.5 border border-[#18181A]/6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A07F55] block mb-1">
                  Included in your request:
                </span>
                {config.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-[#18181A]/90">
                    <span className="text-[#A07F55] font-bold mt-0.5">✓</span>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="lead-name" className="block text-xs font-medium text-[#18181A]/80 mb-1.5 uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      trackEvent('form_start', { field: 'name' });
                    }}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full h-12 px-4 rounded-xl bg-white border border-[#18181A]/15 text-[#18181A] placeholder:text-[#18181A]/35 text-base focus:outline-none focus:ring-2 focus:ring-[#A07F55] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="lead-mobile" className="block text-xs font-medium text-[#18181A]/80 mb-1.5 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="flex rounded-xl bg-white border border-[#18181A]/15 focus-within:ring-2 focus-within:ring-[#A07F55] focus-within:border-transparent transition-all overflow-hidden">
                    <span className="inline-flex items-center px-3.5 text-sm font-semibold text-[#18181A]/70 bg-[#F4EFEB] border-r border-[#18181A]/10 select-none">
                      +91
                    </span>
                    <input
                      id="lead-mobile"
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobile(val);
                      }}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      inputMode="numeric"
                      className="w-full h-12 px-3.5 text-[#18181A] placeholder:text-[#18181A]/35 text-base focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 mt-2 rounded-xl bg-[#18181A] hover:bg-[#28282B] text-white font-medium text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="inline-block animate-pulse">Preparing your file...</span>
                  ) : (
                    <span>{config.ctaText}</span>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#18181A]/50 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A07F55] shrink-0" />
                  <span>By continuing, you agree to be contacted regarding this project. No spam.</span>
                </div>
              </form>
            </div>
          ) : (
            /* STEP 2: Premium Success State with Optional Non-Blocking Preference */
            <div className="py-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl md:text-2xl text-[#18181A]">
                    You&apos;re on the Priority List
                  </h3>
                  <span className="text-xs text-[#555559]">Prestige Thane Priority Desk</span>
                </div>
              </div>

              <p className="text-sm text-[#555559] leading-relaxed mb-5 bg-[#F4EFEB] p-3.5 rounded-xl border border-[#18181A]/6">
                Thank you, <strong>{name}</strong>. Our senior advisory team will share the latest available{' '}
                <strong>{config.assetName}</strong> with you shortly via WhatsApp and call.
              </p>

              {/* Optional qualification question (non-blocking) */}
              {!secondarySaved ? (
                <div className="mb-6 p-4 rounded-xl bg-white border border-[#18181A]/10 space-y-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#A07F55] block">
                    Optional: Tailor your dossier (1 tap)
                  </span>

                  <div>
                    <label className="text-xs text-[#18181A]/70 mb-2 block font-medium">
                      Which configuration are you exploring?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['2 BHK', '3 BHK', '4 BHK', 'Investment', 'Not Sure'].map((cfg) => (
                        <button
                          key={cfg}
                          type="button"
                          onClick={() => {
                            setConfiguration(cfg);
                            handleSecondarySubmit(cfg, timeframe);
                          }}
                          className={`py-2 px-2 text-xs rounded-lg border text-center transition-all ${
                            configuration === cfg
                              ? 'bg-[#18181A] text-white border-[#18181A]'
                              : 'bg-[#FAF8F5] text-[#18181A]/80 border-[#18181A]/15 hover:border-[#18181A]/40'
                          }`}
                        >
                          {cfg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs text-[#18181A]/70 mb-2 block font-medium">
                      When are you planning to purchase?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['0–3 Months', '3–6 Months', '6–12 Months', 'Just Researching'].map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => {
                            setTimeframe(tf);
                            handleSecondarySubmit(configuration, tf);
                          }}
                          className={`py-2 px-2 text-xs rounded-lg border text-center transition-all ${
                            timeframe === tf
                              ? 'bg-[#18181A] text-white border-[#18181A]'
                              : 'bg-[#FAF8F5] text-[#18181A]/80 border-[#18181A]/15 hover:border-[#18181A]/40'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Preferences saved. We will tailor your package accordingly.</span>
                </div>
              )}

              {/* Direct Immediate Actions */}
              <div className="space-y-2.5">
                <a
                  href={`https://wa.me/919820000000?text=${encodeURIComponent(
                    `Hello EstateWise team, I just requested the ${config.assetName} for Prestige Thane. Please share the details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { intent: leadIntent })}
                  className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Connect</span>
                </a>

                <a
                  href="tel:+919820000000"
                  onClick={() => trackEvent('call_click', { intent: leadIntent })}
                  className="w-full h-12 rounded-xl bg-white border border-[#18181A]/20 hover:bg-[#F4EFEB] text-[#18181A] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#A07F55]" />
                  <span>Speak With EstateWise Advisor Now</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-center text-xs text-[#18181A]/60 hover:text-[#18181A] transition-colors"
                >
                  Done & Return to Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
