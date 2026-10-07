import type { FormEvent } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLeadEnquiry } from "./useLeadEnquiry";

function submitEvent() {
  return { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>;
}
function accepted() {
  return new Response(JSON.stringify({
    status: "accepted", leadId: "synthetic-lead", asset: { status: "upcoming" },
  }), { status: 202 });
}
function pair() {
  return renderHook(() => ({
    registration: useLeadEnquiry("callback", "hero_registration"),
    visit: useLeadEnquiry("callback", "final_site_visit"),
  }));
}
function fill(form: ReturnType<typeof useLeadEnquiry>, name = "Synthetic Registration") {
  form.setName(name);
  form.setPhone("9876543210");
}

const originalEnv = process.env;
function enablePrivateFlag() {
  // Vite emits a boolean define, whereas Vitest custom env stubs stringify it.
  // Replace only this worker's env object to model that build-time boolean.
  process.env = { ...process.env, VITE_PRIVATE_LOCAL_PREVIEW: true as unknown as string };
}
afterEach(() => { process.env = originalEnv; vi.unstubAllEnvs(); });
beforeEach(() => {
  (window as Window & { dataLayer?: unknown[] }).dataLayer = [];
});

describe("legacy lead adapter safety boundary", () => {
  it("does not allow production collection even with private/readiness flags", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("DEV", false);
    enablePrivateFlag();
    vi.stubEnv("VITE_LEAD_FORM_READY", "true");
    const fetch = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useLeadEnquiry("callback", "test_public_boundary"));
    expect(result.current.formAvailable).toBe(false);
    act(() => fill(result.current));
    const event = submitEvent();
    await act(async () => { await result.current.submit(event); });
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.saved).toBe(false);
    expect(result.current.pending).toBe(false);
  });

  it("blocks both independent development instances without the private flag", async () => {
    vi.stubEnv("DEV", true);
    vi.stubEnv("VITE_PRIVATE_LOCAL_PREVIEW", "");
    const fetch = vi.spyOn(globalThis, "fetch");
    const { result } = pair();
    act(() => { fill(result.current.registration); fill(result.current.visit); });
    await act(async () => {
      result.current.registration.markStarted(); result.current.visit.markStarted();
      await result.current.registration.submit(submitEvent());
      await result.current.visit.submit(submitEvent());
    });
    expect(fetch).not.toHaveBeenCalled();
    expect((window as Window & { dataLayer?: unknown[] }).dataLayer).toEqual([]);
  });
});

