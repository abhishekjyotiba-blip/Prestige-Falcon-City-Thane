import { CAMPAIGN_PROJECT_IDENTITY, type LocalImageVariant, type ProjectMediaRecord } from "../data/projectMedia";

export function isLocalImage(image: LocalImageVariant): boolean {
  return Boolean(image?.src && !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(image.src) &&
    Number.isFinite(image.width) && Number.isFinite(image.height) && image.width > 0 && image.height > 0);
}

export function isEligibleGalleryImage(record: ProjectMediaRecord): boolean {
  return record.kind === "project-image" && record.approvalStatus === "approved" &&
    record.projectIdentity === CAMPAIGN_PROJECT_IDENTITY && record.projectIdentityVerified === true &&
    (record.depiction === "photograph" || record.depiction === "render") &&
    /^https?:\/\//.test(record.sourceUrl) && /^\d{4}-\d{2}-\d{2}$/.test(record.verifiedOn) &&
    Number.isFinite(Date.parse(record.verifiedOn)) && new Date(record.verifiedOn).toISOString().slice(0, 10) === record.verifiedOn &&
    Boolean(record.sourceProvenance.trim()) &&
    Boolean(record.id && record.alt.trim()) && isLocalImage(record.image) &&
    (record.variants ?? []).every(isLocalImage);
}

export function eligibleGalleryImages(records: readonly ProjectMediaRecord[]): ProjectMediaRecord[] {
  const ids = new Set<string>();
  return records.filter((record) => {
    if (!isEligibleGalleryImage(record) || ids.has(record.id)) return false;
    ids.add(record.id);
    return true;
  });
}

export function galleryIndex(index: number, count: number): number {
  return Math.max(0, Math.min(Number.isFinite(index) ? Math.floor(index) : 0, Math.max(0, count - 1)));
}

export interface GalleryRotationState {
  index: number;
  count: number;
  stopped: boolean;
  hovered: boolean;
  focused: boolean;
  visible: boolean;
  documentVisible: boolean;
  reducedMotion: boolean;
}

export function canRotateGallery(state: GalleryRotationState): boolean {
  return state.count > 1 && state.index < state.count - 1 && !state.stopped &&
    !state.hovered && !state.focused && state.visible && state.documentVisible && !state.reducedMotion;
}

export function nextGalleryIndex(index: number, count: number): number {
  return galleryIndex(index + 1, count);
}

export type GalleryRotationAction = "play" | "pause";

/** Pointer intent is captured before focus pauses rotation; keyboard uses the current label. */
export function galleryRotationAction(
  stopped: boolean,
  index: number,
  count: number,
  pointerIntent: GalleryRotationAction | null = null,
): GalleryRotationAction {
  return pointerIntent ?? (stopped || index >= count - 1 ? "play" : "pause");
}
