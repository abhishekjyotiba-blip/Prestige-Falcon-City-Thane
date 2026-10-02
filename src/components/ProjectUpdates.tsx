import { useEffect, useRef } from "react";
import { ArrowRight, Bell, X } from "lucide-react";
import "./ProjectUpdates.css";

export function ProjectUpdates({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="project-updates" aria-labelledby="updates-heading">
      <div className="project-updates__card">
        <div>
          <span className="eyebrow"><Bell size={13} aria-hidden="true" /> AT YOUR PACE</span>
          <h2 id="updates-heading">Not ready to enquire?</h2>
          <p>Keep an eye on project updates.</p>
        </div>
        <button className="button dark" type="button" onClick={onOpen}>
          Keep me updated <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

/** No callback or subscription is created by this unavailable-channel dialog. */
export function UpdatesUnavailableDialog({
  onClose,
  returnFocus,
}: {
  onClose: () => void;
  returnFocus: HTMLElement | null;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const focusTask = useRef<number | null>(null);

  useEffect(() => {
    if (focusTask.current !== null) cancelAnimationFrame(focusTask.current);
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    focusTask.current = requestAnimationFrame(() => closeButton.current?.focus());
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const buttons = [...(dialog.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? [])];
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (index === -1 || (event.shiftKey && index === 0) || (!event.shiftKey && index === buttons.length - 1)) {
        event.preventDefault();
        (event.shiftKey ? buttons.at(-1) : buttons[0])?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("keydown", onKeyDown);
      if (focusTask.current !== null) cancelAnimationFrame(focusTask.current);
      focusTask.current = requestAnimationFrame(() => {
        if (returnFocus?.isConnected) returnFocus.focus();
        else {
          const fallback = window.matchMedia("(max-width: 700px)").matches
            ? ".site-header .menu-toggle"
            : ".site-header .nav-action";
          document.querySelector<HTMLElement>(fallback)?.focus();
        }
      });
    };
  }, [onClose, returnFocus]);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div ref={dialog} className="request-dialog updates-dialog" role="dialog" aria-modal="true" aria-labelledby="updates-dialog-title">
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close updates notice"><X size={21} /></button>
        <span className="eyebrow">PROJECT UPDATES</span>
        <h2 id="updates-dialog-title">Updates open soon.</h2>
        <p>Updates aren't connected yet. This preview does not subscribe you or collect contact details.</p>
        <button ref={closeButton} className="button dark" type="button" onClick={onClose}>Close <ArrowRight size={16} aria-hidden="true" /></button>
      </div>
    </div>
  );
}
