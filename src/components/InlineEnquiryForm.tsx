import { useEffect, useRef } from "react";
import { ArrowRight, BadgePercent, CarFront, ShieldCheck } from "lucide-react";
import { useLeadEnquiry } from "../utils/useLeadEnquiry";
import { trackCampaignEvent } from "../utils/campaignAnalytics";

export function InlineEnquiryForm({
  sourceSection,
  action,
  onFocusChange,
}: {
  sourceSection: "hero_registration" | "final_site_visit";
  action: string;
  onFocusChange: (focused: boolean) => void;
}) {
  const {
    formAvailable,
    localPreview,
    name,
    setName,
    phone,
    setPhone,
    pending,
    saved,
    error,
    markStarted,
    submit,
  } = useLeadEnquiry("callback", sourceSection);
  const result = useRef<HTMLParagraphElement>(null);
  const id = sourceSection;
  useEffect(() => {
    if (saved) result.current?.focus();
  }, [saved]);

  return (
    <div
      className="inline-enquiry"
      onFocusCapture={() => onFocusChange(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          onFocusChange(false);
      }}
    >
      {saved ? (
        <p ref={result} className="inline-result" role="status" tabIndex={-1}>
          {localPreview
            ? "Development test enquiry recorded. No appointment is confirmed; no message was sent."
            : "Enquiry recorded. No appointment is confirmed."}
        </p>
      ) : (
        <form
          aria-label={sourceSection === "hero_registration" ? "Pre-registration" : "Site visit enquiry"}
          onChange={markStarted}
          onSubmit={(event) => {
            if (formAvailable && !pending)
              trackCampaignEvent("cta_click", {
                intent: "callback",
                source: sourceSection,
              });
            void submit(event);
          }}
          noValidate
        >
          <div className="inline-fields">
            <div className="inline-field">
              <label htmlFor={`${id}-name`}>Your name</label>
              <input
                id={`${id}-name`}
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                autoComplete={formAvailable ? "name" : "off"}
                maxLength={90}
                required
                disabled={!formAvailable || pending}
                aria-describedby={error ? `${id}-error` : formAvailable ? `${id}-consent` : undefined}
                aria-invalid={error ? true : undefined}
              />
            </div>
            <div className="inline-field">
              <label htmlFor={`${id}-phone`}>Mobile number</label>
              <input
                id={`${id}-phone`}
                name="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91  Mobile number"
                type="tel"
                inputMode="tel"
                autoComplete={formAvailable ? "tel" : "off"}
                maxLength={16}
                required
                disabled={!formAvailable || pending}
                aria-describedby={error ? `${id}-error` : formAvailable ? `${id}-consent` : undefined}
                aria-invalid={error ? true : undefined}
              />
            </div>
            <button
              className="button gold"
              type="submit"
              disabled={!formAvailable || pending}
            >
              {!formAvailable ? "Enquiries open soon" : pending ? "Sending request…" : action}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
          {formAvailable && (
            <p id={`${id}-consent`} className="form-notice">
              Use this number only to respond to this project enquiry.
              Campaign privacy information is pending approval.
            </p>
          )}
          {error && (
            <p id={`${id}-error`} className="form-error" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
      <ul className="cta-benefits" aria-label="Enquiry benefits">
        <li><BadgePercent size={17} aria-hidden="true" />Discounted price</li>
        <li><CarFront size={17} aria-hidden="true" />Free site visit with pickup</li>
        <li><ShieldCheck size={17} aria-hidden="true" />No spam</li>
      </ul>
    </div>
  );
}
