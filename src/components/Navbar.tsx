import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { LeadIntent } from '../types';

interface NavbarProps {
  onOpenModal: (intent: LeadIntent, section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Master Plan', href: '#master-plan' },
    { label: 'Floor Plans', href: '#floor-plans' },
    { label: 'Cost Sheet', href: '#cost-sheet' },
    { label: 'Location', href: '#location' },
    { label: 'Buyer Pack', href: '#buyer-pack' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#18181A]/8 shadow-xs py-3'
          : 'bg-gradient-to-b from-black/60 via-black/25 to-transparent text-white py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Zone 1: EstateWise Wordmark */}
        <a
          href="#overview"
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => trackEvent('form_start', { action: 'logo_click' })}
        >
          <span
            className={`font-serif text-xl md:text-2xl tracking-tight transition-colors ${
              isScrolled ? 'text-[#18181A]' : 'text-white'
            }`}
          >
            Estate<span className="italic font-light text-[#A07F55]">Wise</span>
          </span>
          <span
            className={`hidden sm:inline-block text-[11px] tracking-widest uppercase transition-colors ${
              isScrolled ? 'text-[#18181A]/40' : 'text-white/60'
            }`}
          >
            Private Advisory
          </span>
        </a>

        {/* Zone 2: Minimal single-line nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide uppercase">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`transition-colors hover:text-[#A07F55] ${
                isScrolled ? 'text-[#18181A]/75' : 'text-white/80'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              trackEvent('hero_cta_click', { button: 'nav_launch_kit' });
              onOpenModal('launch_kit', 'nav_header');
            }}
            className={`h-9 md:h-10 px-4 md:px-5 rounded-lg text-xs font-medium tracking-wider uppercase transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap ${
              isScrolled
                ? 'bg-[#18181A] text-white hover:bg-[#28282B]'
                : 'bg-white/95 text-[#18181A] hover:bg-white backdrop-blur-xs'
            }`}
          >
            Get Launch Kit
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className={`lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isScrolled ? 'text-[#18181A] hover:bg-[#18181A]/5' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Only project anchor links, no distracting exit links) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] text-[#18181A] border-b border-[#18181A]/10 px-5 py-4 space-y-3 shadow-lg">
          <div className="text-[11px] uppercase tracking-wider text-[#A07F55] font-semibold mb-2">
            Prestige Thane Directory
          </div>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#18181A]/85 hover:text-[#A07F55] border-b border-[#18181A]/5"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('launch_kit', 'mobile_menu');
              }}
              className="w-full py-3 rounded-xl bg-[#18181A] text-white text-xs font-medium uppercase tracking-wider text-center"
            >
              Download Full Launch Kit
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
