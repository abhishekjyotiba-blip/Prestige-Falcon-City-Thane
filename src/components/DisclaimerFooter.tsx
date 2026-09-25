import React, { useState } from 'react';
import { ChevronDown, Shield, Mail, Phone, MapPin } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  const [legalExpanded, setLegalExpanded] = useState(false);

  return (
    <footer className="bg-[#0D0D0E] text-[#88888D] pt-12 pb-24 md:pb-14 border-t border-white/8 text-xs font-light">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Top Wordmark & Advisory Notice */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-white/8 gap-6">
          <div>
            <div className="font-serif text-2xl text-white tracking-tight">
              Estate<span className="italic text-[#C5A880]">Wise</span>
            </div>
            <div className="text-[11px] uppercase tracking-widest text-[#C5A880]/80 mt-1">
              Private Real Estate Advisory & Research
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-white/60">
            <a href="mailto:admin@estatewise.in" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>admin@estatewise.in</span>
            </a>
            <a href="tel:+919820000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>+91 98200 00000</span>
            </a>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Thane & MMR Advisory Desk</span>
            </div>
          </div>
        </div>

        {/* Concise Disclaimer Strip with Expandable Legal Disclosure */}
        <div className="py-6 border-b border-white/8 space-y-3">
          <div className="flex items-start gap-2.5 text-[11px] leading-relaxed text-white/50">
            <Shield className="w-4 h-4 text-[#C5A880]/80 shrink-0 mt-0.5" />
            <div>
              <p>
                <strong>Advisory Disclaimer:</strong> EstateWise is an independent real-estate advisory and research consultancy. This landing page is a promotional research portal for the proposed development by Prestige Estates Projects Ltd near Kolshet–Balkum Road, Thane. Indicative pricing, floor plans, and amenities are compiled from publicly available developer announcements, press releases, and market benchmarking. This does not constitute an official developer quotation or an invitation to offer.
              </p>
            </div>
          </div>

          {/* Expandable Full Legal Notes */}
          <div>
            <button
              onClick={() => setLegalExpanded(!legalExpanded)}
              className="text-[11px] text-[#C5A880] hover:text-[#e8dfc9] flex items-center gap-1 cursor-pointer underline underline-offset-4"
            >
              <span>{legalExpanded ? 'Collapse regulatory details' : 'Read full MahaRERA compliance & advisory terms'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${legalExpanded ? 'rotate-180' : ''}`} />
            </button>

            {legalExpanded && (
              <div className="mt-3 p-4 rounded-xl bg-white/5 text-[11px] leading-relaxed text-white/50 space-y-2 border border-white/5 animate-fade-in">
                <p>
                  1. <strong>MahaRERA Registration:</strong> MahaRERA registration for the Thane project is currently awaited / in process. Official sales, commercial agreements, and bookings will only be initiated following receipt of the valid MahaRERA registration number.
                </p>
                <p>
                  2. <strong>Indicative Pricing & Floor Plans:</strong> Indicative pricing figures (from ₹1.60 Cr* for 2 Bed) represent preliminary market guidance only. The developer reserves the right to alter carpet areas, layouts, specifications, and commercial rates without prior intimation.
                </p>
                <p>
                  3. <strong>Visual Representation:</strong> Architectural renders and contextual images are conceptual and representative visualizations meant solely for aesthetic illustration. They do not constitute sanctioned construction commitments.
                </p>
                <p>
                  4. <strong>Independent Due Diligence:</strong> Prospective buyers are strictly advised to conduct their own legal and financial due diligence and review the official MahaRERA disclosure documents prior to entering into any binding purchase agreement.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Minimal Copyright and Non-Distracting Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <div>
            © {new Date().getFullYear()} EstateWise India. All rights reserved. Built for private marketing & lead generation.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white/70 transition-colors cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white/70 transition-colors cursor-pointer">Terms of Advisory</span>
            <span>·</span>
            <span className="hover:text-white/70 transition-colors cursor-pointer">RERA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
