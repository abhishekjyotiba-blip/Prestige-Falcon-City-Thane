import { ArrowRight, Bell } from "lucide-react";
import "./ProjectUpdates.css";

export function ProjectUpdates({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="project-updates" aria-labelledby="updates-heading">
      <div className="project-updates__card">
        <div>
          <span className="eyebrow"><Bell size={13} aria-hidden="true" /> AT YOUR PACE</span>
          <h2 id="updates-heading">Not ready to enquire?</h2>
          <p>Keep an eye on project updates.</p>
        </div>
        <button className="button dark" type="button" onClick={onOpen}>
          Keep me updated <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
