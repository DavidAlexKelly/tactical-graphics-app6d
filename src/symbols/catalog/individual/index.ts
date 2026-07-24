// symbols/catalog/individual/index.ts — barrel exporting each individually
// tree-shakeable symbol definition, PLUS a ready-made name->definition map
// (INDIVIDUAL_SYMBOLS) for convenient composition into a SymbolCatalog.
// Importing this file pulls in the full built-in catalog; importing a single
// file (e.g. "./block") pulls in only that one symbol and its geometry
// dependencies — every built-in APP-6D symbol is individually tree-shakeable.
import { BLOCK_NAME, blockSymbol } from "./block";
import { SEIZE_NAME, seizeSymbol } from "./seize";
import { SCREEN_NAME, screenSymbol } from "./screen";
import { DESTROY_NAME, destroySymbol } from "./destroy";
import { COUNTERATTACK_NAME, counterattackSymbol } from "./counterattack";
import { BREACH_NAME, breachSymbol } from "./breach";
import { BYPASS_NAME, bypassSymbol } from "./bypass";
import { CANALIZE_NAME, canalizeSymbol } from "./canalize";
import { CLEAR_NAME, clearSymbol } from "./clear";
import { PENETRATE_NAME, penetrateSymbol } from "./penetrate";
import { DISRUPT_NAME, disruptSymbol } from "./disrupt";
import { INTERDICT_NAME, interdictSymbol } from "./interdict";
import { NEUTRALIZE_NAME, neutralizeSymbol } from "./neutralize";
import { RETAIN_NAME, retainSymbol } from "./retain";
import { CONTAIN_NAME, containSymbol } from "./contain";
import { COUNTERATTACK_BY_FIRE_NAME, counterattackByFireSymbol } from "./counterattack-by-fire";
import { FIX_NAME, fixSymbol } from "./fix";
import { FOLLOW_AND_ASSUME_NAME, followAndAssumeSymbol } from "./follow-and-assume";
import { FOLLOW_AND_SUPPORT_NAME, followAndSupportSymbol } from "./follow-and-support";
import { ISOLATE_NAME, isolateSymbol } from "./isolate";
import { OCCUPY_NAME, occupySymbol } from "./occupy";
import { SECURE_NAME, secureSymbol } from "./secure";
import { RETIREMENT_ARC_NAME, retirementArcSymbol } from "./retirement-arc";
import { DELAY_ARC_NAME, delayArcSymbol } from "./delay-arc";
import { WITHDRAW_ARC_NAME, withdrawArcSymbol } from "./withdraw-arc";
import { WITHDRAW_PRESSURE_ARC_NAME, withdrawPressureArcSymbol } from "./withdraw-pressure-arc";
import { RETROGRADE_NOTCH_NAME, retrogradeNotchSymbol } from "./retrograde-notch";
import { SCREEN_POST_NAME, screenPostSymbol } from "./screen-post";
import { BLOB_ATK_NAME, blobAtkSymbol } from "./blob-atk";
import { BLOB_ATK_ALT_NAME, blobAtkAltSymbol } from "./blob-atk-alt";
import { BLOB_OBJ_NAME, blobObjSymbol } from "./blob-obj";
import { BLOB_AA_NAME, blobAaSymbol } from "./blob-aa";
import { BLOB_ASLT_PSN_NAME, blobAsltPsnSymbol } from "./blob-aslt-psn";
import { BLOB_PENETRATION_BOX_NAME, blobPenetrationBoxSymbol } from "./blob-penetration-box";
import { WIRE_X_NAME, wireXSymbol } from "./wire-x";
import { MINEFIELD_SQUARE_NAME, minefieldSquareSymbol } from "./minefield-square";
import { ABATIS_TRIANGLE_NAME, abatisTriangleSymbol } from "./abatis-triangle";
import { WIRE_CHEVRON_NAME, wireChevronSymbol } from "./wire-chevron";
import { WIRE_TICK_LINE_NAME, wireTickLineSymbol } from "./wire-tick-line";
import { FORTIFIED_AREA_NAME, fortifiedAreaSymbol } from "./fortified-area";
import { AXIS_NOTCHED_NAME, axisNotchedSymbol } from "./axis-notched";
import { AXIS_NOTCHED_SIMPLE_NAME, axisNotchedSimpleSymbol } from "./axis-notched-simple";
import { AXIS_NOTCHED_WIDE_NAME, axisNotchedWideSymbol } from "./axis-notched-wide";
import { GATE_CROSSING_NAME, gateCrossingSymbol } from "./gate-crossing";
import { LANE_MARKER_NAME, laneMarkerSymbol } from "./lane-marker";
import { TWO_WAY_ROUTE_NAME, twoWayRouteSymbol } from "./two-way-route";
import { MAIN_ATTACK_NAME, mainAttackSymbol } from "./main-attack";
import { SUPPORTING_ATTACK_NAME, supportingAttackSymbol } from "./supporting-attack";
import { AVIATION_AXIS_OF_ADVANCE_NAME, aviationAxisOfAdvanceSymbol } from "./aviation-axis-of-advance";
import { AMBUSH_NAME, ambushSymbol } from "./ambush";
import { SUPPORT_BY_FIRE_POSITION_NAME, supportByFirePositionSymbol } from "./support-by-fire-position";
import { GUARD_GG_NAME, guardGgSymbol } from "./guard-gg";
import { COVER_CC_NAME, coverCcSymbol } from "./cover-cc";
import type { SymbolDefinition } from "../../../engine/types";

