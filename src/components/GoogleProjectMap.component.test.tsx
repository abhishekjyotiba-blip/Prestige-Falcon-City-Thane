import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GoogleProjectMap } from "./GoogleProjectMap";
import { MAP_PROJECT_IDENTITY, type ApprovedGoogleMap, type ApprovedMapPoint } from "../utils/googleMap";

const mocks = vi.hoisted(() => ({ load: vi.fn(), auth: vi.fn(), stopAuth: vi.fn() }));
vi.mock("../utils/googleMapsSdk", async () => ({
  ...await vi.importActual<typeof import("../utils/googleMapsSdk")>("../utils/googleMapsSdk"),
  loadGoogleMapsSdk: mocks.load,
  watchMapsAuthFailure: (callback: () => void) => { mocks.auth.mockImplementation(callback); return mocks.stopAuth; },
}));
import { MapsReloadRequiredError } from "../utils/googleMapsSdk";
const site: ApprovedGoogleMap = { projectIdentity: MAP_PROJECT_IDENTITY, approvalStatus: "approved", verifiedOn: "2026-10-02",
  sourceUrl: "https://example.test/source", shareUrl: "https://maps.app.goo.gl/Synthetic", mapId: "synthetic-map-id", projectPin: { latitude: 0, longitude: 0 } };
const places: ApprovedMapPoint[] = [1, 2].map((number) => ({ id: `synthetic-${number}`, name: `Synthetic ${number}`, category: "Connectivity",
  approvalStatus: "approved", sourceUrl: "https://example.test/source", verifiedOn: "2026-10-02", coordinates: { latitude: number, longitude: number } }));
