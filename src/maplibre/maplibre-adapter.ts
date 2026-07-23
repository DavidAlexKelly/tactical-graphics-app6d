// maplibre/maplibre-adapter.ts — MapAdapter implementation for maplibre-gl.
// WorldCoord = [lng, lat], matching GeoJSON / MapLibre convention.
import maplibregl from "maplibre-gl";
import type { MapAdapter, MarkerHandle, ScreenPt, WorldCoord } from "../adapter/types";

class MaplibreMarkerHandle implements MarkerHandle {
  constructor(private marker: maplibregl.Marker) {}
  setPosition(world: WorldCoord): void { this.marker.setLngLat(world); }
  getPosition(): WorldCoord { const ll = this.marker.getLngLat(); return [ll.lng, ll.lat]; }
  getElement(): HTMLElement { return this.marker.getElement(); }
  remove(): void { this.marker.remove(); }
}

export class MaplibreAdapter implements MapAdapter {
  constructor(private map: maplibregl.Map) {}

  project(world: WorldCoord): ScreenPt {
    const p = this.map.project(world);
    return { x: p.x, y: p.y };
  }
  unproject(px: ScreenPt): WorldCoord {
    const ll = this.map.unproject([px.x, px.y]);
    return [ll.lng, ll.lat];
  }
  getContainer(): HTMLElement { return this.map.getContainer(); }
  getZoom(): number { return this.map.getZoom(); }
  onCameraChange(cb: () => void): () => void {
    const events = ["move", "zoom", "resize", "rotate", "pitch"] as const;
    events.forEach((e) => this.map.on(e, cb));
    return () => events.forEach((e) => this.map.off(e, cb));
  }
  createMarker(el: HTMLElement, world: WorldCoord): MarkerHandle {
    const marker = new maplibregl.Marker({ element: el, anchor: "center", draggable: false })
      .setLngLat(world)
      .addTo(this.map);
    return new MaplibreMarkerHandle(marker);
  }
  /** Escape hatch for code that needs the raw maplibregl.Map (e.g. queryRenderedFeatures). */
  get raw(): maplibregl.Map { return this.map; }
}