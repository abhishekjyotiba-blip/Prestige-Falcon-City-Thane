import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import illustrativeImage from "../assets/images/temporary-illustrative-exterior.jpg";
import { AMENITY_CONCEPT_IMAGES, AMENITY_CONCEPT_QUALIFIER, ILLUSTRATIVE_GALLERY_FALLBACK, type AmenityCategory, type GeneratedConceptRecord } from "../data/projectMedia";
import { AMENITY_CATEGORIES, amenitySlides, amenitySwipeIndex, amenityTabTarget } from "../utils/amenitySlideshow";
import "./AmenitiesSlideshow.css";

export interface AmenitiesSlideshowProps {
  concepts?: Readonly<Record<AmenityCategory, readonly GeneratedConceptRecord[]>>;
}

/** Manual-only visual region; App retains the surrounding section and overview grid. */
export function AmenitiesSlideshow({ concepts = AMENITY_CONCEPT_IMAGES }: AmenitiesSlideshowProps) {
  const [category, setCategory] = useState<AmenityCategory>("amenities");
  const tabs = useRef<Partial<Record<AmenityCategory, HTMLButtonElement | null>>>({});
  const id = useId();
  const slides = amenitySlides(concepts[category]);
  return <div className="amenities-slideshow">
    <div className="amenities-slideshow__tabs" role="tablist" aria-label="Explore amenities and facilities">
      {AMENITY_CATEGORIES.map((tab) => <button key={tab} type="button" role="tab"
        ref={(element) => { tabs.current[tab] = element; }} id={`${id}-${tab}`} aria-controls={`${id}-panel`}
        aria-selected={category === tab} tabIndex={category === tab ? 0 : -1}
        onClick={() => setCategory(tab)} onKeyDown={(event) => {
          const target = amenityTabTarget(tab, event.key);
          if (!target) return;
          event.preventDefault();
          setCategory(target);
          tabs.current[target]?.focus();
        }}>{tab === "amenities" ? "Amenities" : "Facilities"}</button>)}
    </div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${category}`} tabIndex={0}>
      <ManualSlides key={`${category}:${JSON.stringify(slides)}`} slides={slides} category={category} />
    </div>
  </div>;
}

function ManualSlides({ slides, category }: { slides: readonly GeneratedConceptRecord[]; category: AmenityCategory }) {
  const [index, setIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const touch = useRef<{ x: number; y: number } | null>(null);
  const current = slides[index];
  const displayed = imageFailed ? undefined : current;
  const count = slides.length;
  function move(next: number) {
    if (next < 0 || next >= count || next === index) return;
    setImageFailed(false);
    setIndex(next);
    setAnnouncement(`${slides[next].conceptLabel}, image ${next + 1} of ${count}`);
  }
  return <div role="group" aria-roledescription={count > 1 ? "carousel" : undefined} aria-label={`Illustrative ${category} concepts`}>
    <figure className="amenities-slideshow__figure" onTouchStart={(event) => {
      touch.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }} onTouchCancel={() => { touch.current = null; }} onTouchEnd={(event) => {
      const start = touch.current;
      touch.current = null;
      if (!start || !event.changedTouches[0]) return;
      move(amenitySwipeIndex(index, count, event.changedTouches[0].clientX - start.x, event.changedTouches[0].clientY - start.y));
    }}>
      <img key={current?.id ?? "fallback"} src={displayed?.image.src ?? illustrativeImage} alt={displayed?.alt ?? ILLUSTRATIVE_GALLERY_FALLBACK.alt}
        onError={() => { if (current && !imageFailed) setImageFailed(true); }}
        width={displayed?.image.width ?? ILLUSTRATIVE_GALLERY_FALLBACK.width} height={displayed?.image.height ?? ILLUSTRATIVE_GALLERY_FALLBACK.height}
        srcSet={displayed?.variants?.map((variant) => `${variant.src} ${variant.width}w`).join(", ")}
        sizes="(max-width: 700px) calc(100vw - 32px), (max-width: 1250px) 90vw, 1120px" loading="lazy" decoding="async" />
      <figcaption>
        <div className="amenities-slideshow__label"><strong>{displayed?.conceptLabel ?? "Illustrative exterior"}</strong>
          {count > 0 && <span>{index + 1} / {count}</span>}</div>
        <p>{displayed ? AMENITY_CONCEPT_QUALIFIER : imageFailed ? "Image unavailable · Existing illustrative image · Not a confirmed project amenity" : "Existing illustrative image · Amenity and facility imagery pending"}</p>
      </figcaption>
    </figure>
    {count > 1 && <div className="amenities-slideshow__controls" aria-label="Slideshow controls">
      <button type="button" aria-label="Previous feature image" aria-disabled={index === 0} onClick={() => move(index - 1)}><ArrowLeft size={19} aria-hidden="true" /></button>
      <div className="amenities-slideshow__direct" aria-label="Choose feature image">
        {slides.map((slide, position) => <button key={slide.id} type="button" aria-label={`Show image ${position + 1}: ${slide.conceptLabel}`}
          aria-current={index === position ? "true" : undefined} onClick={() => move(position)}><span aria-hidden="true" /></button>)}
      </div>
      <button type="button" aria-label="Next feature image" aria-disabled={index === count - 1} onClick={() => move(index + 1)}><ArrowRight size={19} aria-hidden="true" /></button>
    </div>}
    <p className="amenities-slideshow__status" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </div>;
}