const key = `AIza${"x".repeat(35)}`;
function sdkFixture() {
  const panTo = vi.fn(), fitBounds = vi.fn(), unbindAll = vi.fn(), clearInstanceListeners = vi.fn();
  const instances: object[] = [], markers: { map: unknown }[] = [];
  class TestMap {
    element: HTMLElement;
    addListener(_event: string, callback: () => void) { queueMicrotask(callback); return { remove: vi.fn() }; }
    panTo = panTo; fitBounds = fitBounds; unbindAll = unbindAll; setZoom = vi.fn();
    constructor(element: HTMLElement) { this.element = element; instances.push(this); }
  }
  class Marker {
    content: HTMLElement; current: TestMap | null;
    constructor(options: { content: HTMLElement; map: TestMap }) {
      this.content = options.content; this.current = options.map; options.map.element.append(this.content); markers.push(this);
    }
    get map() { return this.current; }
    set map(next: TestMap | null) { this.current = next; if (!next) this.content.remove(); }
  }
  return { sdk: { Map: TestMap, AdvancedMarkerElement: Marker, LatLngBounds: class { extend() {} }, clearInstanceListeners },
    panTo, fitBounds, unbindAll, clearInstanceListeners, markers, instances };
}
beforeEach(() => { vi.clearAllMocks(); });
afterEach(() => vi.useRealTimers());
describe("conditional Google map", () => {
  it("does not request Google without a key or before explicit load", () => {
    const view = render(<GoogleProjectMap map={site} apiKey="" />);
    expect(screen.getByText("Map configuration unavailable")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Load Google Map" })).toBeNull();
    expect(screen.getByRole("link", { name: /Open in Google Maps/ }).getAttribute("rel")).toBe("noopener noreferrer");
    view.rerender(<GoogleProjectMap map={site} apiKey={key} />);
    expect(screen.getByRole("button", { name: "Load Google Map" })).toBeTruthy();
    expect(mocks.load).not.toHaveBeenCalled();
  });
  it("loads only on request, synchronizes selection and current page, and disposes all listeners/markers", async () => {
    const fixture = sdkFixture(); mocks.load.mockResolvedValue(fixture.sdk);
    const select = vi.fn();
    const view = render(<GoogleProjectMap map={site} apiKey={key} places={places} selectedId={places[0].id} onSelectPlace={select} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
    const second = await screen.findByRole("button", { name: "Select Synthetic 2" });
    expect(screen.getByRole("button", { name: "Select Synthetic 1" }).getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(second);
    expect(select).toHaveBeenCalledWith("synthetic-2");
    view.rerender(<GoogleProjectMap map={site} apiKey={key} places={places} selectedId={places[1].id} onSelectPlace={select} />);
    expect(second.getAttribute("aria-pressed")).toBe("true");
    expect(fixture.panTo).toHaveBeenLastCalledWith({ lat: 2, lng: 2 });
    expect(fixture.instances.length).toBe(1);
    view.rerender(<GoogleProjectMap map={site} apiKey={key} places={[places[1]]} start={4} selectedId={places[1].id} onSelectPlace={select} />);
    expect(screen.queryByRole("button", { name: "Select Synthetic 1" })).toBeNull();
    expect(screen.getByRole("button", { name: "Select Synthetic 2" }).textContent).toBe("5");
    expect(fixture.fitBounds).toHaveBeenCalledTimes(2);
    expect(fixture.markers.slice(0, 3).every((marker) => marker.map === null)).toBe(true);
    view.unmount();
    expect(fixture.markers.every((marker) => marker.map === null)).toBe(true);
    expect(fixture.unbindAll).toHaveBeenCalledTimes(1);
    expect(mocks.stopAuth).toHaveBeenCalledTimes(1);
    expect(fixture.clearInstanceListeners).toHaveBeenCalled();
  });
  it("shows loading then network error and supports explicit retry", async () => {
    let reject!: (reason: Error) => void;
    mocks.load.mockImplementationOnce(() => new Promise((_, rejectPromise) => { reject = rejectPromise; }));
    const fixture = sdkFixture(); mocks.load.mockResolvedValueOnce(fixture.sdk);
    render(<GoogleProjectMap map={site} apiKey={key} places={places} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
    expect(screen.getByText("Loading Google Map…")).toBeTruthy();
    await act(async () => reject(new Error("blocked")));
    fireEvent.click(await screen.findByRole("button", { name: "Retry Google Map" }));
    await screen.findByRole("button", { name: "Select Synthetic 1" });
    expect(mocks.load).toHaveBeenCalledTimes(2);
  });
  it("authentication failure removes markers and never labels failed canvas loaded", async () => {
    const fixture = sdkFixture(); mocks.load.mockResolvedValue(fixture.sdk);
    render(<GoogleProjectMap map={site} apiKey={key} places={places} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
    await screen.findByRole("button", { name: "Select Synthetic 1" });
    act(() => mocks.auth());
    expect(screen.getByRole("button", { name: "Retry Google Map" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Select Synthetic 1" })).toBeNull();
    expect(fixture.markers.every((marker) => marker.map === null)).toBe(true);
  });
  it("fails honestly when first map tiles never arrive and cleans tile listener/timer", async () => {
    vi.useFakeTimers();
    const fixture = sdkFixture();
    const remove = vi.fn();
    fixture.sdk.Map = class extends fixture.sdk.Map {
      addListener() { return { remove }; }
    };
    mocks.load.mockResolvedValue(fixture.sdk);
    render(<GoogleProjectMap map={site} apiKey={key} places={places} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByText("Loading Google Map…")).toBeTruthy();
    await act(async () => { await vi.advanceTimersByTimeAsync(15001); });
    expect(screen.getByRole("button", { name: "Retry Google Map" })).toBeTruthy();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(fixture.unbindAll).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
  it("rejects map IDs without Advanced Marker capability", async () => {
    const fixture = sdkFixture();
    fixture.sdk.Map = class extends fixture.sdk.Map {
      getMapCapabilities() { return { isAdvancedMarkersAvailable: false }; }
    };
    mocks.load.mockResolvedValue(fixture.sdk);
    render(<GoogleProjectMap map={site} apiKey={key} places={places} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
    await screen.findByRole("button", { name: "Retry Google Map" });
    expect(fixture.unbindAll).toHaveBeenCalledTimes(1);
    expect(fixture.markers.every((marker) => marker.map === null)).toBe(true);
  });
  it("StrictMode creates no unsolicited or duplicate map and never steals marker focus", async () => {
    const fixture = sdkFixture(); mocks.load.mockResolvedValue(fixture.sdk);
    const select = vi.fn();
    render(<StrictMode><GoogleProjectMap map={site} apiKey={key} places={places} selectedId={null} onSelectPlace={select} /></StrictMode>);
    expect(mocks.load).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
    const marker = await screen.findByRole("button", { name: "Select Synthetic 2" });
    marker.focus(); fireEvent.click(marker);
    expect(document.activeElement).toBe(marker);
    expect(fixture.instances).toHaveLength(1);
    expect(fixture.panTo).not.toHaveBeenCalled();
  });
  it("loaded map resets truthfully for missing/invalid key and requires a fresh load when restored", async () => {
    const fixture = sdkFixture(); mocks.load.mockResolvedValue(fixture.sdk);
    const view = render(<GoogleProjectMap map={site} apiKey={key} places={places} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
    await screen.findByRole("button", { name: "Select Synthetic 1" });
    for (const unavailableKey of ["", "invalid"]) {
      view.rerender(<GoogleProjectMap map={site} apiKey={unavailableKey} places={places} />);
      expect(screen.getByText("Map configuration unavailable")).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Select Synthetic 1" })).toBeNull();
      expect(screen.queryByRole("button", { name: /Retry/ })).toBeNull();
      const calls = mocks.load.mock.calls.length;
      view.rerender(<GoogleProjectMap map={site} apiKey={key} places={places} />);
      expect(screen.getByRole("button", { name: "Load Google Map" })).toBeTruthy();
      expect(mocks.load).toHaveBeenCalledTimes(calls);
      fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
      await screen.findByRole("button", { name: "Select Synthetic 1" });
    }
    expect(fixture.unbindAll).toHaveBeenCalledTimes(2);
    expect(fixture.markers.slice(0, 6).every((marker) => marker.map === null)).toBe(true);
  });
  it("key changes requiring a document reload never offer ineffective Retry", async () => {
    const fixture = sdkFixture(); mocks.load.mockResolvedValueOnce(fixture.sdk).mockRejectedValueOnce(new MapsReloadRequiredError());
    const view = render(<GoogleProjectMap map={site} apiKey={key} places={places} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
    await screen.findByRole("button", { name: "Select Synthetic 1" });
    view.rerender(<GoogleProjectMap map={site} apiKey={`AIza${"y".repeat(35)}`} places={places} />);
    await screen.findByRole("button", { name: "Reload page" });
    expect(screen.getByText("Page reload required")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Retry Google Map" })).toBeNull();
    expect(fixture.unbindAll).toHaveBeenCalledTimes(1);
  });
  it("ignores a delayed load completion after unmount", async () => {
    let resolve!: (value: unknown) => void;
    mocks.load.mockImplementation(() => new Promise((resolvePromise) => { resolve = resolvePromise; }));
    const fixture = sdkFixture();
    const view = render(<GoogleProjectMap map={site} apiKey={key} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Google Map" }));
    view.unmount();
    await act(async () => resolve(fixture.sdk));
    await waitFor(() => expect(fixture.instances).toHaveLength(0));
    expect(mocks.stopAuth).toHaveBeenCalledTimes(1);
  });
});
