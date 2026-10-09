import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  LockKeyhole,
  Menu,
  X,
} from "lucide-react";
import { LocationExperience } from "./components/LocationExperience";
import { AmenitiesOverview } from "./components/AmenitiesOverview";
import { AmenitiesSlideshow } from "./components/AmenitiesSlideshow";
import { BrandMark } from "./components/BrandMark";
import { PreviewArt } from "./components/PreviewArt";
import { ProjectPlans } from "./components/ProjectPlans";
import { CampaignFooter } from "./components/CampaignFooter";
import { ProjectGallery } from "./components/ProjectGallery";
import { ProjectUpdates } from "./components/ProjectUpdates";
import { APPROVED_PROJECT_MAP } from "./data/projectLocation";
import heroImage from "./assets/images/temporary-illustrative-exterior.jpg";
import "./landing.css";
import { trackCampaignEvent } from "./utils/campaignAnalytics";
import { type EnquiryKind } from "./utils/enquiryPreview";
import { EnquiryDialog } from "./components/EnquiryDialog";
import { InlineEnquiryForm } from "./components/InlineEnquiryForm";

type Intent = EnquiryKind;
type Card = {
  intent: Intent;
  title: string;
  eyebrow: string;
  action: string;
  visual: "cost" | "master" | "floor" | "video";
};
const cards: Card[] = [
  {
    intent: "price",
    title: "Pricing & cost sheet",
    eyebrow: "THE NUMBERS",
    action: "Request price update",
    visual: "cost",
  },
  {
    intent: "master_plan",
    title: "Master plan",
    eyebrow: "THE BIG PICTURE",
    action: "Request master plan",
    visual: "master",
  },
  {
    intent: "floor_plan",
    title: "Floor plans",
    eyebrow: "THE RESIDENCES",
    action: "Request floor plans",
    visual: "floor",
  },
  {
    intent: "video",
    title: "Project film",
    eyebrow: "THE EXPERIENCE",
    action: "Request video update",
    visual: "video",
  },
];
export default function App() {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [sourceSection, setSourceSection] = useState("hero");
  const [showSticky, setShowSticky] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [registrationVisible, setRegistrationVisible] = useState(false);
  const [inlineFocused, setInlineFocused] = useState<
    "hero_registration" | "final_site_visit" | null
  >(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const registrationRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const scrollMilestones = useRef(new Set<number>());
  useEffect(() => {
    const onScroll = () => {
      const available =
        document.documentElement.scrollHeight - window.innerHeight;
      if (available <= 0) return;
      const percent = (window.scrollY / available) * 100;
      for (const depth of [25, 50, 75, 90]) {
        if (percent >= depth && !scrollMilestones.current.has(depth)) {
          scrollMilestones.current.add(depth);
          trackCampaignEvent("scroll_depth", { depth });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const registration = registrationRef.current;
    if (!registration) return;
    const observer = new IntersectionObserver(([entry]) =>
      setRegistrationVisible(entry.isIntersecting),
    );
    observer.observe(registration);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) =>
      setFooterVisible(entry.isIntersecting),
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  const open = (value: Intent, source: string) => {
    trackCampaignEvent("cta_click", { intent: value, source });
    trackCampaignEvent("form_open", { intent: value, source });
    openerRef.current = document.activeElement as HTMLElement | null;
    setMenuOpen(false);
    setSourceSection(source);
    setIntent(value);
  };
  const close = useCallback(() => setIntent(null), []);
  return (
    <div className="landing">
      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label="Prestige Falcon City Thane, return to top"
        >
          <BrandMark />
        </a>
        <nav
          className={menuOpen ? "site-nav open" : "site-nav"}
          aria-label="Page navigation"
        >
          <a onClick={() => setMenuOpen(false)} href="#details">
            Explore
          </a>
          <a onClick={() => setMenuOpen(false)} href="#amenities">
            Experience
          </a>
          <a onClick={() => setMenuOpen(false)} href="#location">
            Location
          </a>
          <button
            className="button dark nav-action"
            onClick={() => open("enquiry", "header")}
          >
            Enquire <ArrowRight size={16} />
          </button>
        </nav>
        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>
      <main id="top">
        <section
          className="hero"
          ref={heroRef}
          aria-label="Prestige Falcon City Thane"
        >
          <img
            className="hero-image"
            src={heroImage}
            alt="Illustrative residential architecture; not a rendering of this project"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="hero-kicker">THANE · A NEW PERSPECTIVE</p>
            <h1>
              Something worth
              <br />
              <em>looking closer at.</em>
            </h1>
            <p>Prestige Falcon City Thane</p>
          </div>
          <div className="hero-disclaimer">
            Illustrative image · Not an actual project rendering
          </div>
          <a
            className="hero-scroll"
            href="#details"
            aria-label="Explore project details"
          >
            <ArrowDown size={19} />
          </a>
        </section>
        <div className="cta-trio" aria-label="Quick actions">
          <button onClick={() => open("price", "hero_price")}>
            <span className="cta-number">01</span>
            <span>
              Get latest price<small>Request a verified update</small>
            </span>
            <ArrowRight size={19} />
          </button>
          <button onClick={() => open("brochure", "hero_plans")}>
            <span className="cta-number">02</span>
            <span>
              View plans & brochure<small>See what's coming</small>
            </span>
            <ArrowRight size={19} />
          </button>
          <button onClick={() => open("whatsapp", "hero_whatsapp")}>
            <span className="cta-number">03</span>
            <span>
              Chat on WhatsApp<small>Number pending approval</small>
            </span>
            <ArrowRight size={19} />
          </button>
        </div>
        <section className="registration-section" ref={registrationRef} aria-labelledby="registration-heading">
          <div className="registration-card">
            <h2 id="registration-heading">Pre-register for benefits</h2>
            <InlineEnquiryForm
              onOpen={() => open("registration", "hero_registration")}
              action="Express your interest"
              onFocusChange={(focused) =>
                setInlineFocused(focused ? "hero_registration" : null)
              }
            />
          </div>
        </section>
        <ProjectGallery />
        <section className="intro-section" id="details">
          <div className="section-top">
            <div>
              <span className="eyebrow">A CLOSER LOOK</span>
              <h2>
                See what is <em>taking shape.</em>
              </h2>
            </div>
            <p>
              Explore a preview of the information that matters. Approved
              project materials will replace these samples.
            </p>
          </div>
          <div className="document-grid">
            {cards.map((card) => (
              <article className="document-card" key={card.intent}>
                <PreviewArt kind={card.visual} />
                <div className="card-content">
                  <span className="eyebrow">{card.eyebrow}</span>
                  <h3>{card.title}</h3>
                  <p>Illustrative preview · Approved material pending</p>
                  <button
                    onClick={() => open(card.intent, `preview_${card.intent}`)}
                    aria-label={`${card.action}; approved material pending`}
                  >
                    <LockKeyhole size={14} />
                    {card.action}
                    <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="section-footnote">
            These are samples, not project documents. Full-size files and
            pricing are not publicly available.
          </p>
        </section>
        <ProjectPlans onRequest={open} />
        <section className="experience-section" id="amenities">
          <div className="experience-heading">
            <div>
              <span className="eyebrow">THE EXPERIENCE</span>
              <h2>
                More room for <em>possibility.</em>
              </h2>
              <p>
                Illustrative concepts · Final amenities and facilities pending.
              </p>
            </div>
          </div>
          <AmenitiesSlideshow />
        </section>
        <AmenitiesOverview />
        <LocationExperience approvedMap={APPROVED_PROJECT_MAP} />
        <section className="closing-section" id="enquire" ref={footerRef} aria-labelledby="visit-heading">
          <div className="visit-card">
            <div className="visit-image">
              <img
                src={heroImage}
                width={1600}
                height={779}
                loading="lazy"
                alt="Illustrative residential architecture; not a photograph of this project site"
              />
              <p>Illustrative image · Not an actual project rendering</p>
            </div>
            <div className="visit-content">
              <span className="eyebrow">SEE IT FOR YOURSELF</span>
              <h2 id="visit-heading">Request a <em>site visit.</em></h2>
              <InlineEnquiryForm
                onOpen={() => open("site_visit", "final_site_visit")}
                action="Request a site visit"
                onFocusChange={(focused) =>
                  setInlineFocused(focused ? "final_site_visit" : null)
                }
              />
            </div>
          </div>
        </section>
        <ProjectUpdates onOpen={() => open("updates", "updates_pending")} />
      </main>
      <CampaignFooter />
      {showSticky && !footerVisible && !intent &&
        !(inlineFocused === "hero_registration" && registrationVisible) && (
        <div className="sticky-actions">
          <span>Explore the details</span>
          <button
            className="button gold"
            onClick={() => open("price", "sticky")}
          >
            Get price update <ArrowRight className="sticky-arrow" size={18} />
          </button>
          <button
            className="sticky-chat"
            onClick={() => open("whatsapp", "sticky_whatsapp")}
            aria-label="WhatsApp enquiry"
          >
            WhatsApp
          </button>
        </div>
      )}
      {intent && (
        <EnquiryDialog
          key={`${intent}:${sourceSection}`}
          kind={intent}
          sourceSection={sourceSection}
          onClose={close}
          returnFocus={openerRef.current}
        />
      )}

    </div>
  );
}
