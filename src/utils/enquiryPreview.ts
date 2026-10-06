import type { FormEvent } from "react";

// UI request kinds are deliberately separate from the lead API's intent union.
export type EnquiryKind =
  | "price" | "master_plan" | "floor_plan" | "brochure" | "video"
  | "whatsapp" | "site_visit" | "registration" | "updates" | "enquiry";

const headings: Record<EnquiryKind, string> = {
  price: "Price enquiry",
  master_plan: "Master plan enquiry",
  floor_plan: "Floor plan enquiry",
  brochure: "Plans & brochure enquiry",
  video: "Project film enquiry",
  whatsapp: "WhatsApp enquiry",
  site_visit: "Site visit enquiry",
  registration: "Registration enquiry",
  updates: "Project updates enquiry",
  enquiry: "Project enquiry",
};

export function enquiryHeading(kind: EnquiryKind): string {
  return headings[kind];
}

// This handler has no payload creation, network or persistence path.
// It also blocks native form navigation if a disabled button is bypassed.
export function preventPreviewSubmission(event: Pick<FormEvent, "preventDefault">) {
  event.preventDefault();
}
