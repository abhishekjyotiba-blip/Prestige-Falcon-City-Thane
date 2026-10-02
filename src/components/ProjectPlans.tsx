import { ArrowUpRight } from "lucide-react";
import { PreviewArt } from "./PreviewArt";
import "./ProjectPlans.css";

export interface ProjectPlansProps {
  onRequest: (intent: "master_plan" | "floor_plan", source: string) => void;
}

export function ProjectPlans({ onRequest }: ProjectPlansProps) {
  return (
    <section className="project-plans" id="plans" aria-labelledby="plans-heading">
      <div className="project-plans-inner">
        <h2 id="plans-heading">Plans at a glance</h2>
        <div className="project-plans-grid">
          <article className="project-plan-card">
            <PreviewArt kind="master" />
            <div className="project-plan-copy">
              <h3>Master plan</h3>
              <p>Illustrative sample · Approved plan pending</p>
              <button type="button" onClick={() => onRequest("master_plan", "plans_master")}>
                Request master plan <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </div>
          </article>
          <article className="project-plan-card">
            <PreviewArt kind="floor" />
            <div className="project-plan-copy">
              <h3>Floor plans</h3>
              <p>Illustrative sample · Approved plan pending</p>
              <button type="button" className="project-plan-outline" onClick={() => onRequest("floor_plan", "plans_floor")}>
                Request floor plans <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
