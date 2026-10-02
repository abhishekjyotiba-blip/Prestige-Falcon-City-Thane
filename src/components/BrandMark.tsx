import prestigeLogo from "../assets/brand/prestige-logo.svg";
import "./BrandMark.css";

export function BrandMark() {
  return (
    <span className="campaign-brand-mark">
      <img src={prestigeLogo} width={48} height={59} alt="Prestige" />
      <span className="campaign-brand-descriptor">FALCON CITY <span>THANE</span></span>
    </span>
  );
}
