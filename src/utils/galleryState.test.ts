import test from "node:test";
import assert from "node:assert/strict";
import { AMENITY_CONCEPT_IMAGES, PROJECT_CONCEPT_IMAGES, type GeneratedConceptRecord, CAMPAIGN_PROJECT_IDENTITY, PROJECT_GALLERY_IMAGES, ILLUSTRATIVE_GALLERY_FALLBACK, type ProjectMediaRecord } from "../data/projectMedia";
import { eligibleConceptImages, isEligibleConceptImage, selectGalleryImages, canRotateGallery, eligibleGalleryImages, galleryIndex, galleryRotationAction, isEligibleGalleryImage, nextGalleryIndex, type GalleryRotationState } from "./galleryState";

// Synthetic records only, never bundled as live campaign media.
const fixture = (id = "synthetic-1"): ProjectMediaRecord => ({
  id, kind: "project-image", projectIdentity: CAMPAIGN_PROJECT_IDENTITY,
  sourceUrl: "https://example.test/synthetic-gallery", verifiedOn: "2026-10-02",
  sourceProvenance: "SYNTHETIC TEST ONLY — not verified project imagery",
  projectIdentityVerified: true, approvalStatus: "approved", depiction: "render",
  alt: "SYNTHETIC TEST IMAGE — not real project media", image: { src: "/test-only/image.svg", width: 600, height: 600 },
});

const rotation: GalleryRotationState = { index: 0, count: 4, stopped: false, hovered: false, focused: false, visible: true, documentVisible: true, reducedMotion: false };

test("public gallery defaults empty with explicitly distinct illustrative fallback", () => {
  assert.deepEqual(PROJECT_GALLERY_IMAGES, []);
  assert.equal(ILLUSTRATIVE_GALLERY_FALLBACK.depiction, "illustration");
  assert.equal(ILLUSTRATIVE_GALLERY_FALLBACK.projectIdentityVerified, false);
  assert.match(ILLUSTRATIVE_GALLERY_FALLBACK.label, /pending verification/);
});

test("gallery accepts only approved identity-verified campaign photos/renders", () => {
  assert.equal(isEligibleGalleryImage(fixture()), true);
  assert.equal(isEligibleGalleryImage({ ...fixture(), depiction: "photograph" }), true);
  const excluded: Partial<ProjectMediaRecord>[] = [
    { kind: "brand" }, { kind: "illustration" }, { depiction: "illustration" },
    { approvalStatus: "pending" }, { approvalStatus: "excluded" },
    { projectIdentity: "Prestige Falcon City Bengaluru" }, { projectIdentityVerified: false },
    { verifiedOn: "" }, { verifiedOn: "not-a-date" }, { verifiedOn: "2026-02-31" }, { sourceUrl: "" }, { sourceProvenance: "" }, { alt: "" },
    { image: { src: "https://example.test/hotlink.jpg", width: 600, height: 600 } },
    { image: { src: "//example.test/hotlink.jpg", width: 600, height: 600 } },
    { image: { src: "/local.jpg", width: 0, height: 600 } },
    { variants: [{ src: "data:image/png;base64,unsafe", width: 200, height: 200 }] },
  ];
  for (const record of excluded) assert.equal(isEligibleGalleryImage({ ...fixture(), ...record }), false, JSON.stringify(record));
});

test("eligible records preserve order without duplicate slides or filler", () => {
  assert.deepEqual(eligibleGalleryImages([fixture("one"), { ...fixture("bad"), kind: "brand" }, fixture("two"), fixture("one")]).map((record) => record.id), ["one", "two"]);
});

test("rotation requires multiple slides and all environmental permissions", () => {
  assert.equal(canRotateGallery(rotation), true);
  for (const overrides of [{ count: 0 }, { count: 1 }, { hovered: true }, { focused: true }, { visible: false }, { documentVisible: false }, { reducedMotion: true }]) {
    assert.equal(canRotateGallery({ ...rotation, ...overrides }), false);
  }
});

