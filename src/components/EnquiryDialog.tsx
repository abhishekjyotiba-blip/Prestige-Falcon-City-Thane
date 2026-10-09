import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";
import { enquiryHeading, type EnquiryKind } from "../utils/enquiryPreview";
import "./EnquiryDialog.css";

export function EnquiryDialog({ kind, sourceSection, onClose, returnFocus }: {
  kind: EnquiryKind;
  sourceSection: string;
  onClose: () => void;
  returnFocus: HTMLElement | null;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTask = requestAnimationFrame(() => firstInput.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const elements = [...(dialog.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled])",
      ) ?? [])];
      const index = elements.indexOf(document.activeElement as HTMLElement);
      if (index === -1 || (!event.shiftKey && index === elements.length - 1)) {
        event.preventDefault(); elements[0]?.focus();
      } else if (event.shiftKey && index === 0) {
        event.preventDefault(); elements.at(-1)?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusTask);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = before;
      // Synchronous cleanup avoids a stale scheduled return-focus stealing the
      // initial focus if StrictMode remounts or another request opens at once.
      if (returnFocus?.isConnected) returnFocus.focus();
      else document.querySelector<HTMLElement>(
        window.matchMedia("(max-width: 700px)").matches
          ? ".site-header .menu-toggle" : ".site-header .nav-action",
      )?.focus();
    };
  }, [onClose, returnFocus]);
  return (
    <div className="enquiry-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div ref={dialog} className="enquiry-dialog" role="dialog" aria-modal="true"
        aria-labelledby="enquiry-title" aria-describedby="enquiry-availability" data-source={sourceSection}>
        <div className="enquiry-handle" aria-hidden="true" />
        <div className="enquiry-dialog__header">
          <span className="eyebrow">PRESTIGE · THANE</span>
          <button type="button" onClick={onClose} aria-label="Close enquiry form"><X size={22} aria-hidden="true" /></button>
        </div>
        <h2 id="enquiry-title">{enquiryHeading(kind)}</h2>
        <p className="enquiry-purpose" id="enquiry-availability">Enquiries are not connected yet. You can edit this form, but nothing is sent or saved.</p>
        <EnquiryForm key={`${kind}:${sourceSection}`} firstInput={firstInput} />
      </div>
    </div>
  );
}
