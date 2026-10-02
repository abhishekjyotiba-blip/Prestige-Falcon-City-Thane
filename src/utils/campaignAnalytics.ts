type CampaignEvent =
  | "cta_click"
  | "form_open"
  | "form_start"
  | "form_unavailable"
  | "form_validation_error"
  | "lead_request_failed"
  | "development_lead_saved"
  | "lead_success"
  | "scroll_depth";

// Deliberately exclude names, phone numbers, enquiry text, and complete URLs.
export function trackCampaignEvent(
  event: CampaignEvent,
  details: {
    intent?: string;
    source?: string;
    depth?: number;
  } = {},
) {
  if (typeof window === "undefined") return;
  const target = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  target.dataLayer ??= [];
  target.dataLayer.push({
    event,
    project: "Prestige Falcon City Thane",
    ...details,
  });
}
