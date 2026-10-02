export const LOCATION_CATEGORIES = [
  "Connectivity",
  "Education",
  "Healthcare",
  "Shopping",
  "Lifestyle",
] as const;

export type LocationCategory = (typeof LOCATION_CATEGORIES)[number];

/** Approved places and measured distances, never fabricated schematic data. */
export interface VerifiedLocationPoint {
  id: string;
  name: string;
  category: LocationCategory;
  distance: {
    value: number;
    unit: "km" | "m";
    mode: "driving" | "walking" | "transit" | "straight-line";
    source: string;
    observedOn: string;
  };
  coordinates?: { latitude: number; longitude: number };
}

export type LocationDisplayPoint =
  | (VerifiedLocationPoint & { kind: "verified" })
  | { id: string; name: string; category: LocationCategory; kind: "example" };

const examples: Record<LocationCategory, readonly string[]> = {
  Connectivity: ["Transit stop", "Rail link", "Road link", "Metro link"],
  Education: ["School", "College", "Learning centre", "Preschool"],
  Healthcare: ["Hospital", "Clinic", "Pharmacy", "Medical centre"],
  Shopping: ["Shopping centre", "Supermarket", "Local market", "Convenience store"],
  Lifestyle: ["Park", "Cinema", "Recreation centre", "Leisure space"],
};

export const LOCATION_PAGE_SIZE = 4;

export function getLocationPage(
  points: readonly VerifiedLocationPoint[],
  category: LocationCategory,
  requestedPage: number,
) {
  const verified = points.filter((point) => point.category === category);
  const displayed: LocationDisplayPoint[] = verified.length
    ? verified.map((point) => ({ ...point, kind: "verified" }))
    : examples[category].map((name, index) => ({
        id: `${category.toLowerCase()}-example-${index}`,
        name,
        category,
        kind: "example",
      }));
  const totalPages = Math.ceil(displayed.length / LOCATION_PAGE_SIZE);
  const page = Math.max(
    0,
    Math.min(totalPages - 1, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 0),
  );
  const start = page * LOCATION_PAGE_SIZE;
  return {
    places: displayed.slice(start, start + LOCATION_PAGE_SIZE),
    isExample: !verified.length,
    totalPages,
    page,
    start,
  };
}

export function getSelectedLocation(
  places: readonly LocationDisplayPoint[],
  selectedId: string | null,
) {
  return places.find((point) => point.id === selectedId) ?? places[0];
}
