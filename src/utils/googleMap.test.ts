import test from "node:test";
import assert from "node:assert/strict";
import { getApprovedGoogleMap, MAP_PROJECT_IDENTITY, type ApprovedGoogleMap } from "./googleMap";

// URL format fixture only; not an actual project-site pin or production configuration.
const fixture: ApprovedGoogleMap = {
  projectIdentity: MAP_PROJECT_IDENTITY,
  approvalStatus: "approved",
  verifiedOn: "2026-10-02",
  shareUrl: "https://www.google.com/maps/place/Synthetic+test+fixture/",
  embedUrl: "https://www.google.com/maps/embed?pb=synthetic-format-fixture",
};

test("missing or unapproved project map never enables Google loading", () => {
  assert.equal(getApprovedGoogleMap(null), null);
  assert.equal(getApprovedGoogleMap(undefined), null);
  assert.equal(getApprovedGoogleMap({ ...fixture, approvalStatus: "pending" } as unknown as ApprovedGoogleMap), null);
  assert.equal(getApprovedGoogleMap({ ...fixture, projectIdentity: "Prestige Falcon City Bengaluru" }), null);
  assert.equal(getApprovedGoogleMap({ ...fixture, verifiedOn: "" }), null);
});

test("accepts only the approved project and Google share/embed format", () => {
  assert.equal(getApprovedGoogleMap(fixture), fixture);
  assert.ok(getApprovedGoogleMap({ ...fixture, shareUrl: "https://maps.app.goo.gl/SyntheticFixture" }));
  assert.equal(getApprovedGoogleMap({ ...fixture, embedUrl: fixture.shareUrl }), null);
  assert.equal(getApprovedGoogleMap({ ...fixture, embedUrl: "https://www.google.com/maps/embed" }), null);
  assert.equal(getApprovedGoogleMap({ ...fixture, embedUrl: "https://www.google.com/maps/embed/v1/place?key=fixture&q=Thane" }), null);
  assert.equal(getApprovedGoogleMap({ ...fixture, shareUrl: "https://www.google.com/" }), null);
});

test("rejects unsafe protocols, credentials, ports and lookalike hosts", () => {
  for (const embedUrl of [
    "javascript:alert(1)",
    "http://www.google.com/maps/embed?pb=fixture",
    "https://www.google.com.evil.test/maps/embed?pb=fixture",
    "https://user@www.google.com/maps/embed?pb=fixture",
    "https://www.google.com:444/maps/embed?pb=fixture",
    "https://example.test/maps/embed?pb=fixture",
  ]) assert.equal(getApprovedGoogleMap({ ...fixture, embedUrl }), null);
  for (const shareUrl of [
    "javascript:alert(1)",
    "https://maps.app.goo.gl.evil.test/fixture",
    "https://www.google.com@evil.test/maps/place/fixture",
    "https://maps.app.goo.gl/",
  ]) assert.equal(getApprovedGoogleMap({ ...fixture, shareUrl }), null);
});
