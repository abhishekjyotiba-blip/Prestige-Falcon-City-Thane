export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const phone =
    digits.length === 10
      ? `+91${digits}`
      : digits.length === 12 && digits.startsWith("91")
        ? `+${digits}`
        : "";
  return /^\+91[6-9]\d{9}$/.test(phone) ? phone : "";
}

type Enquiry = {
  name: string;
  phoneE164: string;
  intent: string;
  assetId?: string;
  sourceSection: string;
  attribution: Record<string, string>;
  consent: { noticeVersion: string; whatsappOptIn: boolean };
};
export type RetryRequest = { signature: string; key: string; body: string };

// The same enquiry keeps its key AND consent timestamp if the response is lost.
export function prepareRequest(
  enquiry: Enquiry,
  previous: RetryRequest | null,
): RetryRequest {
  const signature = JSON.stringify(enquiry);
  if (previous?.signature === signature) return previous;
  return {
    signature,
    key: crypto.randomUUID(),
    body: JSON.stringify({
      ...enquiry,
      consent: { ...enquiry.consent, capturedAt: new Date().toISOString() },
    }),
  };
}

export function isAcceptedResponse(
  status: number,
  data: unknown,
): data is {
  status: "accepted";
  leadId: string;
  asset: { status: "upcoming" | "available"; accessUrl?: string };
} {
  if (status !== 202 || !data || typeof data !== "object") return false;
  const value = data as Record<string, unknown>;
  if (
    value.status !== "accepted" ||
    typeof value.leadId !== "string" ||
    !value.leadId
  )
    return false;
  if (!value.asset || typeof value.asset !== "object") return false;
  const asset = value.asset as Record<string, unknown>;
  return asset.status === "upcoming" || asset.status === "available";
}
