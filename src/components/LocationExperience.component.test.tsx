import { fireEvent, render, screen, within } from "@testing-library/react";
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

// All coordinates, approval metadata and measurements below are synthetic fixtures.
// The mocked child tests parent rendering/state, not Google authorization or geography.
const renderModes = ["schematic", "approved mock map"] as const;
type RenderMode = typeof renderModes[number];
function modeProps(mode: RenderMode) {
  vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", mode === "approved mock map" ? `AIza${"x".repeat(35)}` : "");
  return mode === "approved mock map" ? { approvedMap: site } : {};
}
function marker(mode: RenderMode, name: string) {
  return screen.getByRole("button", { name: `${mode === "schematic" ? "Select" : "Marker"} ${name}` });
}
function listPlace(name: string) {
  return within(screen.getByRole("tabpanel")).getByRole("button", { name });
}
function expectSelected(mode: RenderMode, name: string) {
  expect(marker(mode, name).getAttribute("aria-pressed")).toBe("true");
  const panel = screen.getByRole("tabpanel");
  expect(within(panel).getAllByRole("button").filter((button) => button.getAttribute("aria-pressed") === "true")).toHaveLength(1);
  expect(within(panel).getByRole("button", { name: new RegExp(`^${name}(?:,|$)`) }).getAttribute("aria-pressed")).toBe("true");
}

it.each(renderModes)("%s: renders full roving tab focus, wrapping and ARIA associations", (mode) => {
  render(<LocationExperience {...modeProps(mode)} points={points} />);
  const tabs = within(screen.getByRole("tablist", { name: "Neighbourhood categories" })).getAllByRole("tab");
  const panel = screen.getByRole("tabpanel");
  const assertTab = (index: number) => {
    tabs.forEach((tab, tabIndex) => {
      expect(tab.getAttribute("aria-selected")).toBe(String(tabIndex === index));
      expect(tab.tabIndex).toBe(tabIndex === index ? 0 : -1);
      expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    });
    expect(panel.getAttribute("aria-labelledby")).toBe(tabs[index].id);
    expect(document.getElementById(panel.getAttribute("aria-describedby")!)).not.toBeNull();
    expect(document.activeElement).toBe(tabs[index]);
    expect(screen.getByRole("status").textContent).toContain(tabs[index].textContent);
  };
  tabs[0].focus();
  assertTab(0);
  // Both full traversals include their respective end-to-start wrap.
  for (let index = 1; index <= tabs.length; index++) {
    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    assertTab(index % tabs.length);
  }
  for (let index = 1; index <= tabs.length; index++) {
    fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
    assertTab((tabs.length - index) % tabs.length);
  }
  fireEvent.keyDown(tabs[0], { key: "End" });
  assertTab(4);
  fireEvent.keyDown(tabs[4], { key: "Home" });
  assertTab(0);
  fireEvent.keyDown(tabs[0], { key: "ArrowDown" });
  assertTab(0);
});

