// symbols/catalog/individual/aviation-axis-of-advance.ts — standalone, tree-shakeable.
import type { SymbolDefinition, Params, Part } from "../../../engine/types";
import { P } from "../../../engine/geometry";
import { axisHandles, axisOfAdvance } from "../../families";

export const AVIATION_AXIS_OF_ADVANCE_NAME = "svg-aviation-axis-of-advance" as const;

export const aviationAxisOfAdvanceSymbol: SymbolDefinition = {
    title: 'Aviation Axis Of Advance',
    params: { spine: [P(400, 2172), P(400, 958), P(765, 373), P(1442, 698), P(2503, 698)], halfWidth: 234, headLen: 531, headHalf: 325 },
    generate(p: Params): Part[] { return [axisOfAdvance(p as any)]; },
    handles: axisHandles,
    unitAnchor: 'start',
  };
