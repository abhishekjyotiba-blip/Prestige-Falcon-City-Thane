import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Phone, MessageSquare, ArrowRight, ShieldCheck, Lock, Unlock, Sparkles } from 'lucide-react';
import { LeadIntent, LeadSubmission } from '../types';
import { saveLead, updateLeadSecondary, trackEvent } from '../utils/analytics';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadIntent: LeadIntent | string;
  sourceSection?: string;
  leadConfiguration?: string;
}

interface IntentDetails {
  title: string;
  subtitle: string;
  perks: string[];
  ctaText: string;
  assetName: string;
}

const INTENT_CONFIG: Record<string, IntentDetails> = {
  launch_kit: {
    title: 'Unlock the Prestige Thane Launch Kit',
    subtitle: 'Confidential buyer package delivered securely to your mobile via WhatsApp & PDF.',
    perks: [
      'Indicative Cost Sheet & Estimated All-In Outlays',
      '2, 3 & 4 BHK Configuration Comparison',
      'Kolshet–Balkum Infrastructure & Location Report',
      'Priority MahaRERA & Official Launch Alerts',
    ],
    ctaText: 'UNLOCK MY LAUNCH KIT →',
    assetName: 'Private Launch Kit',
  },
  buyer_pack: {
    title: 'Unlock the Prestige Thane Buyer Pack',
    subtitle: 'Complimentary 6-part advisory research package prepared by the EstateWise Buyer Desk.',
    perks: [
      'Cost Sheet Breakdown (Base + Stamp Duty + GST)',
      'Sanctioned Floor Plans & Carpet Dimensions (On Release)',
      '14.6-Acre Master Site Plan & Tower Clusters',
      'Metro Lines 4 & 5 Infrastructure Timelines',
    ],
    ctaText: 'UNLOCK THE FULL PACK →',
    assetName: 'EstateWise Buyer Pack',
  },
  cost_sheet: {
    title: 'Unlock Complete Cost Breakdown',
    subtitle: 'See base rate, floor rise, 6% stamp duty, 5% GST and estimated all-in outlays.',
    perks: [
      'Itemized Component Estimates (Base + Taxes + Levies)',
      'Estimated Unit-Wise Payment Milestones',
      'Phase-Wise Commercial Disclosures',
    ],
    ctaText: 'UNLOCK COST SHEET →',
    assetName: 'Detailed Cost Sheet',
  },
  floor_plan: {
    title: 'Unlock Floor Plans & Layout Updates',
    subtitle: 'Receive verified room measurements, carpet areas, and balcony deck orientations.',
    perks: [
      'Instant Alert When Official Sanctioned Plans Release',
      'Usable Carpet vs. Balcony Dimensions',
      'Directional Sunlight & Vastu Orientation Insights',
    ],
    ctaText: 'NOTIFY ME + SEND FLOOR PLANS →',
    assetName: 'Floor Plan Dossier',
  },
  location_report: {
    title: 'Unlock Location Intelligence Report',
    subtitle: 'Detailed analysis of the Kolshet–Balkum corridor, Metro 4 & 5 timelines, and social infrastructure.',
    perks: [
      'Metro Line 4 & Line 5 Transit Impact Map',
      'Social Directory (Top Schools, Hospitals & Viviana Mall)',
      'Bypass Roads & Thane–Borivali Link Impact',
    ],
    ctaText: 'SEND ME THE LOCATION REPORT →',
    assetName: 'Location Intelligence Report',
  },
  project_updates: {
    title: 'Get Official Project Release Alerts',
    subtitle: 'No sales pressure. Receive only crucial project milestone alerts directly to your mobile.',
    perks: [
      'Official Price Sheet Announcement',
      'MahaRERA Registration Number & Sanction Documents',
      'Floor Plan & Tower Release Dates',
    ],
    ctaText: 'KEEP ME UPDATED →',
    assetName: 'Project Release Alerts',
  },
  site_visit: {
    title: 'Arrange Private Project Consultation',
    subtitle: 'Connect with an EstateWise senior advisor for unbiased advisory and site access guidance.',
    perks: [
      '1-on-1 Confidential Advisory Consultation',
      'Actual Road Access & Landmark Orientation',
      'Objective Comparison vs. Neighboring Kolshet Launches',
    ],
    ctaText: 'SCHEDULE CONSULTATION →',
    assetName: 'Private Consultation Booking',
  },
  callback: {
    title: 'Request an Advisor Callback',
    subtitle: 'Speak with a dedicated senior property advisor regarding Prestige Thane.',
    perks: [
      'Direct Senior Advisor Discussion',
      'Latest Public Disclosures & Filing Facts',
      'Unbiased Advice with No Pressure',
    ],
    ctaText: 'REQUEST ADVISOR CALL →',
    assetName: 'Advisor Callback',
  },
  advisor_call: {
    title: 'Speak with an EstateWise Advisor',
    subtitle: 'Confidential buyer guidance for evaluating pricing, configurations, and inventory.',
    perks: [
      'Independent Buyer Desk Consultation',
      'Clear Fee-Free Guidance',
      'Comprehensive Micro-Market Analysis',
    ],
    ctaText: 'CONNECT WITH ADVISOR →',
    assetName: 'Advisor Consultation',
  },
  rera_update: {
    title: 'MahaRERA & Launch Schedule Alerts',
    subtitle: 'Instant alert the moment statutory MahaRERA sanctions are granted.',
    perks: [
      'Registered RERA Number & Sanction PDF',
      'Tower-Wise Approvals & Phase Schedule',
      'Priority Pre-Booking Window Updates',
    ],
    ctaText: 'ALERT ME ON RERA APPROVAL →',
    assetName: 'RERA Alert Registration',
  },
};

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  leadIntent,
  sourceSection,
  leadConfiguration,
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<LeadSubmission | null>(null);

  // Step 2 state (optional, non-blocking)
  const [configuration, setConfiguration] = useState(leadConfiguration || '');
  const [timeframe, setTimeframe] = useState('');
  const [secondarySaved, setSecondarySaved] = useState(false);

  // Dynamic configuration title if intent relates to a specific BHK
  const getDynamicConfig = (): IntentDetails => {
    if (leadIntent === '2bhk') {
      return {
        title: 'Unlock 2 BHK Pricing & Updates',
        subtitle: 'Indicative pricing from ₹1.60 Cr*, layout blueprints, and all-in cost worksheet.',
        perks: [
          '2 BHK Indicative Cost Sheet & Estimated All-In Outlay',
          'Sanctioned Carpet Area (Approx. 720–790 Sq.Ft.*)',
          'Immediate Notification Upon Floor Plan Sanctions',
        ],
        ctaText: 'GET 2 BED DETAILS →',
        assetName: '2 BHK Dossier',
      };
    }
    if (leadIntent === '3bhk') {
      return {
        title: 'Unlock 3 BHK Pricing & Updates',
        subtitle: 'Indicative pricing from ₹2.40 Cr*, dual-balcony blueprints, and cost worksheet.',
        perks: [
          '3 BHK Indicative Cost Sheet & Estimated Outlay',
          'Sanctioned Carpet Area (Approx. 1,050–1,180 Sq.Ft.*)',
          'High-Floor Vantage & Tower Cluster Details',
        ],
        ctaText: 'GET 3 BED DETAILS →',
        assetName: '3 BHK Dossier',
      };
    }
    if (leadIntent === '4bhk') {
      return {
        title: 'Unlock 4 BHK Signature Pricing',
        subtitle: 'Indicative pricing from ₹3.60 Cr*, palatial sky deck layouts, and VIP release updates.',
        perks: [
          '4 BHK Indicative Cost Sheet & Payment Milestones',
          'Signature Carpet Area (Approx. 1,550–1,750 Sq.Ft.*)',
          'Exclusive Tower Positioning & Priority Access',
        ],
        ctaText: 'GET 4 BED DETAILS →',
        assetName: '4 BHK Signature Dossier',
      };
    }
    return INTENT_CONFIG[leadIntent] || INTENT_CONFIG.buyer_pack;
  };

  const config = getDynamicConfig();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError('');
      if (leadConfiguration) {
        setConfiguration(leadConfiguration);
      }
      trackEvent('form_open', {
        intent: leadIntent,
        source: sourceSection,
        configuration: leadConfiguration,
      });
    } else {
      document.body.style.overflow = '';
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
  }, [isOpen, leadIntent, sourceSection, leadConfiguration]);

  if (!isOpen) return null;

  const validateMobile = (num: string) => {
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
      configuration: leadConfiguration,
    });

    try {
      const saved = saveLead({
        name: name.trim(),
        mobile: cleanMobile,
        leadIntent,
        sourceSection,
        leadConfiguration: leadConfiguration || configuration,
        project: 'Prestige Thane',
      });

      setSubmittedLead(saved);
      setIsSubmitting(false);
      trackEvent('qualification_step', { step: 1, completed: true });
    } catch {
      setError('Something went wrong. Please tap Call or WhatsApp directly.');
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
        className="w-full md:max-w-lg bg-[#FAF8F4] text-[#161616] rounded-t-3xl md:rounded-2xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col border border-[#161616]/10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Indicator */}
        <div className="md:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1 bg-[#161616]/20 rounded-full" />
        </div>

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-[#161616]/8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B59A68] animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-[#B59A68] font-bold">
              ESTATEWISE PRIVATE ACCESS
            </span>
            <span className="text-[#161616]/25">·</span>
            <span className="text-[11px] text-[#66625C]">Prestige Thane</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-[#161616]/60 hover:text-[#161616] hover:bg-[#161616]/5 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-7">
          {!submittedLead ? (
            /* STEP 1: Fast, High-Curiosity Unlock Form (Name + Mobile only) */
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#B59A68]">
                <Lock className="w-3.5 h-3.5" />
                <span>CONFIDENTIAL BUYER RESOURCE</span>
              </div>

              <h2
                id="lead-modal-title"
                className="font-serif text-2xl md:text-3xl leading-tight text-[#161616] mb-2 font-normal"
              >
                {config.title}
              </h2>
              <p className="text-xs md:text-sm text-[#66625C] leading-relaxed mb-5">
                {config.subtitle}
              </p>

              {/* What you receive checkmarks */}
              <div className="bg-[#EFE9DE] p-4 rounded-xl mb-5 space-y-2 border border-[#161616]/6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#967E51] block mb-1">
                  What you unlock immediately:
                </span>
                {config.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#161616]/90">
                    <span className="text-[#B59A68] font-bold mt-0.5">✓</span>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="lead-name" className="block text-[11px] font-semibold text-[#161616]/80 mb-1 uppercase tracking-wider">
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
                    className="w-full h-12 px-4 rounded-xl bg-white border border-[#161616]/15 text-[#161616] placeholder:text-[#161616]/35 text-base focus:outline-none focus:ring-2 focus:ring-[#B59A68] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="lead-mobile" className="block text-[11px] font-semibold text-[#161616]/80 mb-1 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="flex rounded-xl bg-white border border-[#161616]/15 focus-within:ring-2 focus-within:ring-[#B59A68] focus-within:border-transparent transition-all overflow-hidden">
                    <span className="inline-flex items-center px-3.5 text-sm font-semibold text-[#161616]/70 bg-[#EFE9DE] border-r border-[#161616]/10 select-none">
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
                        if (val.length === 10) {
                          trackEvent('mobile_entered');
                        }
                      }}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      inputMode="numeric"
                      className="w-full h-12 px-3.5 text-[#161616] placeholder:text-[#161616]/35 text-base focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 mt-2 rounded-xl bg-gradient-to-r from-[#B59A68] to-[#967E51] hover:brightness-105 text-[#161616] font-bold text-xs tracking-widest uppercase transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="inline-block animate-pulse">Unlocking your package...</span>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>{config.ctaText}</span>
                    </>
                  )}
                </button>

                {/* Trust Markers */}
                <div className="pt-2 border-t border-[#161616]/6 space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#66625C]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B59A68] shrink-0" />
                    <span>Free project information. Takes less than 20 seconds. No spam.</span>
                  </div>
                  <div className="text-[10px] text-[#161616]/40">
                    EstateWise Buyer Desk · Project-focused assistance · No payment required
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* STEP 2: Instant Success + Optional 1-Tap Qualification */
            <div className="py-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl md:text-2xl text-[#161616]">
                    Your Access Request Is Confirmed
                  </h3>
                  <span className="text-xs text-[#66625C]">Prestige Thane Priority Desk</span>
                </div>
              </div>

              <p className="text-xs md:text-sm text-[#66625C] leading-relaxed mb-5 bg-[#EFE9DE] p-3.5 rounded-xl border border-[#161616]/6">
                Thank you, <strong>{name}</strong>. Our advisory team will dispatch the unblurred{' '}
                <strong>{config.assetName}</strong> directly via WhatsApp and phone shortly.
              </p>

              {/* Optional qualification (non-blocking) */}
              {!secondarySaved ? (
                <div className="mb-6 p-4 rounded-xl bg-white border border-[#161616]/10 space-y-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#B59A68] block">
                    Optional: Tailor your buyer pack (1 tap)
                  </span>

                  <div>
                    <label className="text-xs text-[#161616]/70 mb-2 block font-medium">
                      What are you considering?
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
                              ? 'bg-[#161616] text-white border-[#161616]'
                              : 'bg-[#F5F1E9] text-[#161616]/80 border-[#161616]/15 hover:border-[#161616]/40'
                          }`}
                        >
                          {cfg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs text-[#161616]/70 mb-2 block font-medium">
                      When are you planning to buy?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['0–3 Months', '3–6 Months', '6–12 Months', 'Researching'].map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => {
                            setTimeframe(tf);
                            handleSecondarySubmit(configuration, tf);
                          }}
                          className={`py-2 px-2 text-xs rounded-lg border text-center transition-all ${
                            timeframe === tf
                              ? 'bg-[#161616] text-white border-[#161616]'
                              : 'bg-[#F5F1E9] text-[#161616]/80 border-[#161616]/15 hover:border-[#161616]/40'
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
                  <span>Preferences saved. We will customize your dossier accordingly.</span>
                </div>
              )}

              {/* Immediate Fast Actions */}
              <div className="space-y-2">
                <a
                  href={`https://wa.me/919820000000?text=${encodeURIComponent(
                    `Hello EstateWise, I just unlocked the ${config.assetName} for Prestige Thane. Please share the documents directly.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { intent: leadIntent })}
                  className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Connect</span>
                </a>

                <a
                  href="tel:+919820000000"
                  onClick={() => trackEvent('call_click', { intent: leadIntent })}
                  className="w-full h-12 rounded-xl bg-white border border-[#161616]/20 hover:bg-[#EFE9DE] text-[#161616] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#B59A68]" />
                  <span>Speak With EstateWise Advisor</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-center text-xs text-[#161616]/60 hover:text-[#161616] transition-colors"
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
