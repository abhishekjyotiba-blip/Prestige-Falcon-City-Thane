import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isAcceptedResponse,
  normalizePhone,
  prepareRequest,
} from "./leadRequest";

const enquiry = {
  name: "Test Person",
  phoneE164: "+919876543210",
  intent: "price",
  sourceSection: "hero_price",
  attribution: { utmSource: "test" },
  consent: { noticeVersion: "preview-v1", whatsappOptIn: false },
};

test("normalizes Indian numbers and rejects invalid mobile details", () => {
  assert.equal(normalizePhone("98765 43210"), "+919876543210");
  assert.equal(normalizePhone("+91 98765 43210"), "+919876543210");
  assert.equal(normalizePhone("1234567890"), "");
  assert.equal(normalizePhone("+1 2345678901"), "");
});

test("keeps the key, payload and consent time unchanged on retries", () => {
  const original = prepareRequest(enquiry, null);
  const retry = prepareRequest({ ...enquiry }, original);
  assert.equal(retry, original);
  assert.equal(
    JSON.parse(retry.body).consent.capturedAt,
    JSON.parse(original.body).consent.capturedAt,
  );
  assert.match(original.key, /^[a-zA-Z0-9_-]{8,128}$/);
});

test("makes a new retry identity when details or consent change", () => {
  const original = prepareRequest(enquiry, null);
  const changed = prepareRequest(
    { ...enquiry, consent: { ...enquiry.consent, whatsappOptIn: true } },
    original,
  );
  assert.notEqual(changed.key, original.key);
  assert.equal(JSON.parse(changed.body).consent.whatsappOptIn, true);
});

test("renews expired requests while keeping retries inside the consent window stable", () => {
  const start = Date.parse("2026-09-30T09:00:00.000Z");
  const day = 24 * 60 * 60 * 1000;
  const original = prepareRequest(enquiry, null, start);
  assert.equal(prepareRequest(enquiry, original, start + day - 1), original);
  for (const time of [start + day, start + day + 60_000]) {
    const renewed = prepareRequest(enquiry, original, time);
    assert.notEqual(renewed.key, original.key);
    assert.equal(
      JSON.parse(renewed.body).consent.capturedAt,
      new Date(time).toISOString(),
    );
    assert.equal(prepareRequest(enquiry, renewed, time + 1_000), renewed);
  }
});

test("only an explicit accepted-lead response confirms capture", () => {
  const valid = {
    status: "accepted",
    leadId: "test_123",
    asset: { status: "upcoming" },
  };
  assert.equal(isAcceptedResponse(202, valid), true);
  for (const [status, body] of [
    [200, valid],
    [200, "<html>fallback</html>"],
    [202, {}],
    [202, { ...valid, leadId: "" }],
    [202, { ...valid, asset: { status: "unknown" } }],
    [503, valid],
  ] as const) {
    assert.equal(isAcceptedResponse(status, body), false);
  }
});
