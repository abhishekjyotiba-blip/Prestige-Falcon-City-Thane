import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import illustrativeImage from "../assets/images/temporary-illustrative-exterior.jpg";
import { ILLUSTRATIVE_GALLERY_FALLBACK, PROJECT_GALLERY_IMAGES, type ProjectMediaRecord } from "../data/projectMedia";
import { canRotateGallery, eligibleGalleryImages, galleryIndex, galleryRotationAction, nextGalleryIndex, type GalleryRotationAction } from "../utils/galleryState";
import "./ProjectGallery.css";

export interface ProjectGalleryProps {
  /** Only locally served, approved and identity-verified Thane photos/renders qualify. */
  images?: readonly ProjectMediaRecord[];
}

export function ProjectGallery({ images = PROJECT_GALLERY_IMAGES }: ProjectGalleryProps) {
  const eligible = eligibleGalleryImages(images);
  return (
    <section id="gallery" className="project-gallery" aria-labelledby="project-gallery-heading">
      <div className="project-gallery__inner">
        {eligible.length ? <ReadyGallery images={eligible} key={eligible.map((image) => image.id).join("|")} /> : <>
          <h2 id="project-gallery-heading">A closer look.</h2>
          <figure className="project-gallery__fallback">
            <img src={illustrativeImage} alt={ILLUSTRATIVE_GALLERY_FALLBACK.alt}
              width={ILLUSTRATIVE_GALLERY_FALLBACK.width} height={ILLUSTRATIVE_GALLERY_FALLBACK.height}
              loading="lazy" decoding="async" />
            <figcaption>{ILLUSTRATIVE_GALLERY_FALLBACK.label}</figcaption>
          </figure>
        </>}
      </div>
    </section>
  );
}

function ReadyGallery({ images }: { images: readonly ProjectMediaRecord[] }) {
  const region = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const manualScroll = useRef(false);
  const pointerRotationIntent = useRef<GalleryRotationAction | null>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [announcement, setAnnouncement] = useState("");
  const rotating = canRotateGallery({ index, count: images.length, stopped, hovered, focused, visible, documentVisible, reducedMotion });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChange = () => { setReducedMotion(media.matches); if (media.matches) setStopped(true); };
    const visibilityChange = () => setDocumentVisible(!document.hidden);
    if (media.matches) setStopped(true);
    media.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", visibilityChange);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    if (region.current) observer.observe(region.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", visibilityChange);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  function moveTo(next: number, manual: boolean) {
    const target = galleryIndex(next, images.length);
    manualScroll.current = false;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    setIndex(target);
    if (manual) {
      setStopped(true);
      setAnnouncement(`Image ${target + 1} of ${images.length}: ${images[target].alt}`);
    }
    const element = track.current;
    const card = element?.children[target] as HTMLElement | undefined;
    if (element && card) element.scrollTo({ left: card.offsetLeft - (element.children[0] as HTMLElement).offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
  }

  useEffect(() => {
    if (!rotating) return;
    const timer = setTimeout(() => moveTo(nextGalleryIndex(index, images.length), false), 6000);
    return () => clearTimeout(timer);
  }, [rotating, index, images, reducedMotion]);

  function stopForNativeScroll() {
    setStopped(true);
    manualScroll.current = true;
  }

  function onScroll() {
    if (!manualScroll.current) return;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const element = track.current;
      if (!element || element.scrollWidth <= element.clientWidth) return;
      const cards = Array.from(element.children) as HTMLElement[];
      let selected = 0;
      if (element.scrollLeft >= element.scrollWidth - element.clientWidth - 2) selected = images.length - 1;
      else cards.forEach((card, candidate) => {
        if (Math.abs(card.offsetLeft - cards[0].offsetLeft - element.scrollLeft) <
          Math.abs(cards[selected].offsetLeft - cards[0].offsetLeft - element.scrollLeft)) selected = candidate;
      });
      setIndex(selected);
      setAnnouncement(`Image ${selected + 1} of ${images.length}: ${images[selected].alt}`);
    }, 160);
  }

  return (
    <div ref={region} role="group" aria-roledescription={images.length > 1 ? "carousel" : undefined} aria-label="Project imagery"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => { setFocused(true); setStopped(true); }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
      <div className="project-gallery__heading">
        <h2 id="project-gallery-heading">A closer look.</h2>
        {images.length > 1 && <div className="project-gallery__controls" aria-label="Gallery controls">
          <button type="button" aria-label="Previous gallery image" aria-disabled={index === 0} onClick={() => moveTo(index - 1, true)}><ArrowLeft size={19} aria-hidden="true" /></button>
          <button type="button" aria-label="Next gallery image" aria-disabled={index === images.length - 1} onClick={() => moveTo(index + 1, true)}><ArrowRight size={19} aria-hidden="true" /></button>
          <button type="button" className="project-gallery__play" disabled={reducedMotion}
            aria-label={reducedMotion ? "Gallery flow paused for reduced motion" : stopped || index === images.length - 1 ? "Play gallery flow" : "Pause gallery flow"}
            onPointerDown={(event) => {
              pointerRotationIntent.current = event.button === 0 ? galleryRotationAction(stopped, index, images.length) : null;
            }}
            onPointerCancel={() => { pointerRotationIntent.current = null; }}
            onKeyDown={() => { pointerRotationIntent.current = null; }}
            onClick={(event) => {
              if (reducedMotion) { pointerRotationIntent.current = null; return; }
              const action = galleryRotationAction(stopped, index, images.length, event.detail > 0 ? pointerRotationIntent.current : null);
              pointerRotationIntent.current = null;
              if (action === "pause") setStopped(true);
              else { if (index === images.length - 1) moveTo(0, false); setStopped(false); setFocused(false); }
            }}>
            {reducedMotion || !(stopped || index === images.length - 1) ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {reducedMotion ? "Paused" : stopped || index === images.length - 1 ? "Play" : "Pause"}
          </button>
        </div>}
      </div>
      <div ref={track} className="project-gallery__track" tabIndex={images.length > 1 ? 0 : undefined}
        aria-label="Project images; scroll to explore" onPointerDown={stopForNativeScroll} onWheel={stopForNativeScroll}
        onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", " "].includes(event.key)) stopForNativeScroll(); }} onScroll={onScroll}>
        {images.map((record, position) => <figure key={record.id} className="project-gallery__card" role="group" aria-roledescription="slide" aria-label={`${position + 1} of ${images.length}`}>
          <img src={record.image.src} width={record.image.width} height={record.image.height} alt={record.alt} loading="lazy" decoding="async"
            srcSet={record.variants?.map((variant) => `${variant.src} ${variant.width}w`).join(", ")}
            sizes="(max-width: 700px) 80vw, (max-width: 1000px) 40vw, 320px" />
          <figcaption>{record.alt}<span>{record.depiction === "render" ? "Artistic impression" : "Project photograph"}</span></figcaption>
        </figure>)}
      </div>
      <p className="project-gallery__status" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
