// symbols/catalog/individual/counterattack-by-fire.ts — standalone, tree-shakeable.
import type { SymbolDefinition, EngineHandle, Params, Part } from "../../../engine/types";
import { P, add, chevron, lineD, mul, perp, polyD, rot } from "../../../engine/geometry";
import { axisHandles, axisOfAdvance, hScalar, stroke } from "../../families";

export const COUNTERATTACK_BY_FIRE_NAME = "svg-counterattack-by-fire" as const;

export const counterattackByFireSymbol: SymbolDefinition = {
    title: 'Counterattack By Fire',
    params: {
      spine: [P(228, 1710), P(228, 940), P(560, 609), P(1570, 609)], halfWidth: 199, headLen: 348, headHalf: 400,
      label: 'CATK', labelSize: 160, dashed: true,
      fire: { pos: P(1688, 609), angle: 0, braceHalf: 400, wingBack: 237, wingOut: 132, stemLen: 230, headLen: 88 },
    },
    generate(p: Params): Part[] {
      const parts: Part[] = [axisOfAdvance(p as any)];
      const q = p.fire, d = rot(P(1, 0), q.angle), n = perp(d);
      const b1 = add(q.pos, mul(n, q.braceHalf)), b2 = add(q.pos, mul(n, -q.braceHalf));
      parts.push(stroke(polyD([
        add(b1, add(mul(d, -q.wingBack), mul(n, q.wingOut))), b1, b2,
        add(b2, add(mul(d, -q.wingBack), mul(n, -q.wingOut))),
      ]), true));
      const tip = add(q.pos, mul(d, q.stemLen));
      parts.push(stroke(lineD(q.pos, tip), true));
      parts.push(stroke(chevron(tip, d, q.headLen, 30)));
      return parts;
    },
    handles: (p: Params): EngineHandle[] => [
      ...axisHandles(p),
      hScalar('fire', p.fire.pos, (pos) => ({ fire: { ...p.fire, pos } })),
    ],
    unitAnchor: 'start', meta: { sidcTaskId: "counterattack-by-fire" },
  };
