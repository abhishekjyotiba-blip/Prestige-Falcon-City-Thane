import {
  BookMarked,
  BookOpen,
  Dumbbell,
  Flower2,
  House,
  Monitor,
  Scissors,
  Sprout,
  Volleyball,
  Waves,
} from "lucide-react";
import "./AmenitiesOverview.css";

// Display examples only, not a verified project amenity list.
const amenityExamples = [
  { name: "Clubhouse", icon: House },
  { name: "Gym", icon: Dumbbell },
  { name: "Co-working pods", icon: Monitor },
  { name: "Library", icon: BookMarked },
  { name: "Salon", icon: Scissors },
  { name: "Swimming Pool", icon: Waves },
  { name: "Badminton Court", icon: Volleyball },
  { name: "Yoga Room", icon: Flower2 },
  { name: "Garden", icon: Sprout },
  { name: "Study Arena", icon: BookOpen },
];

export function AmenitiesOverview() {
  return (
    <section className="amenities-overview" aria-labelledby="amenities-overview-heading">
      <div className="amenities-overview__inner">
        <h2 id="amenities-overview-heading">Amenities at a glance</h2>
        <p className="amenities-overview__notice" id="amenities-overview-notice">
          Illustrative amenities · Final list pending
        </p>
        <ul className="amenities-overview__grid" aria-describedby="amenities-overview-notice" role="list">
          {amenityExamples.map(({ name, icon: Icon }) => (
            <li key={name}>
              <Icon size={30} strokeWidth={1.5} aria-hidden="true" focusable="false" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
