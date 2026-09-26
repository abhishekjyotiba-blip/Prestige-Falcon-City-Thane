import React, { useState } from 'react';
import { ChevronDown, Shield, Mail, Phone, MapPin } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  const [legalExpanded, setLegalExpanded] = useState(false);

  return (
    <footer className="bg-[#121212] text-[#88888D] pt-10 pb-22 md:pb-12 border-t border-white/8 text-xs font-light">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Top Wordmark & Advisory Notice */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/8 gap-4">
          <div>
            <div className="font-serif text-xl sm:text-2xl text-white tracking-tight">
              Estate<span className="italic text-[#B59A68]">Wise</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#B59A68] mt-0.5">
              Private Real Estate Advisory & Research Desk
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
            <a href="mailto:admin@estatewise.in" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#B59A68]" />
              <span>admin@estatewise.in</span>
            </a>
            <a href="tel:+919820000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#B59A68]" />
              <span>+91 98200 00000</span>
            </a>
          </div>
        </div>

        {/* Disclaimer Strip */}
        <div className="py-5 border-b border-white/8 space-y-2">
          <div className="flex items-start gap-2 text-[11px] leading-relaxed text-white/50">
            <Shield className="w-4 h-4 text-[#B59A68] shrink-0 mt-0.5" />
            <div>
              <p>
                <strong>Advisory Disclaimer:</strong> EstateWise is an independent real-estate advisory and research consultancy. This landing page is a promotional research portal for the proposed development by Prestige Estates Projects Ltd near Kolshet–Balkum Road, Thane. Indicative pricing, floor plans, and amenities are compiled from publicly available developer announcements, press releases, and market benchmarking. This does not constitute an official developer quotation or an invitation to offer.
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setLegalExpanded(!legalExpanded)}
              className="text-[11px] text-[#B59A68] hover:text-[#F3ECE0] flex items-center gap-1 cursor-pointer underline underline-offset-4"
            >
              <span>{legalExpanded ? 'Collapse regulatory details' : 'Read full MahaRERA compliance & advisory terms'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${legalExpanded ? 'rotate-180' : ''}`} />
            </button>

            {legalExpanded && (
              <div className="mt-3 p-4 rounded-xl bg-white/5 text-[10px] sm:text-[11px] leading-relaxed text-white/50 space-y-1.5 border border-white/5 animate-fade-in">
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

        {/* Minimal Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/40 gap-2">
          <div>
            © {new Date().getFullYear()} EstateWise India. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Advisory</span>
            <span>·</span>
            <span>MahaRERA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
