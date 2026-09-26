import React, { useState, useEffect } from 'react';
import { LeadIntent } from './types';
import { getUrlParams, trackEvent, getAttributionData } from './utils/analytics';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VisualBuyerPackMockupSection } from './components/VisualBuyerPackMockupSection';
import { WhatYouGetSection } from './components/WhatYouGetSection';
import { ScaleSection } from './components/ScaleSection';
import { PriceRevealSection } from './components/PriceRevealSection';
import { ConfigurationSelectorSection } from './components/ConfigurationSelectorSection';
import { FloorPlanCuriositySection } from './components/FloorPlanCuriositySection';
import { LocationSection } from './components/LocationSection';
import { WhyOnTheRadarSection } from './components/WhyOnTheRadarSection';
import { BeforeYouBuySection } from './components/BeforeYouBuySection';
import { ProjectStatusSection } from './components/ProjectStatusSection';
import { ProjectUpdateAccessSection } from './components/ProjectUpdateAccessSection';
import { FaqSection } from './components/FaqSection';
import { FinalConversionSection } from './components/FinalConversionSection';
import { DisclaimerFooter } from './components/DisclaimerFooter';
import { StickyMobileBar } from './components/StickyMobileBar';
import { ExitIntentNotice } from './components/ExitIntentNotice';
import { LeadModal } from './components/LeadModal';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [leadIntent, setLeadIntent] = useState<LeadIntent | string>('launch_kit');
  const [sourceSection, setSourceSection] = useState('hero_main');
  const [leadConfiguration, setLeadConfiguration] = useState<string | undefined>(undefined);
  const [personalizedTerm, setPersonalizedTerm] = useState<string | undefined>(undefined);

  useEffect(() => {
    // 1. Initialize PPC Attribution & read search keywords
    const attribution = getAttributionData();
    const params = getUrlParams();
    const term = params['utm_term'] || params['keyword'] || attribution.utmTerm;
    if (term) {
      setPersonalizedTerm(term);
    }

    // 2. Set up scroll depth tracking (25%, 50%, 75%, 90%)
    let tracked25 = false;
    let tracked50 = false;
    let tracked75 = false;
    let tracked90 = false;

    const handleScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      const percent = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;

      if (!tracked25 && percent >= 25) {
        tracked25 = true;
        trackEvent('scroll_25');
      }
      if (!tracked50 && percent >= 50) {
        tracked50 = true;
        trackEvent('scroll_50');
      }
      if (!tracked75 && percent >= 75) {
        tracked75 = true;
        trackEvent('scroll_75');
      }
      if (!tracked90 && percent >= 90) {
        tracked90 = true;
        trackEvent('scroll_90');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenModal = (intent: LeadIntent | string, section: string, config?: string) => {
    setLeadIntent(intent);
    setSourceSection(section);
    setLeadConfiguration(config);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E9] text-[#161616] selection:bg-[#EFE9DE] selection:text-[#161616] relative">
      {/* Minimal Floating PPC Header */}
      <Navbar onOpenModal={handleOpenModal} />

      <main>
        {/* Screen 1: Reworked Hero with Direct Value Box & ₹1.60 Cr* hook */}
        <HeroSection
          onOpenModal={handleOpenModal}
          personalizedTerm={personalizedTerm}
        />

        {/* Screen 2: Tangible Visual Document Proof (Buyer Pack Mockups) */}
        <div id="buyer-pack-preview">
          <VisualBuyerPackMockupSection onOpenModal={handleOpenModal} />
        </div>

        {/* Screen 3: "Everything you need before you speak to sales" 6-item grid */}
        <WhatYouGetSection onOpenModal={handleOpenModal} />

        {/* Screen 4: Dense 2x2 Project Scale Section (14.6 Acres, 5M+ Sq.Ft., ₹6,000 Cr, Prestige Group) */}
        <ScaleSection onOpenModal={handleOpenModal} />

        {/* Screen 5: Price Reveal Component with Partially Obscured Cost Worksheet */}
        <PriceRevealSection onOpenModal={handleOpenModal} />

        {/* Screen 6: Interactive Configuration Selector (2 Bed, 3 Bed, 4 Bed) */}
        <ConfigurationSelectorSection onOpenModal={handleOpenModal} />

        {/* Screen 7: Architectural Floor Plan Curiosity Section with 3 locked tiles */}
        <FloorPlanCuriositySection onOpenModal={handleOpenModal} />

        {/* Screen 8: Location Section with Map Visual & Locked Location Intelligence Report */}
        <LocationSection onOpenModal={handleOpenModal} />

        {/* Screen 9: "Why this launch is on the radar" compact editorial reasons */}
        <WhyOnTheRadarSection onOpenModal={handleOpenModal} />

        {/* Screen 10: "Before you buy, know more" Strategic Dark Contrast Section (EstateWise advantage) */}
        <BeforeYouBuySection onOpenModal={handleOpenModal} />

        {/* Screen 11: Project Status Component (Confirmed, Indicative, Awaited) */}
        <ProjectStatusSection onOpenModal={handleOpenModal} />

        {/* Screen 12: Low-Pressure "Don't want a sales call yet?" Project Update Access */}
        <ProjectUpdateAccessSection onOpenModal={handleOpenModal} />

        {/* Screen 13: High-Intent FAQ */}
        <FaqSection />

        {/* Screen 14: Final Conversion Section ("You've seen the overview. Now get the numbers.") */}
        <FinalConversionSection onOpenModal={handleOpenModal} />
      </main>

      {/* Advisory Disclaimer & Minimal Footer */}
      <DisclaimerFooter />

      {/* Dynamic Sticky Mobile Bottom Conversion Bar */}
      <StickyMobileBar
        onOpenModal={handleOpenModal}
        personalizedTerm={personalizedTerm}
      />

      {/* Small Floating Value Reminder (~35% scroll depth) & Desktop Exit Intent */}
      <ExitIntentNotice onOpenModal={handleOpenModal} />

      {/* The Unlock Experience Lead Capture Bottom Sheet & Modal */}
      <LeadModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        leadIntent={leadIntent}
        sourceSection={sourceSection}
        leadConfiguration={leadConfiguration}
      />
    </div>
  );
}
