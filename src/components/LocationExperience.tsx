import { useId, useState } from "react";
import {
  LOCATION_CATEGORIES,
  getLocationPage,
  getSelectedLocation,
  type LocationCategory,
  type VerifiedLocationPoint,
} from "../utils/locationData";
import { GoogleProjectMap } from "./GoogleProjectMap";
import { getApprovedGoogleMap, type ApprovedGoogleMap } from "../utils/googleMap";
import "./LocationExperience.css";

// Preserve the future verified-data integration contract.
export { LOCATION_CATEGORIES };
export type { LocationCategory, VerifiedLocationPoint };
export interface LocationExperienceProps {
  points?: readonly VerifiedLocationPoint[];
  approvedMap?: ApprovedGoogleMap | null;
  approvedProjectPin?: { latitude: number; longitude: number };
}

const modeLabels: Record<VerifiedLocationPoint["distance"]["mode"], string> = {
  driving: "Driving route",
  walking: "Walking route",
  transit: "Transit route",
  "straight-line": "Straight-line",
};

export function LocationExperience({ points = [], approvedProjectPin, approvedMap }: LocationExperienceProps) {
  const googleMap = getApprovedGoogleMap(approvedMap);
  const [category, setCategory] = useState<LocationCategory>("Connectivity");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [requestedPage, setRequestedPage] = useState(0);
  const id = useId();
  const panelId = `${id}-places`;
  const noticeId = `${id}-notice`;
  const { places, isExample, totalPages, page, start } = getLocationPage(points, category, requestedPage);
  const selected = getSelectedLocation(places, selectedId);
  const selectedTabId = `${id}-tab-${LOCATION_CATEGORIES.indexOf(category)}`;

  function chooseCategory(next: LocationCategory) {
    setCategory(next);
    setRequestedPage(0);
    setSelectedId(null);
  }
  function choosePage(next: number) {
    setRequestedPage(next);
    setSelectedId(null);
  }

  return (
    <section className={`location-experience${googleMap ? " location-experience--google" : ""}`} id="location" aria-labelledby="location-experience-title">
      <div className="location-experience__inner">
        <h2 id="location-experience-title">Discover the neighbourhood</h2>
        {googleMap ? (
          <GoogleProjectMap key={googleMap.embedUrl} map={googleMap} />
        ) : (
        <div className="location-experience__map" role="group" aria-label={`${category} schematic; not an actual map`}>
          <p className="location-experience__map-label">Schematic · Not an actual map</p>
          <div className="location-experience__ring" aria-hidden="true" />
          <div className="location-experience__ring location-experience__ring--outer" aria-hidden="true" />
          <div className="location-experience__axis" aria-hidden="true" />
          <div className="location-experience__axis location-experience__axis--cross" aria-hidden="true" />
          <div className="location-experience__centre">
            <span className="location-experience__centre-dot" aria-hidden="true" />
            <strong>Prestige Falcon City</strong>
            <span>{approvedProjectPin ? "Schematic only" : "Project pin unverified"}</span>
          </div>
          {places.map((point, index) => (
            <button
              key={point.id}
              className={`location-experience__marker location-experience__marker--${index}${selected?.id === point.id ? " is-active" : ""}`}
              type="button"
              aria-label={`Select ${point.kind === "example" ? "example " : ""}${point.name}`}
              aria-pressed={selected?.id === point.id}
              aria-describedby={noticeId}
              onClick={() => setSelectedId(point.id)}
            >
              <span aria-hidden="true">{start + index + 1}</span>
            </button>
          ))}
        </div>
        )}

        <div className="location-experience__categories" role="tablist" aria-label="Neighbourhood categories">
          {LOCATION_CATEGORIES.map((item, index) => (
            <button
              key={item}
              id={`${id}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={category === item}
              aria-controls={panelId}
              tabIndex={category === item ? 0 : -1}
              onClick={() => chooseCategory(item)}
              onKeyDown={(event) => {
                let next: number;
                switch (event.key) {
                  case "ArrowRight": next = (index + 1) % LOCATION_CATEGORIES.length; break;
                  case "ArrowLeft": next = (index + LOCATION_CATEGORIES.length - 1) % LOCATION_CATEGORIES.length; break;
                  case "Home": next = 0; break;
                  case "End": next = LOCATION_CATEGORIES.length - 1; break;
                  default: return;
                }
                event.preventDefault();
                chooseCategory(LOCATION_CATEGORIES[next]);
                document.getElementById(`${id}-tab-${next}`)?.focus({ preventScroll: true });
              }}
            >{item}</button>
          ))}
        </div>

        <div id={panelId} role="tabpanel" aria-labelledby={selectedTabId} aria-describedby={noticeId}>
          <ol className="location-experience__places" start={start + 1}>
            {places.map((point, index) => (
              <li key={point.id}>
                <button
                  className={`location-experience__place${selected?.id === point.id ? " is-active" : ""}`}
                  type="button"
                  aria-label={`${point.kind === "example" ? "Example: " : ""}${point.name}${point.kind === "verified" ? `, ${point.distance.value} ${point.distance.unit}, ${modeLabels[point.distance.mode]}` : ""}`}
                  aria-pressed={selected?.id === point.id}
                  onClick={() => setSelectedId(point.id)}
                >
                  <span className="location-experience__place-index" aria-hidden="true">{String(start + index + 1).padStart(2, "0")}</span>
                  <span className="location-experience__place-name">{point.name}</span>
                  {point.kind === "verified" && (
                    <span className="location-experience__distance">
                      {point.distance.value} {point.distance.unit}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ol>
          {totalPages > 1 && (
            <nav className="location-experience__pagination" aria-label={`${category} place pages`}>
              <button type="button" onClick={() => choosePage(page - 1)} disabled={page === 0}>Previous</button>
              <span>Page {page + 1} of {totalPages}</span>
              <button type="button" onClick={() => choosePage(page + 1)} disabled={page === totalPages - 1}>Next</button>
            </nav>
          )}
          <p className="location-experience__notice" id={noticeId}>
            {isExample ? "Example places · Distances pending" : googleMap ? "Verified places · Distance details below" : "Verified places · Schematic positions only"}
          </p>
          {selected?.kind === "verified" && (
            <details className="location-experience__metadata" key={selected.id}>
              <summary>Distance details for {selected.name}</summary>
              <p>{modeLabels[selected.distance.mode]} · {selected.distance.source} · {selected.distance.observedOn}</p>
              <p>Actual routes and distances may vary.</p>
            </details>
          )}
        </div>
        <p className="location-experience__announcement" role="status">
          {category}: {places.length} {isExample ? "example" : "verified"} places.
          {totalPages > 1 ? ` Page ${page + 1} of ${totalPages}.` : ""}
        </p>
      </div>
    </section>
  );
}

export default LocationExperience;