export { blockSymbol, BLOCK_NAME } from "./block";
export { seizeSymbol, SEIZE_NAME } from "./seize";
export { screenSymbol, SCREEN_NAME } from "./screen";
export { destroySymbol, DESTROY_NAME } from "./destroy";
export { counterattackSymbol, COUNTERATTACK_NAME } from "./counterattack";
export { breachSymbol, BREACH_NAME } from "./breach";
export { bypassSymbol, BYPASS_NAME } from "./bypass";
export { canalizeSymbol, CANALIZE_NAME } from "./canalize";
export { clearSymbol, CLEAR_NAME } from "./clear";
export { penetrateSymbol, PENETRATE_NAME } from "./penetrate";
export { disruptSymbol, DISRUPT_NAME } from "./disrupt";
export { interdictSymbol, INTERDICT_NAME } from "./interdict";
export { neutralizeSymbol, NEUTRALIZE_NAME } from "./neutralize";
export { retainSymbol, RETAIN_NAME } from "./retain";
export { containSymbol, CONTAIN_NAME } from "./contain";
export { counterattackByFireSymbol, COUNTERATTACK_BY_FIRE_NAME } from "./counterattack-by-fire";
export { fixSymbol, FIX_NAME } from "./fix";
export { followAndAssumeSymbol, FOLLOW_AND_ASSUME_NAME } from "./follow-and-assume";
export { followAndSupportSymbol, FOLLOW_AND_SUPPORT_NAME } from "./follow-and-support";
export { isolateSymbol, ISOLATE_NAME } from "./isolate";
export { occupySymbol, OCCUPY_NAME } from "./occupy";
export { secureSymbol, SECURE_NAME } from "./secure";
export { retirementArcSymbol, RETIREMENT_ARC_NAME } from "./retirement-arc";
export { delayArcSymbol, DELAY_ARC_NAME } from "./delay-arc";
export { withdrawArcSymbol, WITHDRAW_ARC_NAME } from "./withdraw-arc";
export { withdrawPressureArcSymbol, WITHDRAW_PRESSURE_ARC_NAME } from "./withdraw-pressure-arc";
export { retrogradeNotchSymbol, RETROGRADE_NOTCH_NAME } from "./retrograde-notch";
export { screenPostSymbol, SCREEN_POST_NAME } from "./screen-post";
export { blobAtkSymbol, BLOB_ATK_NAME } from "./blob-atk";
export { blobAtkAltSymbol, BLOB_ATK_ALT_NAME } from "./blob-atk-alt";
export { blobObjSymbol, BLOB_OBJ_NAME } from "./blob-obj";
export { blobAaSymbol, BLOB_AA_NAME } from "./blob-aa";
export { blobAsltPsnSymbol, BLOB_ASLT_PSN_NAME } from "./blob-aslt-psn";
export { blobPenetrationBoxSymbol, BLOB_PENETRATION_BOX_NAME } from "./blob-penetration-box";
export { wireXSymbol, WIRE_X_NAME } from "./wire-x";
export { minefieldSquareSymbol, MINEFIELD_SQUARE_NAME } from "./minefield-square";
export { abatisTriangleSymbol, ABATIS_TRIANGLE_NAME } from "./abatis-triangle";
export { wireChevronSymbol, WIRE_CHEVRON_NAME } from "./wire-chevron";
export { wireTickLineSymbol, WIRE_TICK_LINE_NAME } from "./wire-tick-line";
export { fortifiedAreaSymbol, FORTIFIED_AREA_NAME } from "./fortified-area";
export { axisNotchedSymbol, AXIS_NOTCHED_NAME } from "./axis-notched";
export { axisNotchedSimpleSymbol, AXIS_NOTCHED_SIMPLE_NAME } from "./axis-notched-simple";
export { axisNotchedWideSymbol, AXIS_NOTCHED_WIDE_NAME } from "./axis-notched-wide";
export { gateCrossingSymbol, GATE_CROSSING_NAME } from "./gate-crossing";
export { laneMarkerSymbol, LANE_MARKER_NAME } from "./lane-marker";
export { twoWayRouteSymbol, TWO_WAY_ROUTE_NAME } from "./two-way-route";
export { mainAttackSymbol, MAIN_ATTACK_NAME } from "./main-attack";
export { supportingAttackSymbol, SUPPORTING_ATTACK_NAME } from "./supporting-attack";
export { aviationAxisOfAdvanceSymbol, AVIATION_AXIS_OF_ADVANCE_NAME } from "./aviation-axis-of-advance";
export { ambushSymbol, AMBUSH_NAME } from "./ambush";
export { supportByFirePositionSymbol, SUPPORT_BY_FIRE_POSITION_NAME } from "./support-by-fire-position";
export { guardGgSymbol, GUARD_GG_NAME } from "./guard-gg";
export { coverCcSymbol, COVER_CC_NAME } from "./cover-cc";

