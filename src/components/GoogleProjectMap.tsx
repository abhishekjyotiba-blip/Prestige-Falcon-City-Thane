import { useEffect, useRef, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import type { ApprovedGoogleMap } from "../utils/googleMap";
import "./GoogleProjectMap.css";

/** Mount only after getApprovedGoogleMap accepts the owner-verified configuration. */
export function GoogleProjectMap({ map }: { map: ApprovedGoogleMap }) {
  const [requested, setRequested] = useState(false);
  const [failed, setFailed] = useState(false);
  const fallback = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (requested) fallback.current?.focus({ preventScroll: true });
  }, [requested]);

  return (
    <div className="google-project-map">
      <div className="google-project-map__frame">
        {!requested ? (
          <div className="google-project-map__preload">
            <MapPin size={24} aria-hidden="true" />
            <strong>Google Maps</strong>
            <p>Loading connects to Google.</p>
            <button className="button dark" type="button" onClick={() => setRequested(true)}>Load Google Map</button>
          </div>
        ) : failed ? (
          <p className="google-project-map__error" role="status">The map could not display here. Open Google Maps below.</p>
        ) : (
          <iframe
            title={`${map.projectIdentity} project location — Google Maps`}
            src={map.embedUrl}
            width="100%"
            height="290"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <a ref={fallback} className="google-project-map__link" href={map.shareUrl} target="_blank" rel="noopener noreferrer">
        Open in Google Maps <ExternalLink size={14} aria-hidden="true" />
      </a>
    </div>
  );
}
