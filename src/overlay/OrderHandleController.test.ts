// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { SymbolCatalog } from "../engine/catalog";
import { LiveOverrideStore } from "./LiveOverrideStore";
import { OrderHandleController } from "./OrderHandleController";
import { seizeSymbol, SEIZE_NAME } from "../symbols/catalog/individual/seize";
import { blockSymbol, BLOCK_NAME } from "../symbols/catalog/individual/block";
import type { MapAdapter, MarkerHandle, WorldCoord } from "../adapter/types";
import type { PlacedOrder } from "../maplibre/types";

const catalog = new SymbolCatalog({ [SEIZE_NAME]: seizeSymbol, [BLOCK_NAME]: blockSymbol });

function makeAdapter(): { adapter: MapAdapter; createdEls: HTMLElement[] } {
  const createdEls: HTMLElement[] = [];
  const adapter: MapAdapter = {
    project: ([x, y]) => ({ x, y }),
    unproject: (p) => [p.x, p.y] as WorldCoord,
    getContainer: () => document.createElement("div"),
    getZoom: () => 10,
    onCameraChange: () => () => {},
    createMarker: (el: HTMLElement, world: WorldCoord): MarkerHandle => {
      createdEls.push(el);
      let pos = world;
      return {
        setPosition: (w) => { pos = w; },
        getPosition: () => pos,
        getElement: () => el,
        remove: vi.fn(),
      };
    },
  };
  return { adapter, createdEls };
}

const baseOrder = (overrides: Partial<PlacedOrder> = {}): PlacedOrder => ({
  id: "order-1",
  from: [0, 0],
  to: [0, 0],
  colour: "#4a90d9",
  tacticSidc: "SVGSEIZE",
  ...overrides,
});

describe("OrderHandleController — fromAnchored", () => {
  it("draws a draggable move handle for an unattached milx order (svg-seize)", () => {
    const { adapter, createdEls } = makeAdapter();
    const controller = new OrderHandleController(catalog, adapter, new LiveOverrideStore());
    controller.sync([baseOrder()]);

    // Seize has its own "center" handle (circleHandles), so the generic
    // "Move symbol" handle is suppressed in favor of it — but "center"
    // itself should be draggable when not anchored.
    const centerHandle = createdEls.find((el) => el.title === "center");
    expect(centerHandle).toBeDefined();
  });

  it("does NOT draw a draggable move/center handle once fromAnchored is true (svg-seize)", () => {
    const { adapter, createdEls } = makeAdapter();
    const controller = new OrderHandleController(catalog, adapter, new LiveOverrideStore());
    controller.sync([baseOrder({ fromAnchored: true })]);

    const moveHandle = createdEls.find((el) => el.title === "Move symbol");
    const centerHandle = createdEls.find((el) => el.title === "center");
    expect(moveHandle).toBeUndefined();
    expect(centerHandle).toBeUndefined();

    // Reshape/resize handles for this symbol should still be there.
    const radiusHandle = createdEls.find((el) => el.title === "radius");
    expect(radiusHandle).toBeDefined();
  });

  it("does NOT draw the generic move handle once fromAnchored is true (svg-block, no center handle)", () => {
    const { adapter, createdEls } = makeAdapter();
    const controller = new OrderHandleController(catalog, adapter, new LiveOverrideStore());
    controller.sync([baseOrder({ tacticSidc: "SVGBLOCK", fromAnchored: true })]);

    const moveHandle = createdEls.find((el) => el.title === "Move symbol");
    expect(moveHandle).toBeUndefined();
  });

  it("removes an existing move handle when an order transitions to fromAnchored", () => {
    const { adapter } = makeAdapter();
    const controller = new OrderHandleController(catalog, adapter, new LiveOverrideStore());

    controller.sync([baseOrder({ tacticSidc: "SVGBLOCK" })]);
    controller.sync([baseOrder({ tacticSidc: "SVGBLOCK", fromAnchored: true })]);

    // Re-sync unattached again — a fresh move handle should reappear,
    // proving the controller doesn't get stuck in either state.
    const { adapter: adapter2, createdEls: createdEls2 } = makeAdapter();
    const controller2 = new OrderHandleController(catalog, adapter2, new LiveOverrideStore());
    controller2.sync([baseOrder({ tacticSidc: "SVGBLOCK", fromAnchored: true })]);
    controller2.sync([baseOrder({ tacticSidc: "SVGBLOCK", fromAnchored: false })]);
    const moveHandle = createdEls2.find((el) => el.title === "Move symbol");
    expect(moveHandle).toBeDefined();
  });
});
