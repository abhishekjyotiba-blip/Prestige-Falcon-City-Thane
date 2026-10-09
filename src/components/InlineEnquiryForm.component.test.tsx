import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineEnquiryForm } from "./InlineEnquiryForm";

describe("inline enquiry CTA cards", () => {
  it("routes each card to its own opener without a competing form or API submission", () => {
    const registration = vi.fn();
    const visit = vi.fn();
    const fetch = vi.spyOn(globalThis, "fetch");
    const { container } = render(<>
      <InlineEnquiryForm action="Express your interest" onOpen={registration} onFocusChange={vi.fn()} />
      <InlineEnquiryForm action="Request a site visit" onOpen={visit} onFocusChange={vi.fn()} />
    </>);
    const primary = screen.getByRole("button", { name: "Express your interest" });
    const final = screen.getByRole("button", { name: "Request a site visit" });
    expect(primary.getAttribute("type")).toBe("button");
    expect(final.getAttribute("type")).toBe("button");
    fireEvent.click(primary);
    expect(registration).toHaveBeenCalledOnce();
    expect(visit).not.toHaveBeenCalled();
    fireEvent.click(final);
    expect(visit).toHaveBeenCalledOnce();
    expect(registration).toHaveBeenCalledOnce();
    expect(container.querySelector("form, input, textarea")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getAllByRole("list", { name: "Enquiry benefits" })).toHaveLength(2);
  });

  it("reports focus separately for each card and clears it only when focus leaves the card", () => {
    const primaryFocus = vi.fn();
    const finalFocus = vi.fn();
    render(<>
      <InlineEnquiryForm action="Express your interest" onOpen={vi.fn()} onFocusChange={primaryFocus} />
      <InlineEnquiryForm action="Request a site visit" onOpen={vi.fn()} onFocusChange={finalFocus} />
      <button>Outside</button>
    </>);
    const primary = screen.getByRole("button", { name: "Express your interest" });
    const final = screen.getByRole("button", { name: "Request a site visit" });
    act(() => primary.focus());
    expect(primaryFocus.mock.calls).toEqual([[true]]);
    expect(finalFocus).not.toHaveBeenCalled();
    // Guard against clearing card focus for an internal relatedTarget.
    fireEvent.blur(primary, { relatedTarget: primary });
    expect(primaryFocus.mock.calls).toEqual([[true]]);
    act(() => final.focus());
    expect(primaryFocus.mock.calls).toEqual([[true], [false]]);
    expect(finalFocus.mock.calls).toEqual([[true]]);
    act(() => screen.getByRole("button", { name: "Outside" }).focus());
    expect(finalFocus.mock.calls).toEqual([[true], [false]]);
  });
});
