// symbols/families.ts — shared geometry-generator "families" used by
// multiple APP-6D symbols (Block/Penetrate/Clear all share blockFamily,
// etc). Exported so custom catalogs can reuse them too.
import {
  Pt, P, add, sub, mul, dist, norm, lerp, perp, rot, angleOf, onCircle,
  project, polyD, lineD, chevron, lineWithGap, labelGapHalf, offsetPolyline,
} from "../engine/geometry";
import type { Part, Params, EngineHandle } from "../engine/types";

const stroke = (d: string, dashed = false): Part => ({ kind: 'stroke', d, dashed });
const fillP = (d: string): Part => ({ kind: 'fill', d });
const textP = (text: string, pos: Pt, size: number, rotate = 0): Part =>
  ({ kind: 'text', text, pos, size, rotate });

export { stroke, fillP, textP };

export const hPoint = (key: string, p: Params): EngineHandle => ({
  id: key, kind: 'point',
  pos: p[key] as Pt,
  set: (pos) => ({ [key]: pos }),
});
export const hScalar = (id: string, pos: Pt, set: (pos: Pt) => Params): EngineHandle =>
  ({ id, kind: 'scalar', pos, set });

/** Axis-of-advance arrow: open tail, mitred body, broad head. Last spine point = tip. */
export function axisOfAdvance(p: { spine: Pt[]; halfWidth: number; headLen: number; headHalf: number; dashed?: boolean }): Part {
  const tip = p.spine[p.spine.length - 1];
  const prev = p.spine[p.spine.length - 2];
  const dEnd = norm(sub(tip, prev));
  const base = sub(tip, mul(dEnd, p.headLen));
  const body = p.spine.slice(0, -1).concat([base]);
  const L = offsetPolyline(body, p.halfWidth);
  const R = offsetPolyline(body, -p.halfWidth);
  const nEnd = perp(dEnd);
  const pts = [
    ...L,
    add(base, mul(nEnd, p.headHalf)),
    tip,
    add(base, mul(nEnd, -p.headHalf)),
    ...R.slice().reverse(),
  ];
  return stroke(polyD(pts), p.dashed);
}

/* ── Block / Penetrate / Clear family ── */
export function blockFamily(p: Params): Part[] {
  const dir = norm(sub(p.B, p.A));
  const n = perp(dir);
  const parts: Part[] = [];
  parts.push(stroke(lineD(add(p.B, mul(n, p.barrierHalf)), add(p.B, mul(n, -p.barrierHalf)))));
  const offsets: number[] = p.arrowCount === 3 ? [-p.railOffset, 0, p.railOffset] : [0];
  for (const off of offsets) {
    const a = add(p.A, mul(n, off)), b = add(p.B, mul(n, off));
    if (off === 0) {
      const mid = lerp(a, b, 0.5);
      lineWithGap(a, b, mid, labelGapHalf(p.label, p.labelSize)).forEach(d => parts.push(stroke(d)));
      parts.push(textP(p.label, mid, p.labelSize));
    } else parts.push(stroke(lineD(a, b)));
    if (p.chevLen) parts.push(stroke(chevron(b, dir, p.chevLen, p.chevSpread)));
  }
  return parts;
}
export function blockHandles(p: Params): EngineHandle[] {
  const n = perp(norm(sub(p.B, p.A)));
  const hs = [
    hPoint('A', p), hPoint('B', p),
    hScalar('barrierHalf', add(p.B, mul(n, p.barrierHalf)),
      (pos) => ({ barrierHalf: Math.max(40, Math.abs(project(pos, p.B, n))) })),
  ];
  if (p.arrowCount === 3) hs.push(
    hScalar('railOffset', add(p.A, mul(n, p.railOffset)),
      (pos) => ({ railOffset: Math.max(40, Math.abs(project(pos, p.A, n))) })));
  return hs;
}

