import { Play } from "lucide-react";

export function PreviewArt({ kind }: { kind: "cost" | "master" | "floor" | "video" }) {
  if (kind === "video")
    return (
      <div className="preview-art video-art" aria-hidden="true">
        <span className="play-disc">
          <Play size={22} fill="currentColor" />
        </span>
        <span className="visual-stamp">VIDEO PREVIEW</span>
      </div>
    );
  if (kind === "cost")
    return (
      <div className="preview-art cost-art" aria-hidden="true">
        <div className="sample-sheet">
          <span className="sheet-head" />
          <span />
          <span />
          <span />
          <span />
          <span className="sheet-head" />
        </div>
        <span className="visual-stamp">ILLUSTRATIVE SAMPLE</span>
      </div>
    );
  if (kind === "master")
    return (
      <div className="preview-art plan-art master-art" aria-hidden="true">
        <svg viewBox="0 0 440 250">
          <path
            d="M18 43H423V222H18z M43 66h111v64H43z M185 57h100v52H185z M317 66h79v73h-79z M36 158h91v48H36z M168 144h115v62H168z M315 164h90v43h-90z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M145 42v184M302 43v181M20 146h403"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            opacity=".34"
          />
          <circle
            cx="222"
            cy="125"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
        <span className="visual-stamp">ILLUSTRATIVE SAMPLE</span>
      </div>
    );
  return (
    <div className="preview-art plan-art floor-art" aria-hidden="true">
      <svg viewBox="0 0 440 250">
        <path
          d="M46 23h346v205H46z M46 106h145V23 M190 106v122 M190 156h202 M282 23v133 M282 92h110 M93 106v122 M46 184h144"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M204 156a48 48 0 0 1 48-48M282 95a39 39 0 0 1-39 39M92 180a39 39 0 0 1 39-39"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <span className="visual-stamp">ILLUSTRATIVE SAMPLE</span>
    </div>
  );
}
