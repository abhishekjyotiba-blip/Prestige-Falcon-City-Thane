import { useEffect, useRef, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { isBrowserMapKey, toLatLng, type ApprovedGoogleMap, type ApprovedMapPoint } from "../utils/googleMap";
import { loadGoogleMapsSdk, MapsReloadRequiredError, watchMapsAuthFailure, type MapsSdk, type SdkMap, type SdkMarker } from "../utils/googleMapsSdk";
import "./GoogleProjectMap.css";

export interface GoogleProjectMapProps {
  map: ApprovedGoogleMap;
  places?: readonly ApprovedMapPoint[];
  selectedId?: string | null;
  start?: number;
  onSelectPlace?: (id: string) => void;
  apiKey?: string;
}
const NO_PLACES: readonly ApprovedMapPoint[] = [];
export function GoogleProjectMap({ map, places = NO_PLACES, selectedId, start = 0, onSelectPlace,
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY }: GoogleProjectMapProps) {
  const configured = isBrowserMapKey(apiKey);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error" | "reload-required">("idle");
  const [instance, setInstance] = useState<{ sdk: MapsSdk; map: SdkMap } | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const disposeMap = useRef<() => void>(() => {});
  const loadButton = useRef<HTMLButtonElement>(null);
  const fallbackLink = useRef<HTMLAnchorElement>(null);
  const markerButtons = useRef(new Map<string, HTMLButtonElement>());
  const onSelect = useRef(onSelectPlace);
  onSelect.current = onSelectPlace;
  const sitePosition = `${map.projectPin.latitude},${map.projectPin.longitude}`;

  useEffect(() => {
    if (!configured) {
      setInstance(null);
      setStatus("idle");
      setAttempt(0);
      return;
    }
    if (!attempt || !container.current) return;
    let active = true;
    let mounted: SdkMap | undefined;
    let loadedSdk: MapsSdk | undefined;
    let tilesListener: { remove(): void } | undefined;
    let tilesTimeout: number | undefined;
    const element = container.current;
    const cleanupMap = () => {
      clearTimeout(tilesTimeout);
      tilesListener?.remove();
      tilesListener = undefined;
      if (mounted) { loadedSdk?.clearInstanceListeners(mounted); mounted.unbindAll(); mounted = undefined; }
      element.replaceChildren();
    };
    disposeMap.current = cleanupMap;
    setStatus("loading");
    setInstance(null);
    const stopAuth = watchMapsAuthFailure(() => {
      if (active) { cleanupMap(); setStatus("error"); setInstance(null); }
    });
    void loadGoogleMapsSdk(apiKey).then((sdk) => {
      if (!active) return;
      loadedSdk = sdk;
      mounted = new sdk.Map(element, { center: toLatLng(map.projectPin), zoom: 14,
        mapId: map.mapId, streetViewControl: false, mapTypeControl: false,
        fullscreenControl: false, gestureHandling: "cooperative" });
      setInstance({ sdk, map: mounted });
      tilesTimeout = window.setTimeout(() => {
        if (active) { cleanupMap(); setInstance(null); setStatus("error"); }
      }, 15000);
      tilesListener = mounted.addListener("tilesloaded", () => {
        if (!active || !mounted) return;
        if (mounted.getMapCapabilities?.().isAdvancedMarkersAvailable === false) {
          cleanupMap(); setInstance(null); setStatus("error"); return;
        }
        clearTimeout(tilesTimeout);
        tilesListener?.remove();
        tilesListener = undefined;
        setStatus("loaded");
        if (document.activeElement === loadButton.current) fallbackLink.current?.focus({ preventScroll: true });
      });
    }).catch((error: unknown) => {
      if (active) {
        cleanupMap();
        setInstance(null);
        setStatus(error instanceof MapsReloadRequiredError ? "reload-required" : "error");
      }
    });
    return () => {
      active = false;
      stopAuth();
      cleanupMap();
    };
  }, [attempt, configured, apiKey, map.mapId, sitePosition]);

  useEffect(() => {
    if (!instance) return;
    const { sdk, map: sdkMap } = instance;
    const markers: SdkMarker[] = [];
    const buttons = markerButtons.current;
    const dispose = () => {
      markers.forEach((marker) => { sdk.clearInstanceListeners(marker); marker.map = null; });
      buttons.forEach((button) => { button.onclick = null; });
      buttons.clear();
    };
    try {
      const bounds = new sdk.LatLngBounds();
      const site = toLatLng(map.projectPin);
      bounds.extend(site);
      const projectContent = document.createElement("div");
      projectContent.className = "google-project-map__site-marker";
      projectContent.textContent = "P";
      markers.push(new sdk.AdvancedMarkerElement({ map: sdkMap, position: site, content: projectContent, title: map.projectIdentity }));
      places.forEach((point, index) => {
        const position = toLatLng(point.coordinates);
        bounds.extend(position);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "google-project-map__place-marker";
        button.textContent = String(start + index + 1);
        button.setAttribute("aria-label", `Select ${point.name}`);
        button.onclick = () => onSelect.current?.(point.id);
        buttons.set(point.id, button);
        markers.push(new sdk.AdvancedMarkerElement({ map: sdkMap, position, content: button, title: point.name }));
      });
      if (places.length) sdkMap.fitBounds(bounds, 48);
      else { sdkMap.panTo(site); sdkMap.setZoom(14); }
    } catch {
      dispose();
      disposeMap.current();
      setStatus("error");
      setInstance(null);
    }
    return dispose;
  }, [instance, places, start, sitePosition, map.projectIdentity]);

  useEffect(() => {
    markerButtons.current.forEach((button, id) => {
      button.setAttribute("aria-pressed", String(id === (selectedId ?? places[0]?.id)));
    });
    const selected = places.find((point) => point.id === selectedId);
    if (selected) instance?.map.panTo(toLatLng(selected.coordinates));
  }, [instance, places, selectedId]);

  return (
    <div className="google-project-map">
      <div className="google-project-map__frame" aria-busy={status === "loading"}>
        <div ref={container} className="google-project-map__canvas" aria-label={`${map.projectIdentity} Google Map`} style={{ visibility: configured && status === "loaded" ? "visible" : "hidden" }} aria-hidden={!configured || status !== "loaded"} />
        {(!configured || status !== "loaded") && (
          <div className="google-project-map__preload">
            <MapPin size={24} aria-hidden="true" />
            <strong>{!configured ? "Map configuration unavailable" : status === "reload-required" ? "Page reload required" : status === "error" ? "Google Map unavailable" : status === "loading" ? "Loading Google Map…" : "Google Maps"}</strong>
            <p role="status">{!configured ? "Interactive map pending configuration." : status === "reload-required" ? "Map configuration changed. Reload this page to use the new configuration." : status === "error" ? "The map could not load. Nearby details remain available." : "Loading connects to Google."}</p>
            {configured && status === "reload-required" && <button className="button dark" type="button" onClick={() => window.location.reload()}>Reload page</button>}
            {configured && status !== "reload-required" && <button ref={loadButton} className="button dark" type="button" disabled={status === "loading"} onClick={() => setAttempt((value) => value + 1)}>{status === "error" ? "Retry Google Map" : "Load Google Map"}</button>}
          </div>
        )}
      </div>
      <a ref={fallbackLink} className="google-project-map__link" href={map.shareUrl} target="_blank" rel="noopener noreferrer">
        Open in Google Maps <ExternalLink size={14} aria-hidden="true" />
      </a>
    </div>
  );
}
