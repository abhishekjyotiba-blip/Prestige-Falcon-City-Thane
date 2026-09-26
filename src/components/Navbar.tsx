import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Download, Phone } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { LeadIntent } from '../types';

interface NavbarProps {
  onOpenModal: (intent: LeadIntent | string, section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Buyer Pack', href: '#buyer-pack-preview' },
    { label: 'Cost Sheet', href: '#cost-sheet' },
    { label: 'Residences', href: '#residences' },
    { label: 'Floor Plans', href: '#floor-plans' },
    { label: 'Location', href: '#location' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#161616]/10 shadow-xs py-2.5'
          : 'bg-[#F5F1E9]/90 backdrop-blur-sm border-b border-[#161616]/5 py-3'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#overview"
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => trackEvent('form_start', { action: 'logo_click' })}
        >
          <span className="font-serif text-xl sm:text-2xl tracking-tight text-[#161616]">
            Estate<span className="italic font-light text-[#B59A68]">Wise</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase text-[#66625C] font-semibold">
            Private Buyer Desk
          </span>
        </a>

        {/* Minimal Nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wide uppercase text-[#66625C]">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-[#161616] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA & Mobile Trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              trackEvent('hero_cta_click', { button: 'nav_launch_kit' });
              onOpenModal('buyer_pack', 'nav_header');
            }}
            className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#B59A68] to-[#967E51] text-[#161616] font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get Buyer Pack</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#161616] hover:bg-[#161616]/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F4] text-[#161616] border-b border-[#161616]/10 px-5 py-4 space-y-2.5 shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-[#967E51] font-bold mb-1">
            Prestige Thane Directory
          </div>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-[#161616]/80 hover:text-[#B59A68] border-b border-[#161616]/5"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('buyer_pack', 'mobile_menu');
              }}
              className="w-full py-3 rounded-xl bg-[#161616] text-white text-xs font-bold uppercase tracking-wider text-center"
            >
              Unlock Prestige Thane Buyer Pack
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
