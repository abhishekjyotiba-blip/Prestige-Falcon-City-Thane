import React, { useState, useEffect } from 'react';
import { LeadIntent } from './types';
import { getUrlParams, trackEvent, getAttributionData } from './utils/analytics';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ScaleSection } from './components/ScaleSection';
import { BlurredVaultTeaser } from './components/BlurredVaultTeaser';
import { MasterPlanSection } from './components/MasterPlanSection';
import { ResidencesSection } from './components/ResidencesSection';
import { CostSheetSection } from './components/CostSheetSection';
import { FloorPlanSection } from './components/FloorPlanSection';
import { LocationSection } from './components/LocationSection';
import { InfrastructureSection } from './components/InfrastructureSection';
import { PrestigeSection } from './components/PrestigeSection';
import { IntegratedDevelopmentSection } from './components/IntegratedDevelopmentSection';
import { AmenitiesTeaserSection } from './components/AmenitiesTeaserSection';
import { BuyerAdvantageSection } from './components/BuyerAdvantageSection';
import { TransparencySection } from './components/TransparencySection';
import { SiteVisitSection } from './components/SiteVisitSection';
import { FaqSection } from './components/FaqSection';
import { FinalConversionSection } from './components/FinalConversionSection';
import { DisclaimerFooter } from './components/DisclaimerFooter';
import { StickyMobileBar } from './components/StickyMobileBar';
import { ExitIntentNotice } from './components/ExitIntentNotice';
import { LeadModal } from './components/LeadModal';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [leadIntent, setLeadIntent] = useState<LeadIntent>('launch_kit');
  const [sourceSection, setSourceSection] = useState('hero_main');
  const [personalizedTerm, setPersonalizedTerm] = useState<string | undefined>(undefined);

  useEffect(() => {
    // 1. Initialize PPC Attribution & read search keywords
    const attribution = getAttributionData();
    const params = getUrlParams();
    const term = params['utm_term'] || params['keyword'] || attribution.utmTerm;
    if (term) {
      setPersonalizedTerm(term);
    }

    // 2. Set up scroll depth tracking (50%, 75%, 90%)
    let tracked50 = false;
    let tracked75 = false;
    let tracked90 = false;

    const handleScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      const percent = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;

      if (!tracked50 && percent >= 50) {
        tracked50 = true;
        trackEvent('50_percent_scroll');
      }
      if (!tracked75 && percent >= 75) {
        tracked75 = true;
        trackEvent('75_percent_scroll');
      }
      if (!tracked90 && percent >= 90) {
        tracked90 = true;
        trackEvent('90_percent_scroll');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenModal = (intent: LeadIntent, section: string) => {
    setLeadIntent(intent);
    setSourceSection(section);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181A] selection:bg-[#E8DFC9] selection:text-[#18181A] relative">
      {/* Minimal PPC Floating Header */}
      <Navbar onOpenModal={handleOpenModal} />

      <main>
        {/* Hero Section (Section 1) */}
        <HeroSection
          onOpenModal={handleOpenModal}
          personalizedTerm={personalizedTerm}
        />

        {/* The Restricted Blurred Vault Teaser (High Temptation) */}
        <BlurredVaultTeaser onOpenModal={handleOpenModal} />

        {/* The Scale (Section 2) */}
        <ScaleSection />

        {/* Master Plan & Zoning (Visual Interactive Map) */}
        <MasterPlanSection onOpenModal={handleOpenModal} />

        {/* The Residences (Section 3) */}
        <ResidencesSection onOpenModal={handleOpenModal} />

        {/* Cost Sheet Conversion Moment (Section 4) */}
        <CostSheetSection onOpenModal={handleOpenModal} />

        {/* Floor Plan Curiosity (Section 5) */}
        <FloorPlanSection onOpenModal={handleOpenModal} />

        {/* Location Story (Section 6) */}
        <LocationSection onOpenModal={handleOpenModal} />

        {/* Infrastructure / Future Thane (Section 7) */}
        <InfrastructureSection onOpenModal={handleOpenModal} />

        {/* Prestige Developer (Section 8) */}
        <PrestigeSection />

        {/* Integrated Development (Section 9) */}
        <IntegratedDevelopmentSection />

        {/* Amenities Teaser (Section 10) */}
        <AmenitiesTeaserSection onOpenModal={handleOpenModal} />

        {/* The EstateWise Buyer Advantage (Section 11) */}
        <BuyerAdvantageSection onOpenModal={handleOpenModal} />

        {/* Information Transparency (Section 12) */}
        <TransparencySection />

        {/* High-Intent Site Visit CTA (Section 13) */}
        <SiteVisitSection onOpenModal={handleOpenModal} />

        {/* High-Intent FAQ (Section 14) */}
        <FaqSection />

        {/* Final Conversion Section (Section 15) */}
        <FinalConversionSection onOpenModal={handleOpenModal} />
      </main>

      {/* Minimalist Advisory Disclaimer & Footer */}
      <DisclaimerFooter />

      {/* Mobile Sticky Conversion Bar */}
      <StickyMobileBar
        onOpenModal={handleOpenModal}
        personalizedTerm={personalizedTerm}
      />

      {/* Exit Intent & Non-Blocking Scroll Depth Card */}
      <ExitIntentNotice onOpenModal={handleOpenModal} />

      {/* The Dynamic Lead Capture Bottom Sheet (Mobile) & Modal (Desktop) */}
      <LeadModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        leadIntent={leadIntent}
        sourceSection={sourceSection}
      />
    </div>
  );
}
