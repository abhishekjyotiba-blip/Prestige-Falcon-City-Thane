import { useId, type RefObject } from "react";
import { LockKeyhole } from "lucide-react";
import { useEnquiryDraft } from "../utils/useLeadEnquiry";
import { preventPreviewSubmission } from "../utils/enquiryPreview";

export function EnquiryForm({ firstInput }: {
  firstInput: RefObject<HTMLInputElement | null>;
}) {
  const id = useId();
  const draft = useEnquiryDraft();
  return (
    <form className="enquiry-form" onSubmit={preventPreviewSubmission} autoComplete="off" noValidate>
      <label htmlFor={`${id}-name`}>Your name</label>
      <input ref={firstInput} id={`${id}-name`} name="name" type="text"
        value={draft.name} onChange={(event) => draft.setName(event.target.value)}
        placeholder="Enter your full name" maxLength={90} autoComplete="off"
        aria-describedby={`${id}-notice`} />
      <label htmlFor={`${id}-phone`}>Mobile number</label>
      <div className="enquiry-phone">
        <span aria-hidden="true">+91</span>
        <input id={`${id}-phone`} name="phone" type="tel" inputMode="numeric"
          value={draft.phone} onChange={(event) => draft.setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="10-digit mobile number" maxLength={10} autoComplete="off"
          aria-describedby={`${id}-prefix ${id}-notice`} />
      </div>
      <span id={`${id}-prefix`} className="sr-only">Country code plus 91</span>
      <label className="enquiry-consent">
        <input type="checkbox" checked={draft.consent} onChange={(event) => draft.setConsent(event.target.checked)} />
        <span>I agree to contact about this enquiry when submissions are enabled. This preview does not record consent.</span>
      </label>
      <button type="submit" className="button gold enquiry-submit" disabled>
        <LockKeyhole size={16} aria-hidden="true" /> Enquiries open soon
      </button>
      <p id={`${id}-notice`} className="enquiry-status">
        Preview only. Details are not submitted or saved. No subscription, WhatsApp message or document delivery is created.
      </p>
    </form>
  );
}