/* ── Breach / Bypass / Canalize family ── */
export function bracketFamily(p: Params): Part[] {
  const axis = norm(sub(p.P2, p.P1));
  const openDir = perp(axis);
  const C1 = sub(p.P1, mul(openDir, p.depth));
  const C2 = sub(p.P2, mul(openDir, p.depth));
  const parts: Part[] = [];
  parts.push(stroke(lineD(p.P1, C1)));
  parts.push(stroke(lineD(p.P2, C2)));
  const mid = lerp(C1, C2, 0.5);
  lineWithGap(C1, C2, mid, labelGapHalf(p.label, p.labelSize)).forEach(d => parts.push(stroke(d)));
  parts.push(textP(p.label, mid, p.labelSize));
  for (const [end, sgn] of [[p.P1, 1], [p.P2, -1]] as Array<[Pt, number]>) {
    if (p.endStyle === 'arrow') {
      parts.push(stroke(chevron(end, openDir, p.headLen, 45)));
    } else {
      const sd = rot(axis, sgn * p.slashAngle);
      parts.push(stroke(lineD(add(end, mul(sd, -p.slashLen / 2)), add(end, mul(sd, p.slashLen / 2)))));
    }
  }
  return parts;
}
export function bracketHandles(p: Params): EngineHandle[] {
  const od = perp(norm(sub(p.P2, p.P1)));
  return [
    hPoint('P1', p), hPoint('P2', p),
    hScalar('depth', sub(lerp(p.P1, p.P2, 0.5), mul(od, p.depth)),
      (pos) => ({ depth: Math.max(50, -project(pos, lerp(p.P1, p.P2, 0.5), od)) })),
  ];
}

/* ── Point glyphs (Destroy / Interdict / Neutralize) ── */
export interface GlyphLocal {
  strokes: Array<{ pts: Pt[]; dashed?: boolean }>;
  fills?: Pt[][];
  label?: { text: string; pos: Pt; size: number };
}
export function pointGlyph(local: GlyphLocal): (p: Params) => Part[] {
  return (p) => {
    const g = (q: Pt): Pt => add(p.center, rot(mul(q, p.scale), p.rotation));
    const parts: Part[] = [];
    for (const s of local.strokes) parts.push(stroke(polyD(s.pts.map(g)), s.dashed));
    for (const poly of (local.fills || [])) parts.push(fillP(polyD(poly.map(g), true)));
    if (local.label) parts.push(textP(local.label.text, g(local.label.pos), local.label.size * p.scale, p.rotation));
    return parts;
  };
}
export function glyphHandles(unit: number) {
  return (p: Params): EngineHandle[] => [
    hPoint('center', p),
    hScalar('sizeRotate', add(p.center, rot(P(unit * p.scale, 0), p.rotation)), (pos) => {
      const v = sub(pos, p.center);
      return { scale: Math.max(0.05, Math.hypot(v.x, v.y) / unit), rotation: angleOf(v) };
    }),
  ];
}

/* ── Circle-task family (Retain/Contain/Isolate/Occupy/Secure/Seize) ── */
export function circleHandles(p: Params): EngineHandle[] {
  return [
    hPoint('center', p),
    hScalar('radius', onCircle(p.center, p.radius, 45),
      (pos) => ({ radius: Math.max(40, dist(pos, p.center)) })),
    hScalar('gapAngle', onCircle(p.center, p.radius, p.gapAngle),
      (pos) => ({ gapAngle: angleOf(sub(pos, p.center)) })),
  ];
}

/* ── Axis family (Counterattack / Main Attack / Aviation Axis / notched) ── */
export function axisHandles(p: Params): EngineHandle[] {
  const hs: EngineHandle[] = (p.spine as Pt[]).map((pt, i) => ({
    id: `spine${i}`, kind: 'point',
    pos: pt,
    set: (pos) => { const s = (p.spine as Pt[]).slice(); s[i] = pos; return { spine: s }; },
  }));
  const a = p.spine[0], b = p.spine[1];
  const n01 = perp(norm(sub(b, a)));
  hs.push(hScalar('halfWidth', add(lerp(a, b, 0.35), mul(n01, p.halfWidth)),
    (pos) => ({ halfWidth: Math.max(20, Math.abs(project(pos, lerp(p.spine[0], p.spine[1], 0.35), n01))) })));
  const tip = p.spine[p.spine.length - 1], prev = p.spine[p.spine.length - 2];
  const dEnd = norm(sub(tip, prev)), base = sub(tip, mul(dEnd, p.headLen));
  hs.push(hScalar('head', add(base, mul(perp(dEnd), p.headHalf)), (pos) => ({
    headLen: Math.max(40, -project(pos, tip, dEnd)),
    headHalf: Math.max(40, Math.abs(project(pos, tip, perp(dEnd)))),
  })));
  return hs;
}

/* ── Retrograde arc family (Delay/Withdraw/Withdraw Under Pressure) ── */
export function retrogradeArcFamily(p: Params): Part[] {
  const d = norm(sub(p.B, p.A)), n = perp(d);
  const E = add(p.B, mul(n, 2 * p.r));
  const parts: Part[] = [];
  if (p.label) {
    const mid = lerp(p.A, p.B, 0.5);
    lineWithGap(p.A, p.B, mid, labelGapHalf(p.label, p.labelSize)).forEach((dd) => parts.push(stroke(dd)));
    parts.push(textP(p.label, mid, p.labelSize));
  } else {
    parts.push(stroke(lineD(p.A, p.B)));
  }
  parts.push(stroke(chevron(p.A, mul(d, -1), p.headLen, p.headSpread)));
  parts.push(stroke(`M${p.B.x.toFixed(1)},${p.B.y.toFixed(1)} A${p.r.toFixed(1)},${p.r.toFixed(1)} 0 1,0 ${E.x.toFixed(1)},${E.y.toFixed(1)}`));
  return parts;
}
export function retrogradeArcHandles(p: Params): EngineHandle[] {
  const d = norm(sub(p.B, p.A)), n = perp(d);
  return [
    hPoint('A', p), hPoint('B', p),
    hScalar('r', add(p.B, add(mul(n, p.r), mul(d, p.r))), (pos) => {
      const dd = norm(sub(p.B, p.A)), nn = perp(dd), v = sub(pos, p.B);
      return { r: Math.max(30, (v.x * (nn.x + dd.x) + v.y * (nn.y + dd.y)) / 2) };
    }),
  ];
}

/* ── Organic blob area glyph (ATK/OBJ/AA/ASLT PSN) ── */
export function blobPoints(center: Pt, r: number, wobble: number, n = 16): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i;
    const w = 1 + wobble * (0.5 * Math.sin(a * 3 * Math.PI / 180) + 0.3 * Math.sin(a * 5 * Math.PI / 180 + 1) + 0.2 * Math.sin(a * 7 * Math.PI / 180 + 2));
    pts.push(onCircle(center, r * w, a));
  }
  return pts;
}
export function blobFamily(p: Params): Part[] {
  const pts = blobPoints(p.center, p.radius, p.wobble);
  const parts: Part[] = [stroke(polyD(pts, true))];
  if (Array.isArray(p.label)) {
    const lines: string[] = p.label;
    lines.forEach((line, i) =>
      parts.push(textP(line, add(p.center, P(0, (i - (lines.length - 1) / 2) * p.labelSize * 1.15)), p.labelSize)));
  } else if (p.label) {
    parts.push(textP(p.label, p.center, p.labelSize));
  }
  return parts;
}
export function blobHandles(p: Params): EngineHandle[] {
  return [
    hPoint('center', p),
    hScalar('radius', onCircle(p.center, p.radius, 30), (pos) => ({ radius: Math.max(80, dist(pos, p.center)) })),
    hScalar('wobble', onCircle(p.center, p.radius, 150),
      (pos) => ({ wobble: Math.max(0, Math.min(0.6, dist(pos, p.center) / p.radius - 1)) })),
  ];
}

/* ── Repeated tick/decoration row along a line (wire/minefield/lane) ── */
export function tickRowFamily(p: Params): Part[] {
  const dir = norm(sub(p.B, p.A)), n = perp(dir);
  const parts: Part[] = [stroke(lineD(p.A, p.B), !!p.dashed)];
  for (let i = 0; i < p.count; i++) {
    const t = (i + 0.5) / p.count;
    const c = lerp(p.A, p.B, t);
    switch (p.tickShape) {
      case 'x':
        parts.push(stroke(lineD(
          add(c, add(mul(dir, -p.tickSize), mul(n, -p.tickSize))),
          add(c, add(mul(dir, p.tickSize), mul(n, p.tickSize))),
        )));
        parts.push(stroke(lineD(
          add(c, add(mul(dir, -p.tickSize), mul(n, p.tickSize))),
          add(c, add(mul(dir, p.tickSize), mul(n, -p.tickSize))),
        )));
        break;
      case 'square':
        parts.push(stroke(polyD([
          add(c, add(mul(dir, -p.tickSize), mul(n, -p.tickSize))),
          add(c, add(mul(dir, p.tickSize), mul(n, -p.tickSize))),
          add(c, add(mul(dir, p.tickSize), mul(n, p.tickSize))),
          add(c, add(mul(dir, -p.tickSize), mul(n, p.tickSize))),
        ], true)));
        break;
      case 'triangle':
        parts.push(fillP(polyD([
          add(c, mul(n, -p.tickSize)),
          add(c, mul(n, p.tickSize)),
          add(c, mul(dir, p.tickSize * 1.4)),
        ], true)));
        break;
      case 'chevron': {
        const side = i % 2 === 0 ? 1 : -1;
        parts.push(stroke(chevron(add(c, mul(n, side * p.tickSize)), mul(n, side), p.tickSize, 40)));
        break;
      }
      case 'bar':
      default:
        parts.push(stroke(lineD(add(c, mul(n, -p.tickSize)), add(c, mul(n, p.tickSize)))));
        break;
    }
  }
  if (p.headArrow) parts.push(stroke(chevron(p.B, dir, p.tickSize * 1.4, 40)));
  return parts;
}
export function tickRowHandles(p: Params): EngineHandle[] {
  const dir = norm(sub(p.B, p.A)), n = perp(dir);
  return [
    hPoint('A', p), hPoint('B', p),
    hScalar('tickSize', add(lerp(p.A, p.B, 0.5 / p.count), mul(n, p.tickSize)),
      (pos) => ({ tickSize: Math.max(15, Math.abs(project(pos, lerp(p.A, p.B, 0.5), n))) })),
  ];
}

/* ── Gate / crossing-point bracket ── */
export function gateBracketFamily(p: Params): Part[] {
  const axis = norm(sub(p.P2, p.P1));
  const openDir = perp(axis);
  const C1 = sub(p.P1, mul(openDir, p.depth));
  const C2 = sub(p.P2, mul(openDir, p.depth));
  const parts: Part[] = [
    stroke(lineD(p.P1, C1)),
    stroke(lineD(p.P2, C2)),
    stroke(lineD(C1, C2)),
  ];
  for (const [corner, sgn] of [[p.P1, 1], [p.P2, -1]] as Array<[Pt, number]>) {
    const tip = add(corner, mul(axis, sgn * p.flagLen));
    const wing = add(corner, mul(openDir, -p.flagLen * 0.5));
    parts.push(fillP(polyD([corner, tip, wing], true)));
  }
  return parts;
}
export function gateBracketHandles(p: Params): EngineHandle[] {
  const axis = norm(sub(p.P2, p.P1)), openDir = perp(axis);
  return [
    hPoint('P1', p), hPoint('P2', p),
    hScalar('depth', sub(lerp(p.P1, p.P2, 0.5), mul(openDir, p.depth)),
      (pos) => ({ depth: Math.max(40, -project(pos, lerp(p.P1, p.P2, 0.5), openDir)) })),
    hScalar('flagLen', add(p.P1, mul(axis, p.flagLen)),
      (pos) => ({ flagLen: Math.max(30, Math.abs(project(pos, p.P1, axis))) })),
  ];
}

/* ── Filled lane marker with opposing end caps ── */
export function laneMarkerFamily(p: Params): Part[] {
  const dir = norm(sub(p.B, p.A)), n = perp(dir);
  const parts: Part[] = [];
  parts.push(fillP(polyD([
    add(p.A, mul(n, p.bandHalf)), add(p.B, mul(n, p.bandHalf)),
    add(p.B, mul(n, -p.bandHalf)), add(p.A, mul(n, -p.bandHalf)),
  ], true)));
  const capA = add(p.A, mul(dir, p.capLen));
  const capB = sub(p.B, mul(dir, p.capLen));
  parts.push(fillP(polyD([p.A, add(capA, mul(n, p.capHalf)), add(capA, mul(n, -p.capHalf))], true)));
  parts.push(fillP(polyD([p.B, add(capB, mul(n, p.capHalf)), add(capB, mul(n, -p.capHalf))], true)));
  return parts;
}
export function laneMarkerHandles(p: Params): EngineHandle[] {
  const dir = norm(sub(p.B, p.A)), n = perp(dir);
  return [
    hPoint('A', p), hPoint('B', p),
    hScalar('bandHalf', add(lerp(p.A, p.B, 0.5), mul(n, p.bandHalf)),
      (pos) => ({ bandHalf: Math.max(20, Math.abs(project(pos, lerp(p.A, p.B, 0.5), n))) })),
    hScalar('capLen', add(p.A, mul(dir, p.capLen)),
      (pos) => ({ capLen: Math.max(30, Math.abs(project(pos, p.A, dir))) })),
  ];
}

/* ── Two-way route/axis ── */
export function twoWayArrowFamily(p: Params): Part[] {
  const dir = norm(sub(p.B, p.A));
  return [
    stroke(lineD(p.A, p.B)),
    stroke(chevron(p.A, mul(dir, -1), p.headLen, p.headSpread)),
    stroke(chevron(p.B, dir, p.headLen, p.headSpread)),
  ];
}
export function twoWayArrowHandles(p: Params): EngineHandle[] {
  return [
    hPoint('A', p), hPoint('B', p),
    hScalar('headLen', add(p.B, mul(norm(sub(p.A, p.B)), p.headLen)),
      (pos) => ({ headLen: Math.max(40, dist(pos, p.B)) })),
  ];
}

/* ── Zigzag + hook family (Screen / Guard / Cover) ── */
export function zigzagHookFamily(p: Params): Part[] {
  const parts: Part[] = [];
  for (let c = 0; c < p.copies; c++) {
    const off = P(c * p.spacing, 0);
    const A = add(p.A, off), B = add(p.B, off);
    const dir = norm(sub(B, A)), n = perp(dir);
    const pts: Pt[] = [A];
    for (let k = 1; k <= p.peaks; k++) {
      const t = k / (p.peaks + 1);
      pts.push(add(lerp(A, B, t), mul(n, (k % 2 ? 1 : -1) * p.amp)));
    }
    pts.push(B);
    parts.push(stroke(polyD(pts)));
    const hookDir = rot(dir, p.hookAngle);
    const hookMid = add(B, mul(hookDir, p.hookLen));
    const backDir = rot(dir, -p.hookAngle * 0.6);
    const hookEnd = add(B, mul(backDir, p.hookLen * 0.75));
    parts.push(stroke(polyD([hookMid, B, hookEnd])));
    if (p.label) parts.push(textP(p.label, lerp(A, B, 0.5), p.labelSize));
  }
  return parts;
}
export function zigzagHookHandles(p: Params): EngineHandle[] {
  const dir = norm(sub(p.B, p.A)), n = perp(dir);
  const firstPeakBase = lerp(p.A, p.B, 1 / (p.peaks + 1));
  return [
    hPoint('A', p), hPoint('B', p),
    hScalar('amp', add(firstPeakBase, mul(n, p.amp)),
      (pos) => ({ amp: Math.max(20, Math.abs(project(pos, firstPeakBase, n))) })),
    hScalar('hookLen', add(p.B, mul(rot(dir, p.hookAngle), p.hookLen)),
      (pos) => ({ hookLen: Math.max(20, dist(pos, p.B)) })),
    hScalar('spacing', add(p.A, P(p.spacing, 0)),
      (pos) => ({ spacing: Math.max(100, pos.x - p.A.x) })),
  ];
}