// core/tacticOrders.ts — SIDC catalog + screen-space placement math for
// APP-6D-style tactical order graphics. Operates against an explicit
// SymbolCatalog value (no shared global state) — every function here
// takes `catalog` as its first argument. Pass APP6D_CATALOG from
// "@tactical-graphics/app6d/symbols" for the built-in set, or your own
// catalog (built via `APP6D_CATALOG.extend({...})` or `new SymbolCatalog({...})`)
// if you've added custom graphics.
import type { SymbolCatalog } from "../engine/catalog";
import {
  render as engineRender,
  getHandles as engineGetHandles,
  applyHandle as engineApplyHandle,
  paramsFor,
} from "../engine/render";
import { lookupTaskForOrder } from "./tacticTaskCatalog";

export type TacticCategory = "Offensive" | "Defensive" | "Manoeuvre" | "Fire Support" | "Control Measures";
export type TacticIconFn = (colour: string) => string;

export interface Pt2 { x: number; y: number; }

export type MapRenderFn = (
  from: Pt2, to: Pt2, colour: string, mid?: Pt2,
  milxParams?: Record<string, unknown>, zoom?: number, arrowScale?: number,
) => string;

export interface TacticOrder {
  id: string;
  label: string;
  description: string;
  sidc: string;
  category: TacticCategory;
  keywords?: string[];
  icon: TacticIconFn;
  renderOnMap: MapRenderFn;
}

export interface MilxPlacementConfig {
  /** px per param-unit at `baseZoom`. Default: 0.004. */
  pxPerUnit: number;
  /** zoom level `pxPerUnit` was tuned for. Default: 7. */
  baseZoom: number;
}
export const DEFAULT_MILX_PLACEMENT: MilxPlacementConfig = { pxPerUnit: 0.004, baseZoom: 7 };
const MILX_ORIGIN: Pt2 = { x: 1050, y: 950 };
const MILX_STROKE_PX = 2.2;

interface MilxTransform { s: number; f: Pt2; }
function milxTransformFor(anchor: Pt2, zoom?: number, arrowScale?: number, cfg: MilxPlacementConfig = DEFAULT_MILX_PLACEMENT): MilxTransform {
  const zoomScale = zoom !== undefined ? Math.pow(2, zoom - cfg.baseZoom) : 1;
  return { s: cfg.pxPerUnit * zoomScale * (arrowScale ?? 1), f: anchor };
}
function milxToScreen(tr: MilxTransform, p: Pt2): Pt2 {
  return { x: tr.f.x + (p.x - MILX_ORIGIN.x) * tr.s, y: tr.f.y + (p.y - MILX_ORIGIN.y) * tr.s };
}
function screenToMilx(tr: MilxTransform, p: Pt2): Pt2 {
  return { x: MILX_ORIGIN.x + (p.x - tr.f.x) / tr.s, y: MILX_ORIGIN.y + (p.y - tr.f.y) / tr.s };
}

// ── SIDC ↔ catalog-name mapping ────────────────────────────────────────────
// NOTE: synthetic identifiers derived from catalog names (e.g. "svg-block"
// -> "SVGBLOCK"), NOT real MIL-STD-2525/APP-6 SIDCs — those live in
// tacticTaskCatalog.ts as a separate key space.
function nameBySidcKey(catalog: SymbolCatalog): Record<string, string> {
  return Object.fromEntries(catalog.list().map((n) => [n.toUpperCase().replace(/-/g, ""), n]));
}

export function isMilxOrder(catalog: SymbolCatalog, sidc: string | undefined): boolean {
  if (!sidc) return false;
  return sidc in nameBySidcKey(catalog);
}

export function milxHasCenterHandle(catalog: SymbolCatalog, sidc: string | undefined): boolean {
  const map = nameBySidcKey(catalog);
  const name = sidc ? map[sidc] : undefined;
  if (!name) return false;
  return engineGetHandles(catalog, name).some((h) => h.id === "center");
}

export interface MilxMapHandle { id: string; kind: "point" | "scalar"; pos: Pt2; }

