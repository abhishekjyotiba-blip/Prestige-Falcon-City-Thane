import test from "node:test";
import assert from "node:assert/strict";
import {
  LOCATION_CATEGORIES,
  getLocationPage,
  getSelectedLocation,
  type VerifiedLocationPoint,
} from "./locationData";

const fixture = (index: number, category: VerifiedLocationPoint["category"] = "Education"): VerifiedLocationPoint => ({
  id: `test-${index}`,
  name: `Synthetic place ${index}`,
  category,
  distance: {
    value: index,
    unit: "km",
    mode: "walking",
    source: "Synthetic test fixture",
    observedOn: "2026-10-01",
  },
});

test("each empty category has four explicitly separate examples, without fabricated measurements", () => {
  for (const category of LOCATION_CATEGORIES) {
    const page = getLocationPage([], category, 0);
    assert.equal(page.isExample, true);
    assert.equal(page.places.length, 4);
    assert.equal(new Set(page.places.map((place) => place.id)).size, 4);
    for (const place of page.places) {
      assert.equal(place.kind, "example");
      assert.equal(place.category, category);
      assert.equal("distance" in place, false);
      assert.equal("coordinates" in place, false);
    }
  }
});

test("verified category filtering never mixes examples into supplied data", () => {
  const points = [fixture(1), fixture(2), fixture(3, "Healthcare")];
  const page = getLocationPage(points, "Education", 0);
  assert.equal(page.isExample, false);
  assert.deepEqual(page.places.map((place) => place.id), ["test-1", "test-2"]);
  assert.equal(page.places[0].kind, "verified");
  if (page.places[0].kind === "verified") {
    assert.deepEqual(page.places[0].distance, points[0].distance);
  }
  assert.equal(getLocationPage(points, "Shopping", 0).isExample, true);
});

test("four-item pages preserve all supplied points and continuous numbering", () => {
  const points = Array.from({ length: 9 }, (_, index) => fixture(index));
  const pages = [0, 1, 2].map((page) => getLocationPage(points, "Education", page));
  assert.deepEqual(pages.map((page) => page.places.length), [4, 4, 1]);
  assert.deepEqual(pages.map((page) => page.start), [0, 4, 8]);
  assert.ok(pages.every((page) => page.totalPages === 3));
  assert.deepEqual(pages.flatMap((page) => page.places.map((point) => point.id)), points.map((point) => point.id));
});

test("page boundaries clamp safely, including reduced data and non-finite indices", () => {
  const points = Array.from({ length: 5 }, (_, index) => fixture(index));
  assert.equal(getLocationPage(points, "Education", -3).page, 0);
  assert.equal(getLocationPage(points, "Education", 8).page, 1);
  assert.equal(getLocationPage(points, "Education", 1.9).page, 1);
  assert.equal(getLocationPage(points, "Education", Infinity).page, 0);
  assert.equal(getLocationPage(points, "Education", NaN).page, 0);
  assert.equal(getLocationPage(points.slice(0, 1), "Education", 1).page, 0);
});

test("selection follows the displayed page and falls back on page or category change", () => {
  const points = Array.from({ length: 5 }, (_, index) => fixture(index));
  const first = getLocationPage(points, "Education", 0);
  const second = getLocationPage(points, "Education", 1);
  const other = getLocationPage(points, "Healthcare", 0);
  assert.equal(getSelectedLocation(first.places, "test-2")?.id, "test-2");
  assert.equal(getSelectedLocation(second.places, "test-2")?.id, "test-4");
  assert.equal(getSelectedLocation(other.places, "test-4")?.kind, "example");
  assert.equal(getSelectedLocation(first.places, null)?.id, "test-0");
  assert.equal(getSelectedLocation([], null), undefined);
});