export const INDIVIDUAL_SYMBOLS: Record<string, SymbolDefinition> = {
  [BLOCK_NAME]: blockSymbol,
  [SEIZE_NAME]: seizeSymbol,
  [SCREEN_NAME]: screenSymbol,
  [DESTROY_NAME]: destroySymbol,
  [COUNTERATTACK_NAME]: counterattackSymbol,
  [BREACH_NAME]: breachSymbol,
  [BYPASS_NAME]: bypassSymbol,
  [CANALIZE_NAME]: canalizeSymbol,
  [CLEAR_NAME]: clearSymbol,
  [PENETRATE_NAME]: penetrateSymbol,
  [DISRUPT_NAME]: disruptSymbol,
  [INTERDICT_NAME]: interdictSymbol,
  [NEUTRALIZE_NAME]: neutralizeSymbol,
  [RETAIN_NAME]: retainSymbol,
  [CONTAIN_NAME]: containSymbol,
  [COUNTERATTACK_BY_FIRE_NAME]: counterattackByFireSymbol,
  [FIX_NAME]: fixSymbol,
  [FOLLOW_AND_ASSUME_NAME]: followAndAssumeSymbol,
  [FOLLOW_AND_SUPPORT_NAME]: followAndSupportSymbol,
  [ISOLATE_NAME]: isolateSymbol,
  [OCCUPY_NAME]: occupySymbol,
  [SECURE_NAME]: secureSymbol,
  [RETIREMENT_ARC_NAME]: retirementArcSymbol,
  [DELAY_ARC_NAME]: delayArcSymbol,
  [WITHDRAW_ARC_NAME]: withdrawArcSymbol,
  [WITHDRAW_PRESSURE_ARC_NAME]: withdrawPressureArcSymbol,
  [RETROGRADE_NOTCH_NAME]: retrogradeNotchSymbol,
  [SCREEN_POST_NAME]: screenPostSymbol,
  [BLOB_ATK_NAME]: blobAtkSymbol,
  [BLOB_ATK_ALT_NAME]: blobAtkAltSymbol,
  [BLOB_OBJ_NAME]: blobObjSymbol,
  [BLOB_AA_NAME]: blobAaSymbol,
  [BLOB_ASLT_PSN_NAME]: blobAsltPsnSymbol,
  [BLOB_PENETRATION_BOX_NAME]: blobPenetrationBoxSymbol,
  [WIRE_X_NAME]: wireXSymbol,
  [MINEFIELD_SQUARE_NAME]: minefieldSquareSymbol,
  [ABATIS_TRIANGLE_NAME]: abatisTriangleSymbol,
  [WIRE_CHEVRON_NAME]: wireChevronSymbol,
  [WIRE_TICK_LINE_NAME]: wireTickLineSymbol,
  [FORTIFIED_AREA_NAME]: fortifiedAreaSymbol,
  [AXIS_NOTCHED_NAME]: axisNotchedSymbol,
  [AXIS_NOTCHED_SIMPLE_NAME]: axisNotchedSimpleSymbol,
  [AXIS_NOTCHED_WIDE_NAME]: axisNotchedWideSymbol,
  [GATE_CROSSING_NAME]: gateCrossingSymbol,
  [LANE_MARKER_NAME]: laneMarkerSymbol,
  [TWO_WAY_ROUTE_NAME]: twoWayRouteSymbol,
  [MAIN_ATTACK_NAME]: mainAttackSymbol,
  [SUPPORTING_ATTACK_NAME]: supportingAttackSymbol,
  [AVIATION_AXIS_OF_ADVANCE_NAME]: aviationAxisOfAdvanceSymbol,
  [AMBUSH_NAME]: ambushSymbol,
  [SUPPORT_BY_FIRE_POSITION_NAME]: supportByFirePositionSymbol,
  [GUARD_GG_NAME]: guardGgSymbol,
  [COVER_CC_NAME]: coverCcSymbol,
};
