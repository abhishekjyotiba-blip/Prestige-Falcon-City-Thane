import { isBrowserMapKey } from "./googleMap";

export interface SdkMap {
  addListener(event: string, callback: () => void): { remove(): void };
  getMapCapabilities?(): { isAdvancedMarkersAvailable?: boolean };
  fitBounds(bounds: SdkBounds, padding?: number): void;
  panTo(position: { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
  unbindAll(): void;
}
interface SdkBounds { extend(position: { lat: number; lng: number }): void }
export interface SdkMarker { map: SdkMap | null }
export interface MapsSdk {
  Map: new (container: HTMLElement, options: Record<string, unknown>) => SdkMap;
  LatLngBounds: new () => SdkBounds;
  AdvancedMarkerElement: new (options: Record<string, unknown>) => SdkMarker;
  clearInstanceListeners(instance: object): void;
}
interface GoogleWindow extends Window {
  google?: { maps: {
    importLibrary(name: string): Promise<Record<string, unknown>>;
    event: { clearInstanceListeners(instance: object): void };
  } };
  gm_authFailure?: () => void;
}
const authListeners = new Set<() => void>();
let previousAuth: (() => void) | undefined;
function authFailure() {
  authRejected = true;
  pending = undefined;
  configuredKey = undefined;
  loadedScript?.remove();
  loadedScript = undefined;
  previousAuth?.();
  for (const listener of authListeners) listener();
}
export function watchMapsAuthFailure(listener: () => void): () => void {
  const host = window as GoogleWindow;
  if (!authListeners.size) {
    previousAuth = host.gm_authFailure;
    host.gm_authFailure = authFailure;
  }
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
    if (!authListeners.size && host.gm_authFailure === authFailure) {
      host.gm_authFailure = previousAuth;
      previousAuth = undefined;
    }
  };
}
let pending: Promise<MapsSdk> | undefined;
let loadedScript: HTMLScriptElement | undefined;
let authRejected = false;
let configuredKey: string | undefined;
/** Shared SDK lifetime; consumers dispose maps, not a script another consumer needs. */
export function loadGoogleMapsSdk(apiKey: string): Promise<MapsSdk> {
  if (!isBrowserMapKey(apiKey)) return Promise.reject(new Error("Map configuration unavailable"));
  if (pending) return configuredKey === apiKey ? pending : Promise.reject(new Error("Map configuration changed"));
  configuredKey = apiKey;
  pending = new Promise<MapsSdk>((resolve, reject) => {
    const host = window as GoogleWindow;
    let settled = false;
    let script: HTMLScriptElement | undefined;
    const finish = (sdk?: MapsSdk) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      stopAuth();
      if (script) { script.onload = null; script.onerror = null; }
      if (sdk) resolve(sdk);
      else {
        script?.remove();
        reject(new Error("Google Maps could not load"));
      }
    };
    const stopAuth = watchMapsAuthFailure(() => finish());
    const timer = window.setTimeout(() => finish(), 15000);
    const importSdk = async () => {
      try {
        const googleMaps = host.google?.maps;
        if (!googleMaps?.importLibrary) { finish(); return; }
        const [maps, marker] = await Promise.all([googleMaps.importLibrary("maps"), googleMaps.importLibrary("marker")]);
        if (typeof maps.Map !== "function" || typeof maps.LatLngBounds !== "function" ||
            typeof marker.AdvancedMarkerElement !== "function") { finish(); return; }
        finish({ Map: maps.Map, LatLngBounds: maps.LatLngBounds,
          AdvancedMarkerElement: marker.AdvancedMarkerElement,
          clearInstanceListeners: (instance) => googleMaps.event.clearInstanceListeners(instance),
        } as MapsSdk);
      } catch { finish(); }
    };
    if (!authRejected && host.google?.maps?.importLibrary) { void importSdk(); return; }
    authRejected = false;
    script = document.createElement("script");
    const url = new URL("https://maps.googleapis.com/maps/api/js");
    url.search = new URLSearchParams({ key: apiKey, v: "weekly", loading: "async", libraries: "maps,marker" }).toString();
    script.src = url.href;
    loadedScript = script;
    script.async = true;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.onload = () => { void importSdk(); };
    script.onerror = () => finish();
    document.head.append(script);
  }).catch((error: unknown) => {
    pending = undefined;
    configuredKey = undefined;
    throw error;
  });
  return pending;
}
