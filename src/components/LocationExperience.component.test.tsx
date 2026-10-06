import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LocationExperience } from "./LocationExperience";
import { MAP_PROJECT_IDENTITY, type ApprovedGoogleMap, type ApprovedMapPoint } from "../utils/googleMap";
vi.mock("./GoogleProjectMap", () => ({ GoogleProjectMap: ({ places, selectedId, onSelectPlace }: {
  places: ApprovedMapPoint[]; selectedId: string; onSelectPlace: (id: string) => void;
}) => <div aria-label="Mock Google map">{places.map((place) => <button key={place.id} aria-label={`Marker ${place.name}`} aria-pressed={(selectedId ?? places[0]?.id) === place.id} onClick={() => onSelectPlace(place.id)}>{place.name}</button>)}</div> }));
const site: ApprovedGoogleMap = { projectIdentity: MAP_PROJECT_IDENTITY, approvalStatus: "approved", verifiedOn: "2026-10-02",
  sourceUrl: "https://example.test/source", shareUrl: "https://maps.app.goo.gl/Synthetic", mapId: "synthetic-map-id", projectPin: { latitude: 0, longitude: 0 } };
const points: ApprovedMapPoint[] = Array.from({ length: 9 }, (_, index) => ({ id: `synthetic-${index}`, name: `Synthetic place ${index}`, category: "Connectivity",
  approvalStatus: "approved", sourceUrl: "https://example.test/source", verifiedOn: "2026-10-02", coordinates: { latitude: index, longitude: index } }));
afterEach(() => vi.unstubAllEnvs());
it("retains labelled schematic and five keyboard tabs with zero SDK network by default", () => {
  render(<LocationExperience />);
  expect(screen.getByText("Schematic · Not an actual map")).toBeTruthy();
  expect(screen.queryByLabelText("Mock Google map")).toBeNull();
  const education = screen.getByRole("tab", { name: "Education" });
  fireEvent.keyDown(screen.getByRole("tab", { name: "Connectivity" }), { key: "ArrowRight" });
  expect(education.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(education);
  expect(screen.getByRole("button", { name: "Example: School" })).toBeTruthy();
});
it("real mode synchronizes marker/list/page and never fills empty categories with example geography", () => {
  vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", `AIza${"x".repeat(35)}`);
  const view = render(<LocationExperience approvedMap={site} points={points} />);
  fireEvent.click(screen.getByRole("button", { name: "Marker Synthetic place 1" }));
  expect(screen.getByRole("button", { name: "Synthetic place 1" }).getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "Synthetic place 2" }));
  expect(screen.getByRole("button", { name: "Marker Synthetic place 2" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.queryByText(/Distance details for/)).toBeNull();
  expect(screen.getAllByText("Distance unavailable")).toHaveLength(4);
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.queryByRole("button", { name: "Marker Synthetic place 0" })).toBeNull();
  expect(screen.getByRole("button", { name: "Marker Synthetic place 4" }).getAttribute("aria-pressed")).toBe("true");
  view.rerender(<LocationExperience approvedMap={site} points={[points[0]]} />);
  expect(screen.getByRole("button", { name: "Marker Synthetic place 0" }).getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("tab", { name: "Healthcare" }));
  expect(screen.getByText("Nearby places pending verification")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Example/ })).toBeNull();
});
it("approved site without key keeps schematic plus safe link and approved local records", () => {
  vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", "");
  render(<LocationExperience approvedMap={site} points={points.slice(0, 1)} />);
  expect(screen.getByText("Schematic · Not an actual map")).toBeTruthy();
  expect(screen.queryByLabelText("Mock Google map")).toBeNull();
  expect(screen.getByRole("link", { name: "Open in Google Maps" }).getAttribute("href")).toBe(site.shareUrl);
  expect(screen.getByRole("button", { name: "Synthetic place 0" })).toBeTruthy();
});
