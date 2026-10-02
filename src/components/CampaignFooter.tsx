import { BrandMark } from "./BrandMark";
import "./CampaignFooter.css";

export function CampaignFooter() {
  return (
    <footer className="campaign-footer">
      <div className="campaign-footer-inner">
        <div className="campaign-footer-top">
          <BrandMark />
          <nav aria-label="Footer sections">
            <a href="#gallery">Gallery</a>
            <a href="#plans">Plans</a>
            <a href="#location">Location</a>
            <a href="#top">Back to top ↑</a>
          </nav>
        </div>
        <p className="campaign-footer-notice">
          Campaign preview · Project information, statutory details and privacy text await approval.
          Pricing and approved documents are not released here.
        </p>
      </div>
    </footer>
  );
}
