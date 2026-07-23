// symbols/catalog/individual/index.ts — barrel exporting each individually
// tree-shakeable symbol definition, PLUS a ready-made name->definition map
// (INDIVIDUAL_SYMBOLS) for convenient composition into a SymbolCatalog.
// Importing this file pulls in all five; importing a single file (e.g.
// "./block") pulls in only that one and its geometry dependencies.
import { BLOCK_NAME, blockSymbol } from "./block";
import { SEIZE_NAME, seizeSymbol } from "./seize";
import { SCREEN_NAME, screenSymbol } from "./screen";
import { DESTROY_NAME, destroySymbol } from "./destroy";
import { COUNTERATTACK_NAME, counterattackSymbol } from "./counterattack";
import type { SymbolDefinition } from "../../../engine/types";

export { blockSymbol, BLOCK_NAME } from "./block";
export { seizeSymbol, SEIZE_NAME } from "./seize";
export { screenSymbol, SCREEN_NAME } from "./screen";
export { destroySymbol, DESTROY_NAME } from "./destroy";
export { counterattackSymbol, COUNTERATTACK_NAME } from "./counterattack";

export const INDIVIDUAL_SYMBOLS: Record<string, SymbolDefinition> = {
  [BLOCK_NAME]: blockSymbol,
  [SEIZE_NAME]: seizeSymbol,
  [SCREEN_NAME]: screenSymbol,
  [DESTROY_NAME]: destroySymbol,
  [COUNTERATTACK_NAME]: counterattackSymbol,
};