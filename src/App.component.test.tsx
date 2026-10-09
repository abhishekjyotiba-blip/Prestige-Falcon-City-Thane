import { act, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("enquiry CTA routing", () => {
  beforeEach(() => {
    (window as Window & { dataLayer?: unknown[] }).dataLayer = [];
  });
  const routes = [
    ["Enquire", "Project enquiry", "header"],
    ["Get latest price", "Price enquiry", "hero_price"],
    ["View plans & brochure", "Plans & brochure enquiry", "hero_plans"],
    ["Chat on WhatsApp", "WhatsApp enquiry", "hero_whatsapp"],
    ["Express your interest", "Registration enquiry", "hero_registration"],
    ["Request price update; approved material pending", "Price enquiry", "preview_price"],
    ["Request master plan; approved material pending", "Master plan enquiry", "preview_master_plan"],
    ["Request floor plans; approved material pending", "Floor plan enquiry", "preview_floor_plan"],
    ["Request video update; approved material pending", "Project film enquiry", "preview_video"],
    ["Request master plan", "Master plan enquiry", "plans_master"],
    ["Request floor plans", "Floor plan enquiry", "plans_floor"],
    ["Request a site visit", "Site visit enquiry", "final_site_visit"],
    ["Keep me updated", "Project updates enquiry", "updates_pending"],
  ];
  it.each(routes)("%s opens the shared editable form", async (button, heading, source) => {
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Unexpected request"));
    render(<App />);
    const nameMatcher = ["Get latest price", "View plans & brochure", "Chat on WhatsApp"].includes(button)
      ? new RegExp(button) : button;
    const opener = screen.getByRole("button", { name: nameMatcher });
    opener.focus(); fireEvent.click(opener);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: heading })).toBeTruthy();
    expect(dialog.getAttribute("data-source")).toBe(source);
    const name = within(dialog).getByLabelText("Your name") as HTMLInputElement;
    expect(name.disabled).toBe(false);
    fireEvent.change(name, { target: { value: "Synthetic Route Check" } });
    fireEvent.change(within(dialog).getByLabelText("Mobile number"), { target: { value: "9876543210" } });
    fireEvent.submit(name.closest("form")!);
    expect(fetch).not.toHaveBeenCalled();
    expect(JSON.stringify((window as Window & { dataLayer?: unknown[] }).dataLayer)).not.toContain("Synthetic Route Check");
    expect(JSON.stringify((window as Window & { dataLayer?: unknown[] }).dataLayer)).not.toContain("9876543210");
    await waitFor(() => expect(document.activeElement).toBe(name));
    fireEvent.click(within(dialog).getByRole("button", { name: "Close enquiry form" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
    fireEvent.click(opener);
    expect((screen.getByLabelText("Your name") as HTMLInputElement).value).toBe("");
  });

  it("keeps navigation and feature tabs out of the enquiry flow", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: "Experience" }).getAttribute("href")).toBe("#amenities");
    fireEvent.click(screen.getByRole("tab", { name: /Facilities/ }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("routes both sticky actions and suppresses the sticky bar while a form is open", () => {
    const original = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        this.callback([{ target, isIntersecting: false } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
    try {
      render(<App />);
      const price = screen.getByRole("button", { name: "Get price update" });
      fireEvent.click(price);
      expect(screen.getByRole("heading", { name: "Price enquiry" })).toBeTruthy();
      expect(document.querySelector(".sticky-actions")).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Close enquiry form" }));
      fireEvent.click(screen.getByRole("button", { name: "WhatsApp enquiry" }));
      expect(screen.getByRole("heading", { name: "WhatsApp enquiry" })).toBeTruthy();
      expect(screen.getByRole("dialog").getAttribute("data-source")).toBe("sticky_whatsapp");
    } finally { globalThis.IntersectionObserver = original; }
  });

  it("preserves registration-focus visibility and final-section sticky suppression", () => {
    const original = globalThis.IntersectionObserver;
    const observers = new Map<Element, IntersectionObserverCallback>();
    globalThis.IntersectionObserver = class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(target: Element) { observers.set(target, this.callback); }
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
    const visible = (selector: string, isIntersecting: boolean) => {
      const target = document.querySelector(selector)!;
      act(() => observers.get(target)!([{ target, isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver));
    };
    try {
      render(<App />);
      visible(".hero", false); visible(".registration-section", true); visible(".closing-section", false);
      expect(document.querySelector(".sticky-actions")).not.toBeNull();
      act(() => screen.getByRole("button", { name: "Express your interest" }).focus());
      expect(document.querySelector(".sticky-actions")).toBeNull();
      visible(".registration-section", false);
      expect(document.querySelector(".sticky-actions")).not.toBeNull();
      visible(".registration-section", true);
      expect(document.querySelector(".sticky-actions")).toBeNull();
      act(() => screen.getByRole("button", { name: "Express your interest" }).blur());
      visible(".closing-section", true);
      expect(document.querySelector(".sticky-actions")).toBeNull();
      visible(".closing-section", false);
      expect(document.querySelector(".sticky-actions")).not.toBeNull();
    } finally { globalThis.IntersectionObserver = original; }
  });
});
