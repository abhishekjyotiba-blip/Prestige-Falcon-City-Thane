import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEnquiryDraft } from "./useLeadEnquiry";

describe("temporary enquiry drafts", () => {
  it("isolates name, phone and consent across simultaneous instances without side effects", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const storage = vi.spyOn(Storage.prototype, "setItem");
    const { result, rerender } = renderHook(() => ({ first: useEnquiryDraft(), second: useEnquiryDraft() }));
    act(() => {
      result.current.first.setName("Synthetic First");
      result.current.first.setPhone("9876543210");
      result.current.first.setConsent(true);
    });
    expect(result.current.second).toMatchObject({ name: "", phone: "", consent: false });
    act(() => {
      result.current.second.setName("Synthetic Second");
      result.current.second.setPhone("8765432109");
      result.current.second.setConsent(true);
      result.current.first.setConsent(false);
    });
    rerender();
    expect(result.current.first).toMatchObject({ name: "Synthetic First", phone: "9876543210", consent: false });
    expect(result.current.second).toMatchObject({ name: "Synthetic Second", phone: "8765432109", consent: true });
    expect(fetch).not.toHaveBeenCalled();
    expect(storage).not.toHaveBeenCalled();
  });

  it("discards every field on unmount instead of rehydrating a draft", () => {
    const first = renderHook(() => useEnquiryDraft());
    act(() => {
      first.result.current.setName("Discard synthetic draft");
      first.result.current.setPhone("9876543210");
      first.result.current.setConsent(true);
    });
    first.unmount();
    const next = renderHook(() => useEnquiryDraft());
    expect(next.result.current).toMatchObject({ name: "", phone: "", consent: false });
  });
});
