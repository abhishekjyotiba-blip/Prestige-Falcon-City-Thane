import type { ApprovedGoogleMap, ApprovedMapPoint } from "../utils/googleMap";

// Owner-approved exact Thane site identity/link/coordinates/map ID are still absent.
// Never substitute a road midpoint, Bengaluru project or corporate office.
export const APPROVED_PROJECT_MAP: ApprovedGoogleMap | null = null;
export const APPROVED_NEARBY_PLACES: readonly ApprovedMapPoint[] = [];