test("manual/focus permanent stop survives visibility or hover restoration until explicit play", () => {
  const stopped = { ...rotation, stopped: true };
  assert.equal(canRotateGallery(stopped), false);
  assert.equal(canRotateGallery({ ...stopped, hovered: false, focused: false, visible: true, documentVisible: true }), false);
  assert.equal(canRotateGallery({ ...stopped, stopped: false }), true);
});

test("advance stops at last slide and indices clamp when data shrinks", () => {
  assert.equal(nextGalleryIndex(0, 4), 1);
  assert.equal(nextGalleryIndex(3, 4), 3);
  assert.equal(canRotateGallery({ ...rotation, index: 3 }), false);
  assert.equal(galleryIndex(5, 2), 1);
  assert.equal(galleryIndex(-1, 4), 0);
  assert.equal(galleryIndex(3, 0), 0);
  assert.equal(galleryIndex(Number.NaN, 4), 0);
  assert.equal(canRotateGallery({ ...rotation, index: 0, stopped: false }), true);
});

test("pointer Pause intent survives focus stopping rotation before click", () => {
  const pointerIntent = galleryRotationAction(false, 0, 4);
  assert.equal(pointerIntent, "pause");
  // React focus has now committed stopped=true, but the pointer requested Pause.
  assert.equal(galleryRotationAction(true, 0, 4, pointerIntent), "pause");
  assert.equal(galleryRotationAction(true, 0, 4, null), "play");
});

test("keyboard and canceled pointer activation use current state; explicit Play remains supported", () => {
  assert.equal(galleryRotationAction(true, 0, 4), "play");
  assert.equal(galleryRotationAction(false, 0, 4), "pause");
  assert.equal(galleryRotationAction(false, 3, 4), "play");
  const pointerIntent = galleryRotationAction(true, 0, 4);
  assert.equal(galleryRotationAction(true, 0, 4, pointerIntent), "play");
});

test("generated concepts have a separate approved optimized illustrative eligibility gate", () => {
  assert.deepEqual(PROJECT_CONCEPT_IMAGES, []);
  assert.deepEqual(AMENITY_CONCEPT_IMAGES, { amenities: [], facilities: [] });
  assert.equal(isEligibleConceptImage(conceptFixture()), true);
  const excluded: Partial<GeneratedConceptRecord>[] = [
    { approvalStatus: "pending" }, { approvalStatus: "excluded" }, { generatedOn: "2026-02-31" },
    { generatedOn: "invalid" }, { generator: " " }, { conceptLabel: " " }, { alt: "Actual project clubhouse" },
    { image: { src: "https://example.test/test.webp", width: 600, height: 600 } },
    { image: { src: "/test.jpg", width: 600, height: 600 } },
    { variants: [{ src: "//example.test/test.avif", width: 200, height: 200 }] },
  ];
  for (const change of excluded) assert.equal(isEligibleConceptImage({ ...conceptFixture(), ...change }), false, JSON.stringify(change));
  assert.equal(isEligibleGalleryImage(conceptFixture() as unknown as ProjectMediaRecord), false);
});

test("concept selection removes duplicates and never displaces verified project media", () => {
  const concepts = [conceptFixture("one"), conceptFixture("two"), conceptFixture("one")];
  assert.deepEqual(eligibleConceptImages(concepts).map((record) => record.id), ["one", "two"]);
  assert.deepEqual(selectGalleryImages([], concepts).map((record) => record.id), ["one", "two"]);
  assert.deepEqual(selectGalleryImages([fixture()], concepts), [fixture()]);
  assert.deepEqual(selectGalleryImages([{ ...fixture(), projectIdentityVerified: false }], concepts).map((record) => record.id), ["one", "two"]);
  assert.deepEqual(selectGalleryImages([], [{ ...conceptFixture(), approvalStatus: "pending" }]), []);
});

function conceptFixture(id = "synthetic-concept"): GeneratedConceptRecord {
  return { id, kind: "generated-concept", depiction: "ai-illustration", approvalStatus: "approved",
    generatedOn: "2026-10-06", generator: "Synthetic test generator", conceptLabel: "Exterior concept",
    alt: "Illustrative residential exterior; not an actual project image", image: { src: "/test-only/exterior.webp", width: 600, height: 600 } };
}
