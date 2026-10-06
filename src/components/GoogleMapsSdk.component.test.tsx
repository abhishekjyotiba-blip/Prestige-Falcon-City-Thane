import { afterEach, beforeEach, expect, it, vi } from "vitest";
const key = `AIza${"x".repeat(35)}`;
const host = window as unknown as { google?: unknown; gm_authFailure?: () => void };
function googleFixture() {
  const importLibrary = vi.fn(async (name: string) => name === "maps" ? { Map: class {}, LatLngBounds: class {} } : { AdvancedMarkerElement: class {} });
  return { maps: { importLibrary, event: { clearInstanceListeners: vi.fn() } } };
}
beforeEach(() => { vi.resetModules(); delete host.google; delete host.gm_authFailure; });
afterEach(() => { vi.useRealTimers(); delete host.google; delete host.gm_authFailure; document.head.querySelectorAll('script[src*="maps.googleapis.com"]').forEach((script) => script.remove()); });
it("validates before touching the DOM and deduplicates one script/import across consumers", async () => {
  const { loadGoogleMapsSdk } = await import("../utils/googleMapsSdk");
  await expect(loadGoogleMapsSdk("")).rejects.toThrow("configuration unavailable");
  expect(document.head.querySelectorAll("script")).toHaveLength(0);
  const first = loadGoogleMapsSdk(key), second = loadGoogleMapsSdk(key);
  expect(first).toBe(second);
  const script = document.head.querySelector('script[src*="maps.googleapis.com"]')!;
  expect(document.head.querySelectorAll("script")).toHaveLength(1);
  const fixture = googleFixture(); host.google = fixture;
  script.dispatchEvent(new Event("load"));
  await expect(first).resolves.toHaveProperty("AdvancedMarkerElement");
  expect(fixture.maps.importLibrary).toHaveBeenCalledTimes(2);
  expect(loadGoogleMapsSdk(key)).toBe(first);
});
it("blocked scripts are removed and explicit retry creates one fresh loader", async () => {
  const { loadGoogleMapsSdk } = await import("../utils/googleMapsSdk");
  const first = loadGoogleMapsSdk(key);
  const assertion = expect(first).rejects.toThrow("could not load");
  document.head.querySelector("script")!.dispatchEvent(new Event("error"));
  await assertion;
  expect(document.head.querySelector("script")).toBeNull();
  const retry = loadGoogleMapsSdk(key);
  host.google = googleFixture(); document.head.querySelector("script")!.dispatchEvent(new Event("load"));
  await expect(retry).resolves.toHaveProperty("Map");
});
it("timeout and authentication error reject without retaining a script or auth callback", async () => {
  vi.useFakeTimers();
  const { loadGoogleMapsSdk } = await import("../utils/googleMapsSdk");
  const previous = vi.fn(); host.gm_authFailure = previous;
  const first = loadGoogleMapsSdk(key);
  const timeoutAssertion = expect(first).rejects.toThrow("could not load");
  await vi.advanceTimersByTimeAsync(15001); await timeoutAssertion;
  expect(document.head.querySelector("script")).toBeNull();
  expect(host.gm_authFailure).toBe(previous);
  const retry = loadGoogleMapsSdk(key);
  const authAssertion = expect(retry).rejects.toThrow("could not load");
  host.gm_authFailure?.(); await authAssertion;
  expect(previous).toHaveBeenCalledTimes(1);
  expect(host.gm_authFailure).toBe(previous);
  expect(vi.getTimerCount()).toBe(0);
});
