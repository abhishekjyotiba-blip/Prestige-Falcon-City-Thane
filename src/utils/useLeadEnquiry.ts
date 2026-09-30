import { useRef, useState, type FormEvent } from "react";
import { trackCampaignEvent } from "./campaignAnalytics";
import {
  isAcceptedResponse,
  normalizePhone,
  prepareRequest,
  type RetryRequest,
} from "./leadRequest";

export type EnquiryIntent =
  | "price"
  | "master_plan"
  | "floor_plan"
  | "video"
  | "callback";

// Every form uses the same readiness boundary and submission contract.
export function useLeadEnquiry(intent: EnquiryIntent, sourceSection: string) {
  const localPreview = ["localhost", "127.0.0.1"].includes(
    window.location.hostname,
  );
  const formAvailable =
    (localPreview &&
      import.meta.env.DEV &&
      import.meta.env.VITE_PRIVATE_LOCAL_PREVIEW === true) ||
    (import.meta.env.PROD && import.meta.env.VITE_LEAD_FORM_READY === "true");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const retryRequest = useRef<RetryRequest | null>(null);
  const started = useRef(false);
  const inFlight = useRef(false);

  function markStarted() {
    if (formAvailable && !started.current) {
      started.current = true;
      trackCampaignEvent("form_start", { intent, source: sourceSection });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formAvailable || inFlight.current || saved) return;
    setError("");
    const phoneE164 = normalizePhone(phone);
    if (name.trim().length < 2 || !phoneE164) {
      setError("Enter your name and a valid Indian mobile number.");
      trackCampaignEvent("form_validation_error", {
        intent,
        source: sourceSection,
      });
      return;
    }
    inFlight.current = true;
    setPending(true);
    try {
      const url = new URLSearchParams(location.search);
      const attribution = Object.fromEntries(
        [
          "utmSource",
          "utmMedium",
          "utmCampaign",
          "utmTerm",
          "utmContent",
          "gclid",
        ].map((key) => [
          key,
          (
            url.get(key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)) || ""
          ).slice(0, 120),
        ]),
      );
      retryRequest.current = prepareRequest(
        {
          name: name.trim(),
          phoneE164,
          intent,
          assetId: intent === "callback" ? undefined : intent,
          sourceSection,
          attribution,
          consent: { noticeVersion: "preview-v1", whatsappOptIn },
        },
        retryRequest.current,
      );
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": retryRequest.current.key,
        },
        body: retryRequest.current.body,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          response.status === 503
            ? "Enquiries are not yet available. Please try again after the campaign contact is connected."
            : typeof data.error?.message === "string"
              ? data.error.message
              : "We could not save your request. Please try again.",
        );
      // Static hosts can return HTTP 200 HTML for an unknown API route.
      if (!isAcceptedResponse(response.status, data))
        throw new Error(
          "Enquiries are not yet available. Please try again after the campaign contact is connected.",
        );
      if (
        data.asset.status === "available" &&
        typeof data.asset.accessUrl === "string" &&
        data.asset.accessUrl.startsWith("/api/assets/")
      )
        window.open(data.asset.accessUrl, "_blank", "noopener,noreferrer");
      setSaved(true);
      trackCampaignEvent(
        localPreview ? "development_lead_saved" : "lead_success",
        { intent, source: sourceSection },
      );
    } catch (cause) {
      trackCampaignEvent("lead_request_failed", { intent, source: sourceSection });
      setError(
        cause instanceof Error
          ? cause.message
          : "We could not save your request. Please try again.",
      );
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return {
    formAvailable,
    localPreview,
    name,
    setName,
    phone,
    setPhone,
    whatsappOptIn,
    setWhatsappOptIn,
    pending,
    saved,
    error,
    markStarted,
    submit,
  };
}
