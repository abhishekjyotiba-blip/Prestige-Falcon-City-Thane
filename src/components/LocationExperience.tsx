import { useId, useState } from 'react';
import './LocationExperience.css';

export const LOCATION_CATEGORIES = [
  'Connectivity',
  'Education',
  'Healthcare',
  'Shopping',
  'Lifestyle',
] as const;

export type LocationCategory = (typeof LOCATION_CATEGORIES)[number];

/** Supply only approved locations and measured distances; the schematic is never a geographic map. */
export interface VerifiedLocationPoint {
  id: string;
  name: string;
  category: LocationCategory;
  distance: {
    value: number;
    unit: 'km' | 'm';
    mode: 'driving' | 'walking' | 'transit' | 'straight-line';
    source: string;
    observedOn: string; // ISO date, YYYY-MM-DD
  };
  coordinates?: { latitude: number; longitude: number }; // For a future licensed map, not this schematic
}

export interface LocationExperienceProps {
  points?: readonly VerifiedLocationPoint[];
  approvedProjectPin?: { latitude: number; longitude: number };
}

const categoryDescriptions: Record<LocationCategory, string> = {
  Connectivity: 'Road and transit connections',
  Education: 'Schools and learning',
  Healthcare: 'Hospitals and care',
  Shopping: 'Retail and essentials',
  Lifestyle: 'Leisure and everyday life',
};

const modeLabels: Record<VerifiedLocationPoint['distance']['mode'], string> = {
  driving: 'Driving route',
  walking: 'Walking route',
  transit: 'Transit route',
  'straight-line': 'Straight-line',
};

export function LocationExperience({ points = [], approvedProjectPin }: LocationExperienceProps) {
  const [category, setCategory] = useState<LocationCategory>('Connectivity');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const descriptionId = useId();
  const visiblePoints = points.filter((point) => point.category === category);
  const activeId = visiblePoints.some((point) => point.id === selectedId)
    ? selectedId
    : visiblePoints[0]?.id;

  return (
    <section className="location-experience" id="location" aria-labelledby="location-experience-title">
      <div className="location-experience__inner">
        <div className="location-experience__intro">
          <div>
            <p className="location-experience__eyebrow">Discover the neighbourhood <span aria-hidden="true">/ 05</span></p>
            <h2 id="location-experience-title">A sense of place.</h2>
          </div>
          <p className="location-experience__lede">Explore what surrounds your next address. Verified places and distances will be added here once the project pin and routes are confirmed.</p>
        </div>

        <div className="location-experience__body">
          <div className="location-experience__explore">
            <p className="location-experience__overline">Explore by interest</p>
            <div className="location-experience__categories" role="group" aria-label="Location categories">
              {LOCATION_CATEGORIES.map((item, index) => (
                <button
                  className={`location-experience__category${category === item ? ' is-active' : ''}`}
                  type="button"
                  key={item}
                  aria-pressed={category === item}
                  aria-controls={descriptionId}
                  onClick={() => { setCategory(item); setSelectedId(null); }}
                >
                  <span className="location-experience__category-number" aria-hidden="true">0{index + 1}</span>
                  <span>{item}</span>
                  <span className="location-experience__category-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>

            <div className="location-experience__results" id={descriptionId}>
              <div className="location-experience__results-head">
                <div>
                  <p className="location-experience__overline">Selected category</p>
                  <h3>{category}</h3>
                </div>
                <span className="location-experience__count">{visiblePoints.length.toString().padStart(2, '0')}</span>
              </div>
              <p className="location-experience__category-description">{categoryDescriptions[category]}</p>
              <div className="location-experience__announcement" role="status" aria-live="polite">
                {visiblePoints.length ? `${category}: ${visiblePoints.length} verified places.` : `${category}: places and distances awaiting verification.`}
              </div>
              {visiblePoints.length ? (
                <ol className="location-experience__places">
                  {visiblePoints.map((point, index) => (
                    <li key={point.id}>
                      <button
                        type="button"
                        className={`location-experience__place${activeId === point.id ? ' is-active' : ''}`}
                        aria-pressed={activeId === point.id}
                        onClick={() => setSelectedId(point.id)}
                      >
                        <span className="location-experience__place-index">{String(index + 1).padStart(2, '0')}</span>
                        <span className="location-experience__place-detail">
                          <strong>{point.name}</strong>
                          <small>{modeLabels[point.distance.mode]} · {point.distance.source} · {point.distance.observedOn}</small>
                        </span>
                        <span className="location-experience__distance">{point.distance.value} {point.distance.unit}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="location-experience__empty">
                  <span className="location-experience__empty-symbol" aria-hidden="true">✳</span>
                  <p>Nearby places are being verified.</p>
                  <span>Distances available after route verification.</span>
                </div>
              )}
            </div>
          </div>

          <div className="location-experience__map" aria-label="Illustrative location schematic; not an actual map">
            <div className="location-experience__map-top">
              <span className="location-experience__map-caption">THE SURROUNDINGS <span aria-hidden="true">/</span> AN EXPLORATION</span>
              <span className="location-experience__map-label">Not an actual map</span>
            </div>
            <div className="location-experience__canvas">
              <div className="location-experience__ring location-experience__ring--one" aria-hidden="true" />
              <div className="location-experience__ring location-experience__ring--two" aria-hidden="true" />
              <div className="location-experience__axis location-experience__axis--one" aria-hidden="true" />
              <div className="location-experience__axis location-experience__axis--two" aria-hidden="true" />
              <div className="location-experience__compass" aria-hidden="true">N <span>↑</span></div>
              <div className="location-experience__centre">
                <span className="location-experience__centre-dot" aria-hidden="true" />
                <strong>Prestige Falcon City</strong>
                <span>{approvedProjectPin ? 'Schematic only' : 'Project pin pending verification'}</span>
              </div>
              {visiblePoints.length > 0 && (
                <div className="location-experience__markers" role="group" aria-label={`${category} schematic markers`}>
                  {visiblePoints.map((point, index) => (
                    <button
                      key={point.id}
                      type="button"
                      style={{ '--marker-angle': `${(index * 137.5 + 28) % 360}deg`, '--marker-radius': `${34 + (index % 3) * 7}%` } as React.CSSProperties}
                      className={`location-experience__marker${activeId === point.id ? ' is-active' : ''}`}
                      aria-label={`Select ${point.name}, ${point.distance.value} ${point.distance.unit}, ${modeLabels[point.distance.mode]}`}
                      aria-pressed={activeId === point.id}
                      onClick={() => setSelectedId(point.id)}
                    >{index + 1}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="location-experience__map-bottom">
              <span><i aria-hidden="true" /> {category}</span>
              <span>Diagram only · No geographic scale</span>
            </div>
          </div>
        </div>
        <p className="location-experience__footnote">Actual routes and distances may vary. Source, observation date and travel mode will accompany each verified place.</p>
      </div>
    </section>
  );
}

export default LocationExperience;