export function milxHandlesForOrder(
  catalog: SymbolCatalog, sidc: string, anchor: Pt2, params?: Record<string, unknown>, zoom?: number, arrowScale?: number, cfg?: MilxPlacementConfig,
): MilxMapHandle[] {
  const name = nameBySidcKey(catalog)[sidc];
  if (!name) return [];
  const tr = milxTransformFor(anchor, zoom, arrowScale, cfg);
  return engineGetHandles(catalog, name, params).map((h) => ({ id: h.id, kind: h.kind, pos: milxToScreen(tr, h.pos) }));
}

export function milxFromForAnchorClick(catalog: SymbolCatalog, sidc: string, clickPx: Pt2, zoom?: number, arrowScale?: number, cfg?: MilxPlacementConfig): Pt2 {
  const name = nameBySidcKey(catalog)[sidc];
  if (!name) return clickPx;
  const def = catalog.get(name);
  const unitAnchor = def?.unitAnchor;
  if (!unitAnchor) return clickPx;

  const tr = milxTransformFor(clickPx, zoom, arrowScale, cfg);
  const defaultParams = paramsFor(catalog, name);
  const handles = engineGetHandles(catalog, name, defaultParams);

  let anchorHandleId: string | null = null;
  if (unitAnchor === "center") {
    anchorHandleId = "center";
  } else if (unitAnchor === "start") {
    if (handles.find((h) => h.id === "spine0")) anchorHandleId = "spine0";
    else if (handles.find((h) => h.id === "A")) anchorHandleId = "A";
    else if (handles.find((h) => h.id === "P1")) anchorHandleId = "P1";
  } else if (unitAnchor === "end") {
    const spineHandles = handles.filter((h) => h.id.startsWith("spine"));
    if (spineHandles.length > 0) anchorHandleId = spineHandles[spineHandles.length - 1].id;
    else if (handles.find((h) => h.id === "B")) anchorHandleId = "B";
    else if (handles.find((h) => h.id === "P2")) anchorHandleId = "P2";
  } else if (unitAnchor === "midline") {
    const hA = handles.find((h) => h.id === "A") ?? handles.find((h) => h.id === "P1");
    const hB = handles.find((h) => h.id === "B") ?? handles.find((h) => h.id === "P2");
    if (hA && hB) {
      const midScreen = {
        x: (milxToScreen(tr, hA.pos).x + milxToScreen(tr, hB.pos).x) / 2,
        y: (milxToScreen(tr, hA.pos).y + milxToScreen(tr, hB.pos).y) / 2,
      };
      const dx = clickPx.x - midScreen.x, dy = clickPx.y - midScreen.y;
      return { x: clickPx.x + dx, y: clickPx.y + dy };
    }
  }
  if (!anchorHandleId) return clickPx;
  const anchorHandle = handles.find((h) => h.id === anchorHandleId);
  if (!anchorHandle) return clickPx;
  const anchorScreenWithFromAtClick = milxToScreen(tr, anchorHandle.pos);
  const dx = clickPx.x - anchorScreenWithFromAtClick.x, dy = clickPx.y - anchorScreenWithFromAtClick.y;
  return { x: clickPx.x + dx, y: clickPx.y + dy };
}

export function applyMilxOrderHandle(
  catalog: SymbolCatalog, sidc: string, anchor: Pt2, params: Record<string, unknown> | undefined, handleId: string,
  screenPos: Pt2, zoom?: number, arrowScale?: number, cfg?: MilxPlacementConfig,
): Record<string, unknown> | null {
  const name = nameBySidcKey(catalog)[sidc];
  if (!name) return null;
  const tr = milxTransformFor(anchor, zoom, arrowScale, cfg);
  try {
    return engineApplyHandle(catalog, name, params, handleId, screenToMilx(tr, screenPos));
  } catch {
    return null;
  }
}

