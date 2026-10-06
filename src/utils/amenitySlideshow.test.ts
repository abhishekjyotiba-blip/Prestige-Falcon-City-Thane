import test from "node:test";
import assert from "node:assert/strict";
import { amenitySlides, amenitySwipeIndex, amenityTabTarget } from "./amenitySlideshow";
import { AMENITY_CONCEPT_IMAGES, type GeneratedConceptRecord } from "../data/projectMedia";

test("amenity tabs support Arrow/Home/End without taking ordinary scrolling keys", () => {
  assert.equal(amenityTabTarget("amenities", "ArrowRight"), "facilities");
  assert.equal(amenityTabTarget("facilities", "ArrowLeft"), "amenities");
  assert.equal(amenityTabTarget("amenities", "ArrowLeft"), "facilities");
  assert.equal(amenityTabTarget("amenities", "End"), "facilities");
  assert.equal(amenityTabTarget("facilities", "Home"), "amenities");
  assert.equal(amenityTabTarget("amenities", "ArrowDown"), null);
  assert.equal(amenityTabTarget("amenities", "Tab"), null);
});

test("swipe advances manually within boundaries and ignores vertical/small gestures", () => {
  assert.equal(amenitySwipeIndex(0, 3, -80, 10), 1);
  assert.equal(amenitySwipeIndex(1, 3, 80, 10), 0);
  assert.equal(amenitySwipeIndex(2, 3, -80, 10), 2);
  assert.equal(amenitySwipeIndex(0, 3, 80, 10), 0);
  assert.equal(amenitySwipeIndex(1, 3, -80, 120), 1);
  assert.equal(amenitySwipeIndex(1, 3, -20, 0), 1);
  assert.equal(amenitySwipeIndex(0, 0, -80, 0), 0);
});

test("slideshow has no invented default slides and only accepts reviewed concepts", () => {
  assert.deepEqual(amenitySlides(AMENITY_CONCEPT_IMAGES.amenities), []);
  assert.deepEqual(amenitySlides(AMENITY_CONCEPT_IMAGES.facilities), []);
  const record: GeneratedConceptRecord = { id: "test-only", kind: "generated-concept", depiction: "ai-illustration",
    approvalStatus: "approved", generatedOn: "2026-10-06", generator: "Synthetic test only", conceptLabel: "Garden concept",
    alt: "Illustrative garden, not a project amenity", image: { src: "/test-only/garden.avif", width: 800, height: 600 } };
  assert.deepEqual(amenitySlides([record, record, { ...record, id: "pending", approvalStatus: "pending" }]), [record]);
});
