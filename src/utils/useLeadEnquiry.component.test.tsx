import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLeadEnquiry } from "./useLeadEnquiry";

afterEach(() => vi.unstubAllEnvs());

describe("legacy lead adapter safety boundary", () => {
  it("does not allow production collection when a readiness flag is present", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("DEV", false);
    vi.stubEnv("VITE_LEAD_FORM_READY", "true");
    const fetch = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useLeadEnquiry("callback", "test_public_boundary"));
    expect(result.current.formAvailable).toBe(false);
    act(() => { result.current.setName("Synthetic Safety Check"); result.current.setPhone("9876543210"); });
    const preventDefault = vi.fn();
    await act(async () => { await result.current.submit({ preventDefault } as never); });
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.saved).toBe(false);
    expect(result.current.pending).toBe(false);
  });
});