function buildTacticOrder(catalog: SymbolCatalog, name: string): TacticOrder {
  return {
    id: name,
    label: name.replace(/^svg-/, "").replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase()),
    description: "",
    sidc: name.toUpperCase().replace(/-/g, ""),
    category: "Control Measures",
    keywords: name.split("-").filter(Boolean),
    icon: (c: string) => {
      const s = 40 / 2300;
      const inner = engineRender(catalog, name, undefined, { stroke: c, strokeWidth: 130 });
      return `<g transform="scale(${s.toFixed(5)}) translate(100,200)">${inner}</g>`;
    },
    renderOnMap: (f: Pt2, _t: Pt2, colour: string, _mid?: Pt2, milxParams?: Record<string, unknown>, zoom?: number, arrowScale?: number) => {
      const tr = milxTransformFor(f, zoom, arrowScale);
      const inner = engineRender(catalog, name, milxParams, { stroke: colour, strokeWidth: MILX_STROKE_PX / tr.s });
      return `<g transform="translate(${tr.f.x.toFixed(1)},${tr.f.y.toFixed(1)}) scale(${tr.s.toFixed(6)}) translate(${(-MILX_ORIGIN.x).toFixed(1)},${(-MILX_ORIGIN.y).toFixed(1)})">${inner}</g>`;
    },
  };
}

/**
 * All tactic orders derived from `catalog`. Since a SymbolCatalog is
 * immutable, this is safe to call as often as you like (e.g. inside a
 * `useMemo` keyed on the catalog reference) — it will always return the
 * same result for the same catalog, with no dependency on module-load
 * timing anywhere.
 */
export function getTacticOrders(catalog: SymbolCatalog): TacticOrder[] {
  return catalog.list().map((name) => buildTacticOrder(catalog, name));
}

export const TACTIC_CATEGORIES: TacticCategory[] = ["Offensive", "Defensive", "Manoeuvre", "Fire Support", "Control Measures"];

// ── Task-name → SIDC resolution ──────────────────────────────────────────
function byLabelIndex(orders: TacticOrder[]) { return new Map(orders.map((o) => [o.label.toLowerCase(), o])); }
function byIdIndex(orders: TacticOrder[]) { return new Map(orders.map((o) => [o.id.toLowerCase(), o])); }

export function resolveTacticSidc(catalog: SymbolCatalog, taskName: string | undefined): string | undefined {
  if (!taskName) return undefined;
  const normalized = taskName.trim().toLowerCase();
  if (!normalized) return undefined;

  const orders = getTacticOrders(catalog);
  const labelMatch = byLabelIndex(orders).get(normalized);
  if (labelMatch) return labelMatch.sidc;

  const svgKey = `svg-${normalized.replace(/\s+/g, "-")}`;
  const idMatch = byIdIndex(orders).get(svgKey);
  if (idMatch) return idMatch.sidc;

  return `TASK_${normalized.replace(/[\^a-z0-9]/g, "").toUpperCase()}`;
}

export function getUnitAnchorForSidc(catalog: SymbolCatalog, tacticSidc: string | undefined): "start" | "end" | "center" | "midline" | undefined {
  if (!tacticSidc) return undefined;
  const order = getTacticOrders(catalog).find((o) => o.sidc === tacticSidc);
  if (!order) return undefined;
  return catalog.get(order.id)?.unitAnchor;
}

export function computeUnitAnchorPosition(
  catalog: SymbolCatalog,
  arrow: { fromLat: number; fromLng: number; toLat: number; toLng: number; tacticSidc?: string },
): { lat: number; lng: number } | undefined {
  const anchor = getUnitAnchorForSidc(catalog, arrow.tacticSidc);
  if (!anchor) return undefined;
  if (isMilxOrder(catalog, arrow.tacticSidc)) return { lat: arrow.fromLat, lng: arrow.fromLng };
  switch (anchor) {
    case "start": return { lat: arrow.fromLat, lng: arrow.fromLng };
    case "end": return { lat: arrow.toLat, lng: arrow.toLng };
    case "center": return { lat: arrow.fromLat, lng: arrow.fromLng };
    case "midline": return { lat: (arrow.fromLat + arrow.toLat) / 2, lng: (arrow.fromLng + arrow.toLng) / 2 };
    default: return undefined;
  }
}

export { lookupTaskForOrder };