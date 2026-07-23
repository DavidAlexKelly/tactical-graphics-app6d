// @tactical-graphics/app6d/maplibre — MapLibre GL JS convenience layer.
// Wires MaplibreAdapter + a shared LiveOverrideStore + TacticOverlay +
// OrderHandleController together, with hover automatically bridged between
// the two. Takes an explicit SymbolCatalog — pass APP6D_CATALOG from
// "@tactical-graphics/app6d/symbols" for the built-in set, or your own.
import type maplibregl from "maplibre-gl";
import { MaplibreAdapter } from "./maplibre-adapter";
import { LiveOverrideStore } from "../overlay/LiveOverrideStore";
import { TacticOverlay } from "../overlay/TacticOverlay";
import { OrderHandleController, type OrderHandleControllerOptions, type ScaleRange } from "../overlay/OrderHandleController";
import type { SymbolCatalog } from "../engine/catalog";
import type { PlacedOrder, OrderHandleCallbacks } from "./types";

export { MaplibreAdapter } from "./maplibre-adapter";
export { TacticOverlay } from "../overlay/TacticOverlay";
export { OrderHandleController, type ScaleRange } from "../overlay/OrderHandleController";
export { LiveOverrideStore } from "../overlay/LiveOverrideStore";
export type { HandleTheme } from "../overlay/theme";
export type { PlacedOrder, OrderHandleCallbacks, LineStyle, EndpointStyle, WorldCoord } from "./types";

export interface MaplibreTacticGraphicsHandle {
  update: (orders: PlacedOrder[]) => void;
  setEditable: (editable: boolean) => void;
  setScaleRange: (range: ScaleRange) => void;
  destroy: () => void;
}

export interface CreateMaplibreTacticGraphicsOptions extends OrderHandleCallbacks, OrderHandleControllerOptions {}

/**
 * One-call setup for MapLibre: mounts a TacticOverlay + OrderHandleController
 * on `map`, keeps them in sync via `update()`, and bridges hover between the
 * visible graphic and its edit handles automatically.
 *
 * `catalog` is required — pass APP6D_CATALOG (built-in symbols) or your own
 * SymbolCatalog (e.g. `APP6D_CATALOG.extend({ "my-icon": myDef })`).
 */
export function createMaplibreTacticGraphics(
  catalog: SymbolCatalog,
  map: maplibregl.Map,
  options: CreateMaplibreTacticGraphicsOptions = {},
): MaplibreTacticGraphicsHandle {
  const adapter = new MaplibreAdapter(map);
  const liveStore = new LiveOverrideStore();

  const controller = new OrderHandleController(catalog, adapter, liveStore, {
    onMoveEnd: options.onMoveEnd,
    onMilxParamsChange: options.onMilxParamsChange,
    onScaleChange: options.onScaleChange,
    onRemove: options.onRemove,
  }, { theme: options.theme, scaleRange: options.scaleRange });

  const overlay = new TacticOverlay(catalog, adapter, liveStore, {
    onRemove: options.onRemove,
    onHoverChange: (id, hovered) => controller.setHoverGroup(id, hovered),
  });

  let editable = true;
  let lastOrders: PlacedOrder[] = [];

  return {
    update(orders: PlacedOrder[]) {
      lastOrders = orders;
      overlay.update(orders);
      controller.sync(editable ? orders : []);
    },
    setEditable(next: boolean) {
      editable = next;
      controller.sync(editable ? lastOrders : []);
    },
    setScaleRange(range: ScaleRange) {
      controller.setScaleRange(range);
    },
    destroy() {
      overlay.destroy();
      controller.destroy();
    },
  };
}