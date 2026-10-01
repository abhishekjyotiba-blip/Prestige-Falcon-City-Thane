import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  Menu,
  Play,
  X,
} from "lucide-react";
import { LocationExperience } from "./components/LocationExperience";
import heroImage from "./assets/images/temporary-illustrative-exterior.jpg";
import "./landing.css";
import { trackCampaignEvent } from "./utils/campaignAnalytics";
import { useLeadEnquiry, type EnquiryIntent } from "./utils/useLeadEnquiry";
import { InlineEnquiryForm } from "./components/InlineEnquiryForm";

type Intent = EnquiryIntent;
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
const interests = {
  amenities: [
    {
      name: "Space to unwind",
      detail: "Visual direction only",
      style: "leisure",
    },
    {
      name: "Space to move",
      detail: "Visual direction only",
      style: "movement",
    },
    {
      name: "Space to gather",
      detail: "Visual direction only",
      style: "garden",
    },
  ],
  facilities: [
    {
      name: "Thoughtful everyday spaces",
      detail: "Details pending approval",
      style: "movement",
    },
    {
      name: "A considered arrival",
      detail: "Details pending approval",
      style: "garden",
    },
    {
      name: "Room for what matters",
      detail: "Details pending approval",
      style: "leisure",
    },
  ],
};
const notice =
  "Visuals are illustrative only. They do not represent the actual project.";

function PreviewArt({ kind }: { kind: Card["visual"] }) {
  if (kind === "video")
    return (
      <div className="preview-art video-art" aria-hidden="true">
        <span className="play-disc">
          <Play size={22} fill="currentColor" />
        </span>
        <span className="visual-stamp">VIDEO PREVIEW</span>
      </div>
    );
  if (kind === "cost")
    return (
      <div className="preview-art cost-art" aria-hidden="true">
        <div className="sample-sheet">
          <span className="sheet-head" />
          <span />
          <span />
          <span />
          <span />
          <span className="sheet-head" />
        </div>
        <span className="visual-stamp">ILLUSTRATIVE SAMPLE</span>
      </div>
    );
  if (kind === "master")
    return (
      <div className="preview-art plan-art master-art" aria-hidden="true">
        <svg viewBox="0 0 440 250">
          <path
            d="M18 43H423V222H18z M43 66h111v64H43z M185 57h100v52H185z M317 66h79v73h-79z M36 158h91v48H36z M168 144h115v62H168z M315 164h90v43h-90z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M145 42v184M302 43v181M20 146h403"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            opacity=".34"
          />
          <circle
            cx="222"
            cy="125"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
        <span className="visual-stamp">ILLUSTRATIVE SAMPLE</span>
      </div>
    );
  return (
    <div className="preview-art plan-art floor-art" aria-hidden="true">
      <svg viewBox="0 0 440 250">
        <path
          d="M46 23h346v205H46z M46 106h145V23 M190 106v122 M190 156h202 M282 23v133 M282 92h110 M93 106v122 M46 184h144"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M204 156a48 48 0 0 1 48-48M282 95a39 39 0 0 1-39 39M92 180a39 39 0 0 1 39-39"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <span className="visual-stamp">ILLUSTRATIVE SAMPLE</span>
    </div>
  );
}

function RequestDialog({
  intent,
  sourceSection,
  onClose,
  returnFocus,
}: {
  intent: Intent;
  sourceSection: string;
  onClose: () => void;
  returnFocus: HTMLElement | null;
}) {
  const {
    formAvailable, name, setName, phone, setPhone,
    whatsappOptIn, setWhatsappOptIn, pending, saved, error,
    markStarted, submit,
  } = useLeadEnquiry(intent, sourceSection);
  const firstInput = useRef<HTMLInputElement>(null);
  const resultClose = useRef<HTMLButtonElement>(null);
  const focusTask = useRef<number | null>(null);
  useEffect(() => {
    if (saved) resultClose.current?.focus();
  }, [saved]);
  useEffect(() => {
    if (focusTask.current !== null) cancelAnimationFrame(focusTask.current);
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    focusTask.current = requestAnimationFrame(() => {
      if (formAvailable) firstInput.current?.focus();
      else resultClose.current?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const elements = [
          ...document.querySelectorAll<HTMLElement>(
            ".request-dialog button:not([disabled]), .request-dialog input:not([disabled])",
          ),
        ];
        const index = elements.indexOf(document.activeElement as HTMLElement);
        if (index === -1) {
          event.preventDefault();
          elements[0]?.focus();
        } else if (event.shiftKey && index === 0) {
          event.preventDefault();
          elements.at(-1)?.focus();
        } else if (!event.shiftKey && index === elements.length - 1) {
          event.preventDefault();
          elements[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("keydown", onKeyDown);
      if (focusTask.current !== null) cancelAnimationFrame(focusTask.current);
      focusTask.current = requestAnimationFrame(() => {
        if (returnFocus?.isConnected) returnFocus.focus();
        else {
          const fallback = window.matchMedia("(max-width: 700px)").matches
            ? ".site-header .menu-toggle"
            : ".site-header .nav-action";
          document.querySelector<HTMLElement>(fallback)?.focus();
        }
      });
    };
  }, [onClose, returnFocus, formAvailable]);

  const label =
    intent === "price"
      ? "pricing update"
      : intent === "master_plan"
        ? "master plan"
        : intent === "floor_plan"
          ? "floor plans"
          : intent === "video"
            ? "project film"
            : "project details";
  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="request-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-title"
      >
        <button
          className="dialog-close"
          type="button"
          onClick={onClose}
          aria-label="Close form"
        >
          <X size={21} />
        </button>
        {!formAvailable ? (
          <div className="request-result" role="status">
            <span className="eyebrow">CAMPAIGN PREVIEW</span>
            <h2 id="request-title">Enquiries open soon.</h2>
            <p>
              The campaign privacy notice and lead destination are not connected
              yet. This preview does not collect contact details or deliver{" "}
              {label}.
            </p>
            <button ref={resultClose} className="button dark" onClick={onClose}>
              Close <ArrowRight size={16} />
            </button>
          </div>
        ) : saved ? (
          <div className="request-result" role="status">
            <span className="eyebrow">Request recorded</span>
            <h2 id="request-title">Thank you, {name.trim().split(" ")[0]}.</h2>
            <p>
              This preview saved your enquiry for development testing only.
              Approved {label} is not available yet. No document or WhatsApp
              message was sent.
            </p>
            <button ref={resultClose} className="button dark" onClick={onClose}>
              Close <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">YOUR PROJECT ENQUIRY</span>
            <h2 id="request-title">The details, when ready.</h2>
            <p className="dialog-intro">
              Request an update about {label}. Approved files and the campaign
              contact are still pending.
            </p>
            <form
              onSubmit={submit}
              onChange={markStarted}
              noValidate
            >
              <label htmlFor="lead-name">Your name</label>
              <input
                ref={firstInput}
                id="lead-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                required
                maxLength={90}
              />
              <label htmlFor="lead-phone">Mobile number</label>
              <input
                id="lead-phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91  Your mobile number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                maxLength={16}
              />
              <p className="form-notice">
                Use this number only to respond to this project enquiry.
                Campaign privacy information is pending approval.
              </p>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                />
                <span>
                  Optional: contact me by WhatsApp when this channel is
                  available.
                </span>
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="button gold submit-button"
                type="submit"
                disabled={pending}
              >
                {pending ? "Sending request…" : "Request update"}{" "}
                <ArrowRight size={17} />
              </button>
            </form>
            <p className="form-small">
              Preview only. No approved project file or production lead
              destination is connected.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

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
  const [category, setCategory] = useState<"amenities" | "facilities">(
    "amenities",
  );
  const [slide, setSlide] = useState(0);
  const [whatsappNotice, setWhatsappNotice] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const registrationRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
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
  const current = interests[category];
  const open = (value: Intent, source: string) => {
    trackCampaignEvent("cta_click", { intent: value, source });
    trackCampaignEvent("form_open", { intent: value, source });
    openerRef.current = document.activeElement as HTMLElement | null;
    setWhatsappNotice(false);
    setSourceSection(source);
    setIntent(value);
  };
  const close = useCallback(() => setIntent(null), []);
  const chat = () => {
    trackCampaignEvent("cta_click", { source: "whatsapp_pending" });
    setWhatsappNotice(true);
    window.setTimeout(() => setWhatsappNotice(false), 6500);
  };
  return (
    <div className="landing">
      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label="Prestige Falcon City Thane, return to top"
        >
          <span className="brand-name">PRESTIGE</span>
          <span className="brand-sub">
            FALCON CITY <i /> THANE
          </span>
          <small>Brand mark pending approval</small>
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
            onClick={() => open("callback", "header")}
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
          <button onClick={() => open("floor_plan", "hero_plans")}>
            <span className="cta-number">02</span>
            <span>
              View plans & brochure<small>See what's coming</small>
            </span>
            <ArrowRight size={19} />
          </button>
          <button onClick={chat}>
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
              sourceSection="hero_registration"
              action="Express your interest"
              onFocusChange={(focused) =>
                setInlineFocused(focused ? "hero_registration" : null)
              }
            />
          </div>
        </section>
        {whatsappNotice && (
          <div className="channel-notice" role="status">
            The campaign WhatsApp number is not connected yet. Please use the
            enquiry form for development testing.
          </div>
        )}
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
        <section className="experience-section" id="amenities">
          <div className="experience-heading">
            <div>
              <span className="eyebrow">THE EXPERIENCE</span>
              <h2>
                More room for <em>possibility.</em>
              </h2>
              <p>
                Illustrative themes. The approved list of amenities and
                facilities is pending.
              </p>
            </div>
            <div className="carousel-controls">
              <button
                aria-label="Previous feature"
                onClick={() =>
                  setSlide((slide - 1 + current.length) % current.length)
                }
              >
                <ChevronLeft size={21} />
              </button>
              <button
                aria-label="Next feature"
                onClick={() => setSlide((slide + 1) % current.length)}
              >
                <ChevronRight size={21} />
              </button>
            </div>
          </div>
          <div
            className="experience-tabs"
            role="tablist"
            aria-label="Explore features"
          >
            {(["amenities", "facilities"] as const).map((tab) => (
              <button
                key={tab}
                id={`feature-tab-${tab}`}
                role="tab"
                aria-selected={category === tab}
                aria-controls="feature-panel"
                tabIndex={category === tab ? 0 : -1}
                onKeyDown={(event) => {
                  if (
                    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  )
                    return;
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? "amenities"
                      : event.key === "End"
                        ? "facilities"
                        : category === "amenities"
                          ? "facilities"
                          : "amenities";
                  setCategory(next);
                  setSlide(0);
                  document.getElementById(`feature-tab-${next}`)?.focus();
                }}
                onClick={() => {
                  setCategory(tab);
                  setSlide(0);
                }}
              >
                {tab === "amenities" ? "Amenities" : "Facilities"}
                <span>0{tab === "amenities" ? "1" : "2"}</span>
              </button>
            ))}
          </div>
          <div
            className="experience-gallery"
            id="feature-panel"
            role="tabpanel"
            aria-labelledby={`feature-tab-${category}`}
            aria-live="polite"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const start = touchStartX.current;
              touchStartX.current = null;
              if (start === null) return;
              const distance = event.changedTouches[0]?.clientX - start;
              if (Math.abs(distance) > 45)
                setSlide(
                  (index) =>
                    (index + (distance < 0 ? 1 : current.length - 1)) %
                    current.length,
                );
            }}
          >
            <div className={`experience-photo ${current[slide].style}`}>
              <span className="photo-number">
                0{slide + 1} / 0{current.length}
              </span>
              <span className="photo-disclaimer">
                Illustrative concept, not a project amenity
              </span>
            </div>
            <div className="experience-caption">
              <span className="eyebrow">
                {category.toUpperCase()} · 0{slide + 1}
              </span>
              <h3>{current[slide].name}</h3>
              <p>
                {current[slide].detail}. Verified facilities and photographs
                will follow the approved project pack.
              </p>
              <div className="slide-dots" aria-label="Choose feature">
                {current.map((item, index) => (
                  <button
                    key={item.name}
                    aria-label={`Show feature ${index + 1}`}
                    aria-current={index === slide ? "true" : undefined}
                    onClick={() => setSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <LocationExperience />
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
                sourceSection="final_site_visit"
                action="Request a site visit"
                onFocusChange={(focused) =>
                  setInlineFocused(focused ? "final_site_visit" : null)
                }
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div>
          <strong>PRESTIGE</strong>
          <span>FALCON CITY · THANE</span>
        </div>
        <p>
          {notice} Project information, original logo, statutory details and
          privacy text await campaign approval. This preview does not offer
          released pricing or documents.
        </p>
        <a href="#top">Back to top ↑</a>
      </footer>
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
            onClick={chat}
            aria-label="WhatsApp availability"
          >
            WhatsApp
          </button>
        </div>
      )}
      {intent && (
        <RequestDialog
          intent={intent}
          sourceSection={sourceSection}
          onClose={close}
          returnFocus={openerRef.current}
        />
      )}
      <span className="sr-only">
        {whatsappNotice ? "WhatsApp is not yet available" : ""}
      </span>
    </div>
  );
}
