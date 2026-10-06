import test from "node:test";
import assert from "node:assert/strict";
import { getApprovedGoogleMap, getApprovedMapPoints, isBrowserMapKey, validCoordinates, MAP_PROJECT_IDENTITY, type ApprovedGoogleMap, type ApprovedMapPoint } from "./googleMap";
import { getLocationPage, getSelectedLocation } from "./locationData";

// Synthetic format fixtures only, not actual geography or publication approval.
const fixture: ApprovedGoogleMap = {
  projectIdentity: MAP_PROJECT_IDENTITY, approvalStatus: "approved", verifiedOn: "2026-10-02",
  sourceUrl: "https://example.test/owner-evidence", shareUrl: "https://www.google.com/maps/place/Synthetic/",
  projectPin: { latitude: 0, longitude: 0 }, mapId: "synthetic-map-id",
};
const point: ApprovedMapPoint = {
  id: "synthetic-1", name: "Synthetic place", category: "Connectivity", approvalStatus: "approved",
  verifiedOn: "2026-10-02", sourceUrl: "https://example.test/source", coordinates: { latitude: 0, longitude: 0 },
};
test("missing and unapproved site cannot enable map", () => {
  assert.equal(getApprovedGoogleMap(null), null);
  assert.equal(getApprovedGoogleMap(undefined), null);
  for (const patch of [{ approvalStatus: "pending" }, { projectIdentity: "Bengaluru" }, { verifiedOn: "2026-02-30" },
    { verifiedOn: "2999-01-01" }, { sourceUrl: "" }, { mapId: "" }, { mapId: "DEMO_MAP_ID" },
    { projectPin: { latitude: NaN, longitude: 0 } }]) {
    assert.equal(getApprovedGoogleMap({ ...fixture, ...patch } as ApprovedGoogleMap), null);
  }
});
test("approved source plus exact map URL format is required (not geography proof)", () => {
  assert.equal(getApprovedGoogleMap(fixture), fixture);
  assert.ok(getApprovedGoogleMap({ ...fixture, shareUrl: "https://maps.app.goo.gl/Synthetic" }));
  for (const shareUrl of ["javascript:alert(1)", "http://www.google.com/maps/place/test", "https://maps.app.goo.gl.evil.test/test",
    "https://user@www.google.com/maps/place/test", "https://www.google.com:444/maps/place/test", "https://maps.app.goo.gl/",
    "https://www.google.com/maps/search/Thane", "https://www.google.com/"]) {
    assert.equal(getApprovedGoogleMap({ ...fixture, shareUrl }), null);
  }
  assert.equal(getApprovedGoogleMap({ ...fixture, sourceUrl: "http://example.test" }), null);
});
test("coordinates and public browser key require finite range and expected format", () => {
  assert.ok(validCoordinates({ latitude: -90, longitude: 180 }));
  for (const coordinates of [undefined, { latitude: 91, longitude: 0 }, { latitude: 0, longitude: Infinity }]) assert.equal(validCoordinates(coordinates), false);
  assert.equal(isBrowserMapKey(undefined), false);
  assert.equal(isBrowserMapKey("unrestricted-placeholder"), false);
  assert.equal(isBrowserMapKey(`AIza${"x".repeat(35)}`), true);
});
test("only approved source-backed unique POIs enter Google markers; distance is optional", () => {
  assert.deepEqual(getApprovedMapPoints([point, point]), [point]);
  for (const patch of [{ approvalStatus: "pending" }, { coordinates: undefined }, { sourceUrl: "" }, { verifiedOn: "bad" },
    { id: "" }, { name: " " }, { category: "Other" }]) {
    assert.equal(getApprovedMapPoints([{ ...point, ...patch } as ApprovedMapPoint]).length, 0);
  }
  const distance = { value: 1, unit: "km" as const, mode: "walking" as const, source: "Measured test route", observedOn: "2026-10-02" };
  assert.equal(getApprovedMapPoints([{ ...point, distance }]).length, 1);
  assert.equal(getApprovedMapPoints([{ ...point, distance: { ...distance, value: -1 } }]).length, 0);
});
test("real mode has no example markers and category/page/selection clamp together", () => {
  assert.equal(getLocationPage([], "Healthcare", 0, false).places.length, 0);
  assert.equal(getLocationPage([], "Healthcare", 0).places.length, 4);
  const points = Array.from({ length: 9 }, (_, index) => ({ ...point, id: `synthetic-${index}` }));
  const page = getLocationPage(points, "Connectivity", 99, false);
  assert.equal(page.page, 2);
  assert.equal(page.places.length, 1);
  assert.equal(getSelectedLocation(page.places, "stale")?.id, "synthetic-8");
  assert.equal(getLocationPage(points, "Education", 2, false).isExample, false);
});
