import { ArrowRight, BadgePercent, CarFront, ShieldCheck } from "lucide-react";

// Registration and site-visit cards share the modal enquiry route. They no
// longer hold competing drafts or submission handlers.
export function InlineEnquiryForm({ action, onOpen, onFocusChange }: {
  action: string;
  onOpen: () => void;
  onFocusChange: (focused: boolean) => void;
}) {
  return (
    <div className="inline-enquiry"
      onFocusCapture={() => onFocusChange(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onFocusChange(false);
      }}>
      <button className="button gold" type="button" onClick={onOpen}>
        {action}<ArrowRight size={16} aria-hidden="true" />
      </button>
      <ul className="cta-benefits" aria-label="Enquiry benefits">
        <li><BadgePercent size={17} aria-hidden="true" />Discounted price</li>
        <li><CarFront size={17} aria-hidden="true" />Free site visit with pickup</li>
        <li><ShieldCheck size={17} aria-hidden="true" />No spam</li>
      </ul>
    </div>
  );
}