describe("isolated private-development lead adapter", () => {
  beforeEach(() => {
    vi.stubEnv("DEV", true);
    vi.stubEnv("PROD", false);
    enablePrivateFlag();
  });

  it("keeps fields, validation errors, opt-in and form-start tracking independent", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const { result } = pair();
    expect(result.current.registration.formAvailable).toBe(true);
    act(() => {
      fill(result.current.registration);
      result.current.registration.setWhatsappOptIn(true);
      result.current.registration.markStarted(); result.current.registration.markStarted();
      result.current.visit.markStarted(); result.current.visit.markStarted();
    });
    expect(result.current.visit.name).toBe("");
    expect(result.current.visit.phone).toBe("");
    expect(result.current.visit.whatsappOptIn).toBe(false);
    await act(async () => { await result.current.visit.submit(submitEvent()); });
    expect(result.current.visit.error).toMatch(/valid Indian mobile/);
    expect(result.current.registration.error).toBe("");
    expect(result.current.registration.saved).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
    const events = (window as unknown as { dataLayer: { event: string; source: string }[] }).dataLayer;
    expect(events.filter(({ event }) => event === "form_start").map(({ source }) => source))
      .toEqual(["hero_registration", "final_site_visit"]);
    expect(JSON.stringify(events)).not.toMatch(/Synthetic Registration|9876543210/);
  });

  it("allows the other source while one is pending, suppressing same-tick and saved duplicates", async () => {
    let resolve!: (response: Response) => void;
    const delayed = new Promise<Response>((done) => { resolve = done; });
    const fetch = vi.spyOn(globalThis, "fetch").mockReturnValueOnce(delayed).mockResolvedValueOnce(accepted());
    const { result } = pair();
    act(() => {
      fill(result.current.registration);
      fill(result.current.visit, "Synthetic Visit");
      result.current.visit.setWhatsappOptIn(true);
    });
    let first!: Promise<void>;
    act(() => {
      first = result.current.registration.submit(submitEvent());
      void result.current.registration.submit(submitEvent());
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.current.registration.pending).toBe(true);
    expect(result.current.visit.pending).toBe(false);
    await act(async () => { await result.current.visit.submit(submitEvent()); });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result.current.visit.saved).toBe(true);
    expect(result.current.registration.saved).toBe(false);
    const [registration, visit] = fetch.mock.calls.map(([, init]) => ({
      body: JSON.parse(init!.body as string),
      key: (init!.headers as Record<string, string>)["Idempotency-Key"],
    }));
    expect(registration.body).toMatchObject({ sourceSection: "hero_registration", intent: "callback", name: "Synthetic Registration", phoneE164: "+919876543210", consent: { whatsappOptIn: false } });
    expect(visit.body).toMatchObject({ sourceSection: "final_site_visit", intent: "callback", name: "Synthetic Visit", consent: { whatsappOptIn: true } });
    expect(registration.body.assetId).toBeUndefined();
    expect(visit.key).not.toBe(registration.key);
    await act(async () => { resolve(accepted()); await first; });
    expect(result.current.registration.pending).toBe(false);
    expect(result.current.registration.saved).toBe(true);
    await act(async () => {
      await result.current.registration.submit(submitEvent());
      await result.current.visit.submit(submitEvent());
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("retries a lost response with the same body/key independently of the other source", async () => {
    const fetch = vi.spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("Synthetic lost response"))
      .mockResolvedValueOnce(accepted()).mockResolvedValueOnce(accepted());
    const { result } = pair();
    act(() => { fill(result.current.registration); fill(result.current.visit, "Synthetic Visit"); });
    await act(async () => { await result.current.registration.submit(submitEvent()); });
    expect(result.current.registration.error).toBe("Synthetic lost response");
    expect(result.current.registration.pending).toBe(false);
    expect(result.current.registration.saved).toBe(false);
    expect(result.current.visit.error).toBe("");
    await act(async () => { await result.current.visit.submit(submitEvent()); });
    await act(async () => { await result.current.registration.submit(submitEvent()); });
    expect(fetch.mock.calls[2][1]).toEqual(fetch.mock.calls[0][1]);
    expect(fetch.mock.calls[1][1]!.headers).not.toEqual(fetch.mock.calls[0][1]!.headers);
    expect(result.current.registration.error).toBe("");
    expect(result.current.registration.saved).toBe(true);
  });

  it("creates a new retry identity after editing a failed enquiry", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Synthetic failure"));
    const { result } = renderHook(() => useLeadEnquiry("price", "hero_price"));
    act(() => fill(result.current));
    await act(async () => { await result.current.submit(submitEvent()); });
    act(() => result.current.setPhone("8765432109"));
    await act(async () => { await result.current.submit(submitEvent()); });
    expect(fetch.mock.calls[1][1]!.headers).not.toEqual(fetch.mock.calls[0][1]!.headers);
    expect(JSON.parse(fetch.mock.calls[1][1]!.body as string)).toMatchObject({ phoneE164: "+918765432109", assetId: "price" });
    expect(result.current.saved).toBe(false);
  });

  it.each([
    ["production-unavailable response", () => new Response(JSON.stringify({ error: { message: "Unavailable" } }), { status: 503 })],
    ["static-host HTML fallback", () => new Response("<html>Not an API</html>", { status: 200 })],
    ["malformed acceptance", () => new Response(JSON.stringify({ status: "accepted" }), { status: 202 })],
  ])("never saves a %s and permits a safe retry", async (_label, response) => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(response()).mockResolvedValueOnce(accepted());
    const { result } = renderHook(() => useLeadEnquiry("callback", "hero_registration"));
    act(() => fill(result.current));
    await act(async () => { await result.current.submit(submitEvent()); });
    expect(result.current.saved).toBe(false);
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toMatch(/not yet available/);
    await act(async () => { await result.current.submit(submitEvent()); });
    expect(fetch.mock.calls[1][1]).toEqual(fetch.mock.calls[0][1]);
    expect(result.current.saved).toBe(true);
  });
});
