import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AmenitiesSlideshow } from "./AmenitiesSlideshow";
import type { GeneratedConceptRecord } from "../data/projectMedia";

const scene = (id: string): GeneratedConceptRecord => ({ id, kind: "generated-concept", depiction: "ai-illustration",
  approvalStatus: "approved", generatedOn: "2026-10-06", generator: "Synthetic test only", conceptLabel: id,
  alt: `Illustrative ${id}, not a confirmed project amenity`, image: { src: `/test-only/${id}.webp`, width: 800, height: 600 } });
const concepts = { amenities: [scene("Garden concept"), scene("Pool concept"), scene("Yoga concept")],
  facilities: [scene("Lounge concept"), scene("Library concept")] };
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("AmenitiesSlideshow manual DOM behavior", () => {
  it("shows truthful existing fallback without fake slides or navigation", () => {
    render(<AmenitiesSlideshow />);
    expect(screen.getByText(/Existing illustrative image/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Next feature image" })).toBeNull();
    fireEvent.click(screen.getByRole("tab", { name: "Facilities" }));
    expect(screen.getByText(/Existing illustrative image/)).toBeTruthy();
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
  it("supports arrows and direct controls, then resets to first image on category change", () => {
    render(<AmenitiesSlideshow concepts={concepts} />);
    fireEvent.click(screen.getByRole("button", { name: "Next feature image" }));
    expect(screen.getByRole("img").getAttribute("alt")).toContain("Pool concept");
    fireEvent.click(screen.getByRole("button", { name: /Show image 3/ }));
    expect(screen.getByText("3 / 3")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Previous feature image" }));
    expect(screen.getByText("2 / 3")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Facilities" }));
    expect(screen.getByRole("img").getAttribute("alt")).toContain("Lounge concept");
    expect(screen.getByText("1 / 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Amenities" }));
    expect(screen.getByText("1 / 3")).toBeTruthy();
    expect(screen.getByText(/AI-generated illustrative concept/)).toBeTruthy();
  });
  it("roves keyboard tab focus with Arrow/Home/End without taking vertical page keys", () => {
    render(<AmenitiesSlideshow concepts={concepts} />);
    const amenities = screen.getByRole("tab", { name: "Amenities" });
    const facilities = screen.getByRole("tab", { name: "Facilities" });
    fireEvent.keyDown(amenities, { key: "ArrowRight" });
    expect(document.activeElement).toBe(facilities);
    expect(facilities.getAttribute("aria-selected")).toBe("true");
    expect(amenities.tabIndex).toBe(-1);
    fireEvent.keyDown(facilities, { key: "Home" });
    expect(document.activeElement).toBe(amenities);
    fireEvent.keyDown(amenities, { key: "End" });
    expect(document.activeElement).toBe(facilities);
    fireEvent.keyDown(facilities, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(amenities);
    fireEvent.keyDown(amenities, { key: "ArrowDown" });
    expect(document.activeElement).toBe(amenities);
  });
  it("swipes horizontally but ignores vertical gestures and canceled touches", () => {
    const { container } = render(<AmenitiesSlideshow concepts={concepts} />);
    const figure = container.querySelector("figure")!;
    fireEvent.touchStart(figure, { touches: [{ clientX: 220, clientY: 100 }] });
    fireEvent.touchEnd(figure, { changedTouches: [{ clientX: 100, clientY: 110 }] });
    expect(screen.getByText("2 / 3")).toBeTruthy();
    fireEvent.touchStart(figure, { touches: [{ clientX: 220, clientY: 100 }] });
    fireEvent.touchEnd(figure, { changedTouches: [{ clientX: 100, clientY: 240 }] });
    expect(screen.getByText("2 / 3")).toBeTruthy();
    fireEvent.touchStart(figure, { touches: [{ clientX: 220, clientY: 100 }] });
    fireEvent.touchCancel(figure);
    fireEvent.touchEnd(figure, { changedTouches: [{ clientX: 100, clientY: 110 }] });
    expect(screen.getByText("2 / 3")).toBeTruthy();
  });
  it("replaces failed sources/variants truthfully and resets on slide/category/data changes", () => {
    const records = { ...concepts, amenities: [{ ...concepts.amenities[0], variants: [{ src: "/test-only/garden-small.webp", width: 400, height: 300 }] }, ...concepts.amenities.slice(1)] };
    const { rerender } = render(<AmenitiesSlideshow concepts={records} />);
    const failed = screen.getByRole("img");
    expect(failed.getAttribute("srcset")).toContain("garden-small.webp");
    fireEvent.error(failed);
    expect(failed.getAttribute("src")).toContain("temporary-illustrative-exterior");
    expect(failed.getAttribute("srcset")).toBeNull();
    expect(failed.getAttribute("alt")).toContain("not a rendering of this project");
    expect(screen.getByText(/Image unavailable · Existing illustrative image/)).toBeTruthy();
    expect(screen.queryByText(/AI-generated illustrative concept/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Next feature image" }));
    expect(screen.getByRole("img").getAttribute("src")).toBe(concepts.amenities[1].image.src);
    fireEvent.error(screen.getByRole("img"));
    fireEvent.click(screen.getByRole("tab", { name: "Facilities" }));
    expect(screen.getByRole("img").getAttribute("src")).toBe(concepts.facilities[0].image.src);
    fireEvent.error(screen.getByRole("img"));
    rerender(<AmenitiesSlideshow concepts={{ ...records, facilities: [{ ...concepts.facilities[0], image: { ...concepts.facilities[0].image, src: "/test-only/replacement.webp" } }] }} />);
    expect(screen.getByRole("img").getAttribute("src")).toBe("/test-only/replacement.webp");
    expect(screen.getByText(/AI-generated illustrative concept/)).toBeTruthy();
  });
  it("never auto-advances a manual slideshow", () => {
    vi.useFakeTimers();
    render(<AmenitiesSlideshow concepts={concepts} />);
    act(() => { vi.advanceTimersByTime(60000); });
    expect(screen.getByText("1 / 3")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("");
    expect(vi.getTimerCount()).toBe(0);
  });
  it("resets safely when approved records change and never adds autoplay controls", () => {
    const { rerender } = render(<AmenitiesSlideshow concepts={concepts} />);
    fireEvent.click(screen.getByRole("button", { name: /Show image 3/ }));
    rerender(<AmenitiesSlideshow concepts={{ ...concepts, amenities: [concepts.amenities[0]] }} />);
    expect(screen.getByText("1 / 1")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Play|Pause/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Next feature image" })).toBeNull();
  });
});
