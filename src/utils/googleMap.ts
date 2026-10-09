import { LOCATION_CATEGORIES, type VerifiedLocationPoint } from "./locationData";

export const MAP_PROJECT_IDENTITY = "Prestige Falcon City Thane";
export interface MapCoordinates { latitude: number; longitude: number }
/** Approval is an owner evidence boundary, not proof inferred from URL syntax. */
export interface ApprovedGoogleMap {
  projectIdentity: string;
  approvalStatus: "approved";
  verifiedOn: string;
  sourceUrl: string;
  shareUrl: string;
  projectPin: MapCoordinates;
  mapId: string;
}
export interface ApprovedMapPoint extends VerifiedLocationPoint {
  coordinates: MapCoordinates;
  sourceUrl: string;
  verifiedOn: string;
  approvalStatus: "approved";
}

function publicHttpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port ? url : null;
  } catch { return null; }
}
export function validVerificationDate(value: string): boolean {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value &&
    Date.parse(value) <= Date.now();
}
export function validCoordinates(value: MapCoordinates | undefined): value is MapCoordinates {
  return !!value && Number.isFinite(value.latitude) && Math.abs(value.latitude) <= 90 &&
    Number.isFinite(value.longitude) && Math.abs(value.longitude) <= 180;
}
export function isBrowserMapKey(value: string | undefined): value is string {
  return typeof value === "string" && /^AIza[A-Za-z0-9_-]{35}$/.test(value);
}
export function getApprovedGoogleMap(candidate: ApprovedGoogleMap | null | undefined): ApprovedGoogleMap | null {
  if (!candidate || candidate.approvalStatus !== "approved" ||
      candidate.projectIdentity !== MAP_PROJECT_IDENTITY || !validVerificationDate(candidate.verifiedOn) ||
      !publicHttpsUrl(candidate.sourceUrl) || !validCoordinates(candidate.projectPin) ||
      typeof candidate.mapId !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(candidate.mapId) ||
      candidate.mapId === "DEMO_MAP_ID") return null;
  const share = publicHttpsUrl(candidate.shareUrl);
  if (!share) return null;
  const googleShare = ["www.google.com", "google.com"].includes(share.hostname) &&
    /^\/maps(?:\/|$)/.test(share.pathname) && !/^\/maps\/search(?:\/|$)/.test(share.pathname);
  const shortShare = share.hostname === "maps.app.goo.gl" && share.pathname.length > 1;
  return googleShare || shortShare ? candidate : null;
}
export function getApprovedMapPoints(points: readonly VerifiedLocationPoint[]): ApprovedMapPoint[] {
  const seen = new Set<string>();
  return points.filter((point): point is ApprovedMapPoint => {
    const record = point as Partial<ApprovedMapPoint>;
    const distance = point.distance;
    if (record.approvalStatus !== "approved" || !validCoordinates(record.coordinates) ||
        !record.sourceUrl || !publicHttpsUrl(record.sourceUrl) || !validVerificationDate(record.verifiedOn ?? "") ||
        typeof point.id !== "string" || !/^[A-Za-z0-9_-]+$/.test(point.id) || seen.has(point.id) ||
        typeof point.name !== "string" || !point.name.trim() || !LOCATION_CATEGORIES.includes(point.category) ||
        (distance && (!Number.isFinite(distance.value) || distance.value < 0 ||
          !["km", "m"].includes(distance.unit) || !["driving", "walking", "transit", "straight-line"].includes(distance.mode) ||
          !distance.source?.trim() || !validVerificationDate(distance.observedOn)))) return false;
    seen.add(point.id);
    return true;
  });
}
export function toLatLng(coordinates: MapCoordinates) {
  return { lat: coordinates.latitude, lng: coordinates.longitude };
}
