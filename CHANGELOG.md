# Changelog

All notable changes to this project are documented here.

## 1.0.1

- Added `@tactical-graphics/app6d/milsymbol`: `resolveSymbol(catalog, sidc,
  options)` resolves a SIDC to whichever library actually covers it — one
  of this library's own tactical graphics (via a real doctrinal SIDC or
  this library's synthetic renderer key) or a
  [milsymbol](https://github.com/spatialillusions/milsymbol) unit/
  equipment/installation icon — behind one shared `asSVG()`/`getAnchor()`/
  `getSize()` shape. milsymbol is an optional peer dependency, same
  treatment as maplibre-gl/react. Also adds `core`'s
  `resolveCatalogNameForSidc` (real SIDC/synthetic key -> catalog name)
  and `getSymbolAnchorPoint` (a symbol's declared anchor point in its own
  param space), and backfills `meta.sidcTaskId` on 41 more built-in
  symbols so real-SIDC resolution covers 46 of the 53 built-in symbols
  (the remaining 7 are unlabeled/generic rendering variants with no
  distinct doctrinal SIDC of their own).
- Fixed `unitAnchor` metadata on several built-in symbols (Screen, Guard,
  Cover, Seize, Occupy, Secure, Fortified Area, Ambush, Fix, Counterattack
  By Fire) where the declared anchor mode didn't match any handle the
  symbol's `handles()` actually exposes, causing click-to-place drift
  between the cursor and the shape's visual anchor (worst cases were
  ~1000px off at high zoom). `milxFromForAnchorClick` now also falls back
  to first/last-point-handle and centroid resolution when a symbol's
  handle names don't follow the `A`/`B`/`P1`/`P2`/`spine*`/`center`
  convention, so this class of bug can't reoccur silently.
- Escaped user-controlled text (labels, colours, order ids) before
  interpolating it into SVG markup strings, closing a stored-XSS vector
  for consumers that pass user-supplied label/colour values through to
  `render()`/`TacticOverlay`.
- Memoized the SIDC → catalog-name lookup per `SymbolCatalog` reference
  instead of rebuilding it on every call (it sits on the drag/pointermove
  hot path).
- Removed an accidental self-dependency on `@tactical-graphics/app6d` in
  `package.json`.

## 1.0.0

- Breaking change: replaced the mutable, process-wide symbol registry
  (`registerSymbol()` / `listSymbols()` / `getSymbolDefinition()`, plus a
  static `TACTIC_ORDERS` export) with an explicit, immutable
  `SymbolCatalog` value passed into every function that needs to resolve
  symbols. See the README's "Migrating from pre-1.0 versions" section for
  the full API mapping.
- Added the MapLibre adapter, `TacticOverlay`/`OrderHandleController`
  overlay, React hooks (`useTacticGraphics`/`useOrderStore`), and the
  `MapAdapter` interface for supporting other map/canvas backends.
- Added doctrinal task lookups (`lookupTaskForOrder` etc.) and semantic
  order builders (`createOrderBuilders`) under `/core`.
- Added versioned serialization helpers (`serializeOrder`/`migrateOrder`)
  for persisting placed orders across schema changes.
