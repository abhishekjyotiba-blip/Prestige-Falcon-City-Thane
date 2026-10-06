import { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EnquiryDialog } from "./EnquiryDialog";

function show() {
  const opener = document.createElement("button");
  document.body.append(opener);
  opener.focus();
  const close = vi.fn();
  const view = render(<StrictMode><EnquiryDialog kind="price" sourceSection="hero_price" onClose={close} returnFocus={opener} /></StrictMode>);
  return { ...view, opener, close };
}

describe("shared noncollecting enquiry dialog", () => {
  it("focuses an editable name field and blocks every submission path", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Unexpected preview request"));
    const local = vi.spyOn(Storage.prototype, "setItem");
    const { unmount, opener } = show();
    const name = screen.getByLabelText("Your name");
    await waitFor(() => expect(document.activeElement).toBe(name));
    fireEvent.change(name, { target: { value: "Synthetic Example" } });
    const phone = screen.getByLabelText("Mobile number") as HTMLInputElement;
    fireEvent.change(phone, { target: { value: "98765abc43210123" } });
    expect(phone.value).toBe("9876543210");
    fireEvent.click(screen.getByRole("checkbox"));
    expect((screen.getByRole("button", { name: "Enquiries open soon" }) as HTMLButtonElement).disabled).toBe(true);
    const event = new Event("submit", { bubbles: true, cancelable: true });
    act(() => name.closest("form")!.dispatchEvent(event));
    expect(event.defaultPrevented).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
    expect(local).not.toHaveBeenCalled();
    expect(screen.queryByText(/Thank you|Request recorded/)).toBeNull();
    unmount();
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it("traps keyboard focus, handles Escape/backdrop and restores body scrolling", async () => {
    document.body.style.overflow = "auto";
    const { close, unmount, opener } = show();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText("Your name")));
    expect(document.body.style.overflow).toBe("hidden");
    const checkbox = screen.getByRole("checkbox");
    checkbox.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    const closeButton = screen.getByRole("button", { name: "Close enquiry form" });
    expect(document.activeElement).toBe(closeButton);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(checkbox);
    opener.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(closeButton);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(close).toHaveBeenCalledTimes(1);
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(close).toHaveBeenCalledTimes(1);
    fireEvent.mouseDown(document.querySelector(".enquiry-backdrop")!);
    expect(close).toHaveBeenCalledTimes(2);
    unmount();
    expect(document.body.style.overflow).toBe("auto");
    opener.remove();
  });

  it("resets temporary drafts when the request context changes", () => {
    const { rerender, unmount, opener, close } = show();
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Discard me" } });
    rerender(<EnquiryDialog kind="updates" sourceSection="updates_pending" onClose={close} returnFocus={opener} />);
    expect((screen.getByLabelText("Your name") as HTMLInputElement).value).toBe("");
    expect(screen.getByRole("heading", { name: "Project updates enquiry" })).toBeTruthy();
    unmount(); opener.remove();
  });
});