it.each(renderModes)("%s: marker and list selection remain synchronized across pagination, category reset and shrinking data", (mode) => {
  const props = modeProps(mode);
  const education: ApprovedMapPoint = { ...points[0], id: "synthetic-school", name: "Synthetic school", category: "Education" };
  const view = render(<LocationExperience {...props} points={[...points, education]} />);
  expectSelected(mode, points[0].name);
  fireEvent.click(marker(mode, points[1].name));
  expectSelected(mode, points[1].name);
  expect(marker(mode, points[0].name).getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(listPlace(points[2].name));
  expectSelected(mode, points[2].name);
  expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expectSelected(mode, points[4].name);
  expect(screen.queryByRole("button", { name: `${mode === "schematic" ? "Select" : "Marker"} ${points[2].name}` })).toBeNull();
  expect(screen.getByRole("list").getAttribute("start")).toBe("5");
  fireEvent.click(listPlace(points[6].name));
  expectSelected(mode, points[6].name);
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expectSelected(mode, points[8].name);
  expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  expectSelected(mode, points[4].name);
  fireEvent.click(screen.getByRole("tab", { name: "Education" }));
  expectSelected(mode, education.name);
  expect(screen.queryByRole("navigation", { name: /place pages/ })).toBeNull();
  fireEvent.click(screen.getByRole("tab", { name: "Connectivity" }));
  expectSelected(mode, points[0].name);
  expect(screen.getByText("Page 1 of 3")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  view.rerender(<LocationExperience {...props} points={points.slice(0, 5)} />);
  expect(screen.getByText("Page 2 of 2")).toBeTruthy();
  expectSelected(mode, points[4].name);
  view.rerender(<LocationExperience {...props} points={[points[0]]} />);
  expectSelected(mode, points[0].name);
  expect(screen.getByRole("list").getAttribute("start")).toBe("1");
  expect(screen.queryByRole("navigation", { name: /place pages/ })).toBeNull();
});

const distanceModes = [
  { mode: "driving", label: "Driving route", value: 2.5, unit: "km" },
  { mode: "walking", label: "Walking route", value: 350, unit: "m" },
  { mode: "transit", label: "Transit route", value: 4, unit: "km" },
  { mode: "straight-line", label: "Straight-line", value: 600, unit: "m" },
] as const;
for (const renderMode of renderModes) {
  it.each(distanceModes)(`${renderMode}: discloses sourced $mode measurements only for the selected applicable record`, (measurement) => {
    const measured: ApprovedMapPoint = { ...points[0], distance: {
      mode: measurement.mode, value: measurement.value, unit: measurement.unit,
      source: "Synthetic measured route source", observedOn: "2026-10-01",
    } };
    render(<LocationExperience {...modeProps(renderMode)} points={[measured, points[1]]} />);
    const label = `${measured.name}, ${measurement.value} ${measurement.unit}, ${measurement.label}`;
    expect(listPlace(label).getAttribute("aria-pressed")).toBe("true");
    expect(within(listPlace(label)).getByText(`${measurement.value} ${measurement.unit}`)).toBeTruthy();
    const summary = screen.getByText(`Distance details for ${measured.name}`);
    const details = summary.closest("details")!;
    expect(details.open).toBe(false);
    fireEvent.click(summary);
    expect(details.open).toBe(true);
    expect(within(details).getByText(`${measurement.label} · Synthetic measured route source · 2026-10-01`)).toBeTruthy();
    expect(within(details).getByText("Actual routes and distances may vary.")).toBeTruthy();
    expect(screen.getAllByText(/Distance details for/)).toHaveLength(1);
    fireEvent.click(listPlace(points[1].name));
    expectSelected(renderMode, points[1].name);
    expect(screen.queryByText(/Distance details for/)).toBeNull();
    expect(screen.queryByText(/Synthetic measured route source/)).toBeNull();
    expect(within(listPlace(points[1].name)).getByText("Distance unavailable")).toBeTruthy();
    fireEvent.click(marker(renderMode, measured.name));
    expect(screen.getByText(`Distance details for ${measured.name}`).closest("details")!.open).toBe(false);
  });
}

it.each(renderModes)("%s: replaces and closes disclosures on selection/page/category changes without leaking stale sources", (mode) => {
  const measured = points.map((point, index): ApprovedMapPoint => ({ ...point, distance: {
    value: index + 1, unit: "km", mode: "driving", source: `Synthetic source ${index}`, observedOn: "2026-10-01",
  } }));
  render(<LocationExperience {...modeProps(mode)} points={measured} />);
  const open = (index: number) => {
    const details = screen.getByText(`Distance details for ${points[index].name}`).closest("details")!;
    expect(details.open).toBe(false);
    fireEvent.click(within(details).getByText(`Distance details for ${points[index].name}`));
    expect(details.open).toBe(true);
  };
  open(0);
  fireEvent.click(marker(mode, points[1].name));
  expect(screen.queryByText(/Synthetic source 0/)).toBeNull();
  open(1);
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.queryByText(/Synthetic source 1/)).toBeNull();
  open(4);
  fireEvent.click(screen.getByRole("tab", { name: "Education" }));
  expect(screen.queryByText(/Distance details for/)).toBeNull();
  expect(screen.queryByText(/Synthetic source/)).toBeNull();
  fireEvent.click(screen.getByRole("tab", { name: "Connectivity" }));
  open(0);
});

it("default schematic examples synchronize selection without invented distance disclosures", () => {
  render(<LocationExperience {...modeProps("schematic")} points={[]} />);
  const panel = screen.getByRole("tabpanel");
  fireEvent.click(screen.getByRole("button", { name: "Select example Rail link" }));
  expect(within(panel).getByRole("button", { name: "Example: Rail link" }).getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(within(panel).getByRole("button", { name: "Example: Road link" }));
  expect(screen.getByRole("button", { name: "Select example Road link" }).getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("tab", { name: "Education" }));
  expect(screen.getByRole("button", { name: "Select example School" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.queryByText(/Distance details for/)).toBeNull();
  expect(screen.queryByText("Distance unavailable")).toBeNull();
  expect(screen.getByText("Site data pending · Example places · Distances pending")).toBeTruthy();
});

it("approved mock map rejects unapproved places and stays pending when records shrink to empty", () => {
  const props = modeProps("approved mock map");
  const { approvalStatus: _approval, ...unapproved } = points[1];
  const view = render(<LocationExperience {...props} points={[points[0], unapproved]} />);
  expect(screen.queryByRole("button", { name: points[1].name })).toBeNull();
  expect(screen.queryByRole("button", { name: `Marker ${points[1].name}` })).toBeNull();
  view.rerender(<LocationExperience {...props} points={[]} />);
  expect(screen.getByText("Nearby places pending verification")).toBeTruthy();
  expect(within(screen.getByLabelText("Mock Google map")).queryAllByRole("button")).toHaveLength(0);
  expect(within(screen.getByRole("tabpanel")).queryAllByRole("button")).toHaveLength(0);
  expect(screen.queryByRole("button", { name: /Example/ })).toBeNull();
  expect(screen.queryByText(/Distance details for/)).toBeNull();
  expect(screen.getByRole("status").textContent).toContain("Connectivity: 0 verified places.");
});
