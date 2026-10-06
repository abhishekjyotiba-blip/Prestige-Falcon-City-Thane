import { type AmenityCategory, type GeneratedConceptRecord } from "../data/projectMedia";
import { eligibleConceptImages, galleryIndex } from "./galleryState";

export const AMENITY_CATEGORIES: readonly AmenityCategory[] = ["amenities", "facilities"];

export function amenityTabTarget(category: AmenityCategory, key: string): AmenityCategory | null {
  if (key === "Home") return "amenities";
  if (key === "End") return "facilities";
  if (key === "ArrowLeft" || key === "ArrowRight") return category === "amenities" ? "facilities" : "amenities";
  return null;
}

export function amenitySlides(records: readonly GeneratedConceptRecord[]) {
  return eligibleConceptImages(records);
}

/** Ignore small gestures and vertical scrolling; never prevent page scrolling. */
export function amenitySwipeIndex(index: number, count: number, deltaX: number, deltaY: number) {
  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return galleryIndex(index, count);
  return galleryIndex(index + (deltaX < 0 ? 1 : -1), count);
}
