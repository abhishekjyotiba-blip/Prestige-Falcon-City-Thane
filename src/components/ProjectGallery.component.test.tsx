import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectGallery } from "./ProjectGallery";
import type { GeneratedConceptRecord } from "../data/projectMedia";

const concepts: readonly GeneratedConceptRecord[] = [1, 2, 3].map((n) => ({
  id: `synthetic-${n}`, kind: "generated-concept", depiction: "ai-illustration", approvalStatus: "approved",
  generatedOn: "2026-10-06", generator: "Synthetic test only", conceptLabel: `Concept ${n}`,
  alt: `Illustrative synthetic scene ${n}, not actual project imagery`, image: { src: `/test-only/${n}.webp`, width: 600, height: 600 },
}));
let intersection: IntersectionObserverCallback;
let motion: ((event: MediaQueryListEvent) => void) | undefined;
let reduced = false;
const disconnect = vi.fn();
const scrollTo = vi.fn();
const removeMotion = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  reduced = false;
  motion = undefined;
  vi.stubGlobal("PointerEvent", MouseEvent);
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { intersection = callback; }
    observe() {}
    disconnect = disconnect;
  });
  vi.stubGlobal("matchMedia", vi.fn(() => ({ get matches() { return reduced; },
    addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => { motion = listener; },
    removeEventListener: removeMotion,
  })));
  vi.spyOn(HTMLElement.prototype, "scrollTo").mockImplementation(scrollTo);
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
function visible() { act(() => intersection([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)); }
function tick(ms = 6000) { act(() => { vi.advanceTimersByTime(ms); }); }
function mount() { const result = render(<ProjectGallery concepts={concepts} />); visible(); return result; }

describe("ProjectGallery concept DOM behavior", () => {
  it("keeps an honest single fallback without controls and rejects pending concepts", () => {
    render(<ProjectGallery concepts={[{ ...concepts[0], approvalStatus: "pending" }]} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText(/Project imagery pending verification/)).toBeTruthy();
  });
  it("advances gently without live announcements and stops at the final slide", () => {
    mount();
    tick();
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status").textContent).toBe("");
    tick(); tick();
    expect(scrollTo).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: "Next gallery image" }).getAttribute("aria-disabled")).toBe("true");
  });
  it("preserves real pointer Pause intent across the focus update and supports explicit Play", () => {
    mount();
    const pause = screen.getByRole("button", { name: "Pause gallery flow" });
    fireEvent.pointerDown(pause, { button: 0 });
    act(() => pause.focus());
    expect(pause.getAttribute("aria-label")).toBe("Play gallery flow");
    fireEvent.click(pause, { detail: 1 });
    tick(12000);
    expect(scrollTo).not.toHaveBeenCalled();
    fireEvent.pointerDown(pause, { button: 0 });
    fireEvent.click(pause, { detail: 1 });
    tick();
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });
  it("focus permanently stops flow until keyboard explicit Play; manual next also stops", () => {
    mount();
    const next = screen.getByRole("button", { name: "Next gallery image" });
    act(() => next.focus());
    fireEvent.blur(next, { relatedTarget: document.body });
    tick();
    expect(scrollTo).not.toHaveBeenCalled();
    const play = screen.getByRole("button", { name: "Play gallery flow" });
    fireEvent.keyDown(play, { key: "Enter" });
    fireEvent.click(play, { detail: 0 });
    tick();
    expect(scrollTo).toHaveBeenCalledTimes(1);
    fireEvent.click(next);
    tick(12000);
    expect(scrollTo).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("status").textContent).toMatch(/Image 3 of 3/);
  });
  it("pauses while hovered/invisible/document hidden and resumes only environmental pauses", () => {
    const { container } = mount();
    const region = container.querySelector('[aria-roledescription="carousel"]')!;
    fireEvent.mouseEnter(region); tick();
    expect(scrollTo).not.toHaveBeenCalled();
    fireEvent.mouseLeave(region);
    act(() => intersection([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    tick(); expect(scrollTo).not.toHaveBeenCalled();
    visible();
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange")); tick();
    expect(scrollTo).not.toHaveBeenCalled();
    hidden.mockReturnValue(false);
    fireEvent(document, new Event("visibilitychange")); tick();
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });
  it("starts paused for reduced motion and cancels an active timer on record changes/unmount", () => {
    reduced = true;
    const first = mount();
    tick(); expect(scrollTo).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Gallery flow paused for reduced motion" }) as HTMLButtonElement).disabled).toBe(true);
    first.unmount();
    reduced = false;
    const next = mount();
    expect(vi.getTimerCount()).toBe(1);
    next.rerender(<ProjectGallery concepts={[{ ...concepts[0], conceptLabel: "Reviewed replacement" }]} />);
    tick();
    expect(scrollTo).not.toHaveBeenCalled();
    next.unmount();
    const active = mount();
    expect(vi.getTimerCount()).toBe(1);
    active.unmount();
    expect(vi.getTimerCount()).toBe(0);
    tick(); expect(scrollTo).not.toHaveBeenCalled();
  });
  it("reduced motion disables flow and cleans observers/listeners/timers on unmount", () => {
    const removeVisibility = vi.spyOn(document, "removeEventListener");
    const { unmount } = mount();
    reduced = true;
    act(() => motion?.({ matches: true } as MediaQueryListEvent));
    const paused = screen.getByRole("button", { name: "Gallery flow paused for reduced motion" }) as HTMLButtonElement;
    expect(paused.disabled).toBe(true);
    tick(12000); expect(scrollTo).not.toHaveBeenCalled();
    unmount(); tick();
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(removeMotion).toHaveBeenCalledWith("change", expect.any(Function));
    expect(removeVisibility).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
  });
});
