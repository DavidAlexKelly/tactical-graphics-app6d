// symbols/catalog/individual/main-attack.ts — standalone, tree-shakeable.
import type { SymbolDefinition, EngineHandle, Params, Part } from "../../../engine/types";
import { P, polyD } from "../../../engine/geometry";
import { axisHandles, axisOfAdvance, stroke } from "../../families";

export const MAIN_ATTACK_NAME = "svg-main-attack" as const;

export const mainAttackSymbol: SymbolDefinition = {
    title: 'Main Attack',
    params: {
      spine: [P(300, 1816), P(300, 867), P(750, 580), P(1829, 580)],
      halfWidth: 260, headLen: 601, headHalf: 521,
      notch: { top: P(1228, 320), tip: P(1529, 580), bottom: P(1228, 841) },
    },
    generate(p: Params): Part[] {
      const parts: Part[] = [axisOfAdvance(p as any)];
      if (p.notch) parts.push(stroke(polyD([p.notch.top, p.notch.tip, p.notch.bottom])));
      return parts;
    },
    handles(p: Params): EngineHandle[] {
      const hs = axisHandles(p);
      hs.push(
        { id: 'notchTip', kind: 'point', pos: p.notch.tip, set: (pos) => ({ notch: { ...p.notch, tip: pos } }) },
        { id: 'notchTop', kind: 'point', pos: p.notch.top, set: (pos) => ({ notch: { ...p.notch, top: pos } }) },
        { id: 'notchBottom', kind: 'point', pos: p.notch.bottom, set: (pos) => ({ notch: { ...p.notch, bottom: pos } }) },
      );
      return hs;
    },
    unitAnchor: 'start',
  };
