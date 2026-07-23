// symbols/catalog/bulk.ts — the rest of the APP-6D catalog (everything not
// individually tree-shakeable in catalog/individual/). Exports a plain
// BULK_SYMBOLS name->definition map. Nothing runs as a side effect —
// combine it into a catalog yourself, or use the pre-built APP6D_CATALOG
// from symbols/index.ts, which already includes these.
import {
  P, sub, norm, right, mul, lerp, add, dist, angleOf, onCircle, project, rot, perp,
  chevron, lineWithGap, labelGapHalf, circleArcs, gapArrowDir, polyD, lineD,
  type Pt,
} from "../../engine/geometry";
import type { SymbolDefinition, Part, Params, EngineHandle } from "../../engine/types";
import {
  stroke, fillP, textP, hPoint, hScalar,
  blockFamily, blockHandles,
  bracketFamily, bracketHandles,
  pointGlyph, glyphHandles,
  circleHandles,
  axisOfAdvance, axisHandles,
  retrogradeArcFamily, retrogradeArcHandles,
  blobFamily, blobHandles,
  tickRowFamily, tickRowHandles,
  gateBracketFamily, gateBracketHandles,
  laneMarkerFamily, laneMarkerHandles,
  twoWayArrowFamily, twoWayArrowHandles,
  zigzagHookFamily, zigzagHookHandles,
} from "../families";

export const BULK_SYMBOLS: Record<string, SymbolDefinition> = {
  "svg-breach": {
    title: 'Breach',
    params: { P1: P(1771, 159), P2: P(1771, 1622), depth: 1463, endStyle: 'slash', slashAngle: 14, slashLen: 242, headLen: 148, label: 'B', labelSize: 216 },
    generate: bracketFamily, handles: bracketHandles, unitAnchor: 'start',
  },
  "svg-bypass": {
    title: 'Bypass',
    params: { P1: P(1805, 142), P2: P(1805, 1638), depth: 1495, endStyle: 'arrow', slashAngle: 0, slashLen: 0, headLen: 148, label: 'B', labelSize: 216 },
    generate: bracketFamily, handles: bracketHandles, unitAnchor: 'start',
  },
  "svg-canalize": {
    title: 'Canalize',
    params: { P1: P(1750, 159), P2: P(1750, 1622), depth: 1464, endStyle: 'slash', slashAngle: -32, slashLen: 277, headLen: 148, label: 'C', labelSize: 216 },
    generate: bracketFamily, handles: bracketHandles, unitAnchor: 'start',
  },
  "svg-clear": {
    title: 'Clear',
    params: { A: P(129, 889), B: P(1809, 889), barrierHalf: 840, railOffset: 673, chevLen: 204, chevSpread: 35, arrowCount: 3, label: 'C', labelSize: 218 },
    generate: blockFamily, handles: blockHandles, unitAnchor: 'start',
  },
  "svg-penetrate": {
    title: 'Penetrate',
    params: { A: P(129, 889), B: P(1809, 889), barrierHalf: 840, chevLen: 204, chevSpread: 35, arrowCount: 1, label: 'P', labelSize: 218 },
    generate: blockFamily, handles: blockHandles, unitAnchor: 'start',
  },
  "svg-disrupt": {
    title: 'Disrupt',
    params: { A: P(362, 1638), B: P(362, 142), maxLen: 1496, ratios: [1, 0.75, 0.5], stub: 300, chevLen: 183, chevSpread: 35, label: 'D', labelSize: 216 },
    generate(p: Params): Part[] {
      const dir = norm(sub(p.B, p.A));
      const out = right(dir);
      const parts: Part[] = [stroke(lineD(p.A, p.B))];
      const rows = [p.A, lerp(p.A, p.B, 0.5), p.B];
      rows.forEach((base, i) => {
        const tip = add(base, mul(out, p.maxLen * p.ratios[i]));
        if (i === 1) {
          const mid = lerp(base, tip, 0.5);
          lineWithGap(base, tip, mid, labelGapHalf(p.label, p.labelSize)).forEach(d => parts.push(stroke(d)));
          parts.push(textP(p.label, mid, p.labelSize));
          parts.push(stroke(lineD(base, add(base, mul(out, -p.stub)))));
        } else parts.push(stroke(lineD(base, tip)));
        parts.push(stroke(chevron(tip, out, p.chevLen, p.chevSpread)));
      });
      return parts;
    },
    handles: (p: Params): EngineHandle[] => [
      hPoint('A', p), hPoint('B', p),
      hScalar('maxLen', add(p.A, mul(right(norm(sub(p.B, p.A))), p.maxLen)),
        (pos) => ({ maxLen: Math.max(50, project(pos, p.A, right(norm(sub(p.B, p.A))))) })),
    ],
    unitAnchor: 'start',
  },
  "svg-interdict": {
    title: 'Interdict',
    params: { center: P(966, 883), scale: 1, rotation: 0 },
    generate: pointGlyph({
      strokes: [
        { pts: [P(645, -545), P(819, -545), P(819, -381), P(819, -545), P(95, -66)] },
        { pts: [P(-116, 65), P(-819, 545)] },
        { pts: [P(-819, -1), P(-116, -1)] },
        { pts: [P(95, -1), P(814, -1), P(650, -163), P(814, -1), P(650, 163)] },
      ],
      fills: [[P(-36, -147), P(-36, 163), P(30, 163), P(30, -147)]],
    }),
    handles: glyphHandles(819),
    unitAnchor: 'center',
  },
  "svg-neutralize": {
    title: 'Neutralize',
    params: { center: P(966, 886), scale: 1, rotation: 0 },
    generate: pointGlyph({
      strokes: [
        { pts: [P(177, 128), P(814, 542)] },
        { pts: [P(-210, -133), P(-814, -542)] },
        { pts: [P(-210, 133), P(-814, 542)], dashed: true },
        { pts: [P(177, -128), P(814, -542)], dashed: true },
      ],
      fills: [[P(-133, 161), P(-133, -156), P(-69, -156), P(57, 46), P(57, -156), P(123, -156), P(123, 161), P(57, 161), P(-69, -41), P(-69, 161)]],
    }),
    handles: glyphHandles(814),
    unitAnchor: 'center',
  },
  "svg-retain": {
    title: 'Retain',
    params: { center: P(974, 895), radius: 596, gapAngle: 165, gapHalf: 15, tickCount: 16, tickLen: 170, headLen: 150, labelAngle: 0, label: 'R', labelSize: 144 },
    generate(p: Params): Part[] {
      const parts: Part[] = [];
      const gaps = p.label ? [{ angle: p.labelAngle, half: labelGapHalf(p.label, p.labelSize) / (p.radius * Math.PI / 180) }] : [];
      circleArcs(p.center, p.radius, p.gapAngle, p.gapHalf, gaps).forEach(d => parts.push(stroke(d)));
      const a0 = p.gapAngle - p.gapHalf, S = 360 - 2 * p.gapHalf;
      for (let k = 1; k <= p.tickCount; k++) {
        const th = a0 - k * S / (p.tickCount + 1);
        parts.push(stroke(lineD(onCircle(p.center, p.radius, th), onCircle(p.center, p.radius + p.tickLen, th))));
      }
      const tip = onCircle(p.center, p.radius, a0), dir = gapArrowDir(a0);
      parts.push(stroke(chevron(tip, dir, p.headLen, 40)));
      parts.push(stroke(chevron(add(tip, mul(dir, -p.headLen * 0.45)), dir, p.headLen, 40)));
      if (p.label) parts.push(textP(p.label, onCircle(p.center, p.radius, p.labelAngle), p.labelSize, p.labelAngle + 90));
      return parts;
    },
    handles: circleHandles,
    unitAnchor: 'center',
  },
  "svg-contain": {
    title: 'Contain',
    params: { center: P(750, 882), radius: 585, rotation: 0, tickCount: 10, tickLen: 196, arrowFrom: P(1917, 882), chevLen: 142, chevSpread: 35, label: 'ENY', labelSize: 185, apexLabel: 'C', apexLabelSize: 185 },
    generate(p: Params): Part[] {
      const parts: Part[] = [];
      const apex = p.rotation + 180;
      const gaps = p.apexLabel ? [{ angle: apex, half: labelGapHalf(p.apexLabel, p.apexLabelSize) / (p.radius * Math.PI / 180) }] : [];
      circleArcs(p.center, p.radius, p.rotation, 90, gaps).forEach(d => parts.push(stroke(d)));
      const a0 = p.rotation - 90;
      for (let k = 1; k <= p.tickCount; k++) {
        const th = a0 - k * 180 / (p.tickCount + 1);
        if (Math.abs((((th - apex) % 360) + 540) % 360 - 180) < 8) continue;
        parts.push(stroke(lineD(onCircle(p.center, p.radius, th), onCircle(p.center, p.radius - p.tickLen, th))));
      }
      if (p.apexLabel) parts.push(textP(p.apexLabel, onCircle(p.center, p.radius, apex), p.apexLabelSize));
      const dir = norm(sub(p.center, p.arrowFrom));
      const mid = lerp(p.arrowFrom, p.center, 0.5);
      lineWithGap(p.arrowFrom, p.center, mid, labelGapHalf(p.label, p.labelSize)).forEach(d => parts.push(stroke(d)));
      parts.push(stroke(chevron(p.center, dir, p.chevLen, p.chevSpread)));
      parts.push(textP(p.label, mid, p.labelSize));
      return parts;
    },
    handles: (p: Params): EngineHandle[] => [
      hPoint('center', p), hPoint('arrowFrom', p),
      hScalar('radius', onCircle(p.center, p.radius, p.rotation + 180),
        (pos) => ({ radius: Math.max(60, dist(pos, p.center)), rotation: angleOf(sub(pos, p.center)) - 180 })),
    ],
    unitAnchor: 'center',
  },
  "svg-counterattack-by-fire": {
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
    unitAnchor: 'start',
  },
  "svg-fix": {
    title: 'Fix',
    params: { A: P(244, 889), B: P(1890, 889), t0: 0.15, t1: 0.75, peaks: 6, amp: 164, chevLen: 465, chevSpread: 45, label: 'F', labelSize: 218 },
    generate(p: Params): Part[] {
      const dir = norm(sub(p.B, p.A)), n = perp(dir);
      const z0 = lerp(p.A, p.B, p.t0), z1 = lerp(p.A, p.B, p.t1);
      const pts = [p.A, z0];
      for (let k = 1; k <= p.peaks; k++) {
        const t = (k - 0.5) / p.peaks;
        pts.push(add(lerp(z0, z1, t), mul(n, (k % 2 ? -1 : 1) * p.amp)));
      }
      pts.push(z1, p.B);
      const parts: Part[] = [stroke(polyD(pts))];
      parts.push(stroke(chevron(p.B, dir, p.chevLen, p.chevSpread)));
      if (p.label) parts.push(textP(p.label, add(p.A, mul(dir, -10)), p.labelSize));
      return parts;
    },
    handles: (p: Params): EngineHandle[] => {
      const dir = norm(sub(p.B, p.A)), n = perp(dir);
      const z0 = lerp(p.A, p.B, p.t0), z1 = lerp(p.A, p.B, p.t1);
      return [
        hPoint('A', p), hPoint('B', p),
        hScalar('amp', add(lerp(z0, z1, 0.5 / p.peaks), mul(n, -p.amp)),
          (pos) => ({ amp: Math.max(20, Math.abs(project(pos, lerp(p.A, p.B, 0.5), n))) })),
      ];
    },
    unitAnchor: 'start',
  },
  "svg-follow-and-assume": {
    title: 'Follow And Assume',
    params: { A: P(36, 890), B: P(1906, 890), boxHalf: 175, boxRectLen: 431, boxPointLen: 604, headLen: 431, headOuterHalf: 435, headInnerHalf: 289, headInnerLen: 143 },
    generate(p: Params): Part[] {
      const d = norm(sub(p.B, p.A)), n = perp(d);
      const parts: Part[] = [];
      const pTip = add(p.A, mul(d, p.boxPointLen));
      parts.push(stroke(polyD([
        add(p.A, mul(n, p.boxHalf)), add(add(p.A, mul(d, p.boxRectLen)), mul(n, p.boxHalf)),
        pTip,
        add(add(p.A, mul(d, p.boxRectLen)), mul(n, -p.boxHalf)), add(p.A, mul(n, -p.boxHalf)),
      ], true)));
      const base = sub(p.B, mul(d, p.headLen));
      const inner = sub(p.B, mul(d, p.headInnerLen));
      parts.push(stroke(polyD([
        p.B, add(base, mul(n, p.headOuterHalf)), add(base, mul(n, p.headInnerHalf)),
        inner,
        add(base, mul(n, -p.headInnerHalf)), add(base, mul(n, -p.headOuterHalf)),
      ], true)));
      parts.push(stroke(lineD(pTip, add(base, mul(d, (p.headLen - p.headInnerLen) * 0.66))), true));
      return parts;
    },
    handles: (p: Params): EngineHandle[] => [hPoint('A', p), hPoint('B', p)],
    unitAnchor: 'start',
  },
  "svg-follow-and-support": {
    title: 'Follow And Support',
    params: { A: P(43, 889), B: P(1895, 888), boxHalf: 167, boxLen: 842, notch: 168, headLen: 287, headHalf: 167 },
    generate(p: Params): Part[] {
      const d = norm(sub(p.B, p.A)), n = perp(d);
      const parts: Part[] = [];
      const boxTip = add(p.A, mul(d, p.boxLen));
      parts.push(stroke(polyD([
        add(p.A, mul(d, p.notch)),
        add(p.A, mul(n, p.boxHalf)), add(add(p.A, mul(d, p.boxLen - p.notch)), mul(n, p.boxHalf)),
        boxTip,
        add(add(p.A, mul(d, p.boxLen - p.notch)), mul(n, -p.boxHalf)), add(p.A, mul(n, -p.boxHalf)),
      ], true)));
      const base = sub(p.B, mul(d, p.headLen));
      parts.push(stroke(lineD(boxTip, base)));
      parts.push(fillP(polyD([p.B, add(base, mul(n, p.headHalf)), add(base, mul(n, -p.headHalf))], true)));
      return parts;
    },
    handles: (p: Params): EngineHandle[] => [hPoint('A', p), hPoint('B', p)],
    unitAnchor: 'start',
  },
  "svg-isolate": {
    title: 'Isolate',
    params: { center: P(973, 891), radius: 858, gapAngle: 165, gapHalf: 15, headLen: 243, inwardCount: 7, inwardDepth: 0.23, inwardSpread: 7.8 },
    generate(p: Params): Part[] {
      const parts: Part[] = [];
      circleArcs(p.center, p.radius, p.gapAngle, p.gapHalf).forEach(d => parts.push(stroke(d)));
      const a0 = p.gapAngle - p.gapHalf, S = 360 - 2 * p.gapHalf;
      parts.push(stroke(chevron(onCircle(p.center, p.radius, a0), gapArrowDir(a0), p.headLen, 45)));
      for (let k = 1; k <= p.inwardCount; k++) {
        const th = a0 - k * S / (p.inwardCount + 1);
        const v = onCircle(p.center, p.radius * (1 - p.inwardDepth), th);
        parts.push(stroke(polyD([onCircle(p.center, p.radius, th - p.inwardSpread), v, onCircle(p.center, p.radius, th + p.inwardSpread)])));
      }
      return parts;
    },
    handles: circleHandles,
    unitAnchor: 'center',
  },
  "svg-occupy": {
    title: 'Occupy',
    params: { center: P(977, 890), radius: 847, gapAngle: 165, gapHalf: 15, armHalf: 245, labelAngle: 0, label: 'O', labelSize: 144 },
    generate(p: Params): Part[] {
      const parts: Part[] = [];
      const gaps = p.label ? [{ angle: p.labelAngle, half: labelGapHalf(p.label, p.labelSize) / (p.radius * Math.PI / 180) }] : [];
      circleArcs(p.center, p.radius, p.gapAngle, p.gapHalf, gaps).forEach(d => parts.push(stroke(d)));
      const a0 = p.gapAngle - p.gapHalf;
      const c = onCircle(p.center, p.radius, a0);
      const tang = angleOf(gapArrowDir(a0));
      for (const off of [-45, 45]) {
        const d = rot(P(1, 0), tang + off);
        parts.push(stroke(lineD(add(c, mul(d, -p.armHalf)), add(c, mul(d, p.armHalf)))));
      }
      if (p.label) parts.push(textP(p.label, onCircle(p.center, p.radius, p.labelAngle), p.labelSize, p.labelAngle + 90));
      return parts;
    },
    handles: circleHandles,
    unitAnchor: 'center',
  },
  "svg-secure": {
    title: 'Secure',
    params: { center: P(916, 890), radius: 865, gapAngle: 165, gapHalf: 15, headLen: 243, labelAngle: 0, label: 'S', labelSize: 144 },
    generate(p: Params): Part[] {
      const parts: Part[] = [];
      const gaps = p.label ? [{ angle: p.labelAngle, half: labelGapHalf(p.label, p.labelSize) / (p.radius * Math.PI / 180) }] : [];
      circleArcs(p.center, p.radius, p.gapAngle, p.gapHalf, gaps).forEach(d => parts.push(stroke(d)));
      const a0 = p.gapAngle - p.gapHalf;
      parts.push(stroke(chevron(onCircle(p.center, p.radius, a0), gapArrowDir(a0), p.headLen, 45)));
      if (p.label) parts.push(textP(p.label, onCircle(p.center, p.radius, p.labelAngle), p.labelSize, p.labelAngle + 90));
      return parts;
    },
    handles: circleHandles,
    unitAnchor: 'center',
  },
  "svg-retirement-arc": {
    title: 'Retirement',
    params: { A: P(36, 1235), B: P(1474, 1235), r: 430, headLen: 222, headSpread: 45, label: 'R', labelSize: 218 },
    generate: retrogradeArcFamily,
    handles: retrogradeArcHandles,
    unitAnchor: 'midline',
  },
  "svg-delay-arc": { title: 'Delay (D, arc)', params: { A: P(300, 1500), B: P(1700, 1500), r: 420, headLen: 220, headSpread: 45, label: 'D', labelSize: 210 }, generate: retrogradeArcFamily, handles: retrogradeArcHandles, unitAnchor: 'midline' },
  "svg-withdraw-arc": { title: 'Withdraw (W, arc)', params: { A: P(300, 1500), B: P(1700, 1500), r: 420, headLen: 220, headSpread: 45, label: 'W', labelSize: 210 }, generate: retrogradeArcFamily, handles: retrogradeArcHandles, unitAnchor: 'midline' },
  "svg-withdraw-pressure-arc": { title: 'Withdraw Under Pressure (WP, arc)', params: { A: P(300, 1500), B: P(1700, 1500), r: 420, headLen: 220, headSpread: 45, label: 'WP', labelSize: 200 }, generate: retrogradeArcFamily, handles: retrogradeArcHandles, unitAnchor: 'midline' },
  "svg-retrograde-notch": { title: 'Retrograde Bracket (unlabeled)', params: { A: P(300, 1500), B: P(1700, 1500), r: 420, headLen: 220, headSpread: 45, label: '', labelSize: 210 }, generate: retrogradeArcFamily, handles: retrogradeArcHandles, unitAnchor: 'midline' },
  "svg-screen-post": {
    title: 'Screen (with Observation Post)',
    params: { center: P(750, 900), radius: 700, gapAngle: 165, gapHalf: 15, headLen: 200, labelAngle: 0, label: 'S', labelSize: 160, post: P(1550, 900), postRadius: 120 },
    generate(p: Params): Part[] {
      const parts: Part[] = [];
      const gaps = p.label ? [{ angle: p.labelAngle, half: labelGapHalf(p.label, p.labelSize) / (p.radius * Math.PI / 180) }] : [];
      circleArcs(p.center, p.radius, p.gapAngle, p.gapHalf, gaps).forEach((d) => parts.push(stroke(d)));
      const a0 = p.gapAngle - p.gapHalf;
      parts.push(stroke(chevron(onCircle(p.center, p.radius, a0), gapArrowDir(a0), p.headLen, 45)));
      if (p.label) parts.push(textP(p.label, onCircle(p.center, p.radius, p.labelAngle), p.labelSize, p.labelAngle + 90));
      parts.push(stroke(
        `M${(p.post.x - p.postRadius).toFixed(1)},${p.post.y.toFixed(1)} A${p.postRadius.toFixed(1)},${p.postRadius.toFixed(1)} 0 1,0 ${(p.post.x + p.postRadius).toFixed(1)},${p.post.y.toFixed(1)} A${p.postRadius.toFixed(1)},${p.postRadius.toFixed(1)} 0 1,0 ${(p.post.x - p.postRadius).toFixed(1)},${p.post.y.toFixed(1)}`,
      ));
      return parts;
    },
    handles(p: Params): EngineHandle[] {
      return [
        ...circleHandles(p),
        hPoint('post', p),
        hScalar('postRadius', add(p.post, P(p.postRadius, 0)), (pos) => ({ postRadius: Math.max(30, dist(pos, p.post)) })),
      ];
    },
    unitAnchor: 'center',
  },
  "svg-blob-atk": { title: 'Attack Position (ATK)', params: { center: P(1050, 950), radius: 480, wobble: 0.22, label: 'ATK', labelSize: 150 }, generate: blobFamily, handles: blobHandles, unitAnchor: 'center' },
  "svg-blob-atk-alt": { title: 'Attack Position (ATK, alt.)', params: { center: P(1050, 950), radius: 560, wobble: 0.32, label: 'ATK', labelSize: 150 }, generate: blobFamily, handles: blobHandles, unitAnchor: 'center' },
  "svg-blob-obj": { title: 'Objective (OBJ)', params: { center: P(1050, 950), radius: 480, wobble: 0.22, label: 'OBJ', labelSize: 150 }, generate: blobFamily, handles: blobHandles, unitAnchor: 'center' },
  "svg-blob-aa": { title: 'Assembly Area (AA)', params: { center: P(1050, 950), radius: 560, wobble: 0.26, label: 'AA', labelSize: 180 }, generate: blobFamily, handles: blobHandles, unitAnchor: 'center' },
  "svg-blob-aslt-psn": { title: 'Assault Position (ASLT PSN)', params: { center: P(1050, 950), radius: 620, wobble: 0.24, label: ['ASLT', 'PSN'], labelSize: 190 }, generate: blobFamily, handles: blobHandles, unitAnchor: 'center' },
  "svg-blob-penetration-box": { title: 'Penetration Box', params: { center: P(1050, 950), radius: 480, wobble: 0.22, label: '', labelSize: 150 }, generate: blobFamily, handles: blobHandles, unitAnchor: 'center' },
  "svg-wire-x": { title: 'Wire Obstacle (X row)', params: { A: P(200, 950), B: P(1900, 950), count: 5, tickSize: 90, tickShape: 'x', dashed: false, headArrow: false }, generate: tickRowFamily, handles: tickRowHandles, unitAnchor: 'midline' },
  "svg-minefield-square": { title: 'Minefield Marker (square row)', params: { A: P(200, 950), B: P(1900, 950), count: 4, tickSize: 100, tickShape: 'square', dashed: false, headArrow: false }, generate: tickRowFamily, handles: tickRowHandles, unitAnchor: 'midline' },
  "svg-abatis-triangle": { title: 'Abatis / Obstacle Row (triangle)', params: { A: P(200, 950), B: P(1900, 950), count: 4, tickSize: 110, tickShape: 'triangle', dashed: false, headArrow: false }, generate: tickRowFamily, handles: tickRowHandles, unitAnchor: 'midline' },
  "svg-wire-chevron": { title: 'Wire Obstacle (chevron wave)', params: { A: P(200, 950), B: P(1900, 950), count: 6, tickSize: 130, tickShape: 'chevron', dashed: false, headArrow: false }, generate: tickRowFamily, handles: tickRowHandles, unitAnchor: 'midline' },
  "svg-wire-tick-line": { title: 'Wire Line (ticked, with arrow)', params: { A: P(200, 950), B: P(1900, 950), count: 9, tickSize: 70, tickShape: 'bar', dashed: false, headArrow: true }, generate: tickRowFamily, handles: tickRowHandles, unitAnchor: 'midline' },
  "svg-fortified-area": {
    title: 'Fortified Area (ticked loop)',
    params: { center: P(950, 900), radius: 650, tickCount: 14, tickLen: 150 },
    generate(p: Params): Part[] {
      const parts: Part[] = [stroke(
        `M${(p.center.x + p.radius).toFixed(1)},${p.center.y.toFixed(1)} A${p.radius.toFixed(1)},${p.radius.toFixed(1)} 0 1,0 ${(p.center.x - p.radius).toFixed(1)},${p.center.y.toFixed(1)} A${p.radius.toFixed(1)},${p.radius.toFixed(1)} 0 1,0 ${(p.center.x + p.radius).toFixed(1)},${p.center.y.toFixed(1)}`,
      )];
      for (let k = 0; k < p.tickCount; k++) {
        const th = (k * 360) / p.tickCount;
        parts.push(stroke(lineD(onCircle(p.center, p.radius, th), onCircle(p.center, p.radius + p.tickLen, th))));
      }
      return parts;
    },
    handles(p: Params): EngineHandle[] {
      return [
        hPoint('center', p),
        hScalar('radius', onCircle(p.center, p.radius, 45), (pos) => ({ radius: Math.max(80, dist(pos, p.center)) })),
        hScalar('tickLen', onCircle(p.center, p.radius + p.tickLen, 0),
          (pos) => ({ tickLen: Math.max(20, dist(pos, p.center) - p.radius) })),
      ];
    },
    unitAnchor: 'center',
  },
  "svg-axis-notched": { title: 'Axis of Advance (notched)', params: { spine: [P(60, 1500), P(60, 700), P(600, 300), P(1900, 300)], halfWidth: 200, headLen: 300, headHalf: 260, dashed: false }, generate(p: Params) { return [axisOfAdvance(p as any)]; }, handles: axisHandles, unitAnchor: 'start' },
  "svg-axis-notched-simple": { title: 'Axis of Advance (simple step)', params: { spine: [P(60, 1500), P(60, 700), P(1900, 700)], halfWidth: 180, headLen: 260, headHalf: 220, dashed: false }, generate(p: Params) { return [axisOfAdvance(p as any)]; }, handles: axisHandles, unitAnchor: 'start' },
  "svg-axis-notched-wide": { title: 'Axis of Advance (wide step)', params: { spine: [P(60, 1600), P(500, 900), P(700, 900), P(1900, 300)], halfWidth: 220, headLen: 300, headHalf: 260, dashed: false }, generate(p: Params) { return [axisOfAdvance(p as any)]; }, handles: axisHandles, unitAnchor: 'start' },
  "svg-gate-crossing": { title: 'Crossing Point / Gate', params: { P1: P(1750, 200), P2: P(1750, 1600), depth: 700, flagLen: 180 }, generate: gateBracketFamily, handles: gateBracketHandles, unitAnchor: 'midline' },
  "svg-lane-marker": { title: 'Lane Marker', params: { A: P(200, 900), B: P(1900, 900), bandHalf: 90, capLen: 180, capHalf: 160 }, generate: laneMarkerFamily, handles: laneMarkerHandles, unitAnchor: 'midline' },
  "svg-two-way-route": { title: 'Two-Way Route / Axis', params: { A: P(200, 900), B: P(1900, 900), headLen: 160, headSpread: 40 }, generate: twoWayArrowFamily, handles: twoWayArrowHandles, unitAnchor: 'start' },
  "svg-main-attack": {
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
  },
  "svg-supporting-attack": {
    title: 'Supporting Attack',
    params: { spine: [P(300, 1816), P(300, 867), P(750, 580), P(1829, 580)], halfWidth: 260, headLen: 601, headHalf: 521 },
    generate(p: Params): Part[] { return [axisOfAdvance(p as any)]; },
    handles: axisHandles,
    unitAnchor: 'start',
  },
  "svg-aviation-axis-of-advance": {
    title: 'Aviation Axis Of Advance',
    params: { spine: [P(400, 2172), P(400, 958), P(765, 373), P(1442, 698), P(2503, 698)], halfWidth: 234, headLen: 531, headHalf: 325 },
    generate(p: Params): Part[] { return [axisOfAdvance(p as any)]; },
    handles: axisHandles,
    unitAnchor: 'start',
  },
  "svg-ambush": {
    title: 'Ambush',
    params: { A: P(500, 100), B: P(500, 1200), peaks: 4, amp: 170, tickCount: 5, tickReach: 350, arrowLen: 950, arrowHeadLen: 150, arrowHeadSpread: 35 },
    generate(p: Params): Part[] {
      const parts: Part[] = [];
      const dir = norm(sub(p.B, p.A));
      const n = perp(dir);
      const curvePts: Pt[] = [p.A];
      for (let k = 1; k <= p.peaks; k++) {
        const t = k / (p.peaks + 1);
        const side = k % 2 === 1 ? 1 : -1;
        curvePts.push(add(lerp(p.A, p.B, t), mul(n, side * p.amp)));
      }
      curvePts.push(p.B);
      parts.push(stroke(polyD(curvePts)));
      for (let i = 0; i < p.tickCount; i++) {
        const t = (i + 0.5) / p.tickCount;
        const segT = t * (curvePts.length - 1);
        const i0 = Math.min(curvePts.length - 2, Math.floor(segT));
        const localT = segT - i0;
        const curvePos = lerp(curvePts[i0], curvePts[i0 + 1], localT);
        const target = add(curvePos, mul(n, -p.tickReach));
        parts.push(stroke(lineD(curvePos, target)));
      }
      const mid = lerp(p.A, p.B, 0.5);
      const arrowTip = add(mid, mul(n, p.arrowLen));
      parts.push(stroke(lineD(mid, arrowTip)));
      parts.push(stroke(chevron(arrowTip, n, p.arrowHeadLen, p.arrowHeadSpread)));
      return parts;
    },
    handles(p: Params): EngineHandle[] {
      const dir = norm(sub(p.B, p.A)), n = perp(dir);
      const mid = lerp(p.A, p.B, 0.5);
      const firstPeakBase = lerp(p.A, p.B, 1 / (p.peaks + 1));
      const firstTickBase = lerp(p.A, p.B, 0.5 / p.tickCount);
      return [
        hPoint('A', p), hPoint('B', p),
        hScalar('amp', add(firstPeakBase, mul(n, p.amp)),
          (pos) => ({ amp: Math.max(20, Math.abs(project(pos, firstPeakBase, n))) })),
        hScalar('arrowLen', add(mid, mul(n, p.arrowLen)),
          (pos) => ({ arrowLen: Math.max(60, project(pos, mid, n)) })),
        hScalar('tickReach', add(firstTickBase, mul(n, -p.tickReach)),
          (pos) => ({ tickReach: Math.max(20, -project(pos, firstTickBase, n)) })),
      ];
    },
    unitAnchor: 'start',
  },
  "svg-support-by-fire-position": {
    title: 'Support By Fire Position',
    params: {
      topOuter: P(46, 189), bendTop: P(272, 416), bendBottom: P(272, 1549), bottomOuter: P(46, 1776),
      wingTopTip: P(839, 41), wingBottomTip: P(839, 1924),
      notchTopA: P(662, 347), notchTopB: P(488, 83), notchBottomA: P(488, 1882), notchBottomB: P(662, 1618),
    },
    generate(p: Params): Part[] {
      return [
        stroke(polyD([p.topOuter, p.bendTop, p.bendBottom, p.bottomOuter])),
        stroke(lineD(p.bendTop, p.wingTopTip)),
        stroke(polyD([p.notchTopA, p.wingTopTip, p.notchTopB])),
        stroke(lineD(p.bendBottom, p.wingBottomTip)),
        stroke(polyD([p.notchBottomA, p.wingBottomTip, p.notchBottomB])),
      ];
    },
    handles(p: Params): EngineHandle[] {
      return ['topOuter', 'bendTop', 'bendBottom', 'bottomOuter', 'wingTopTip', 'wingBottomTip', 'notchTopA', 'notchTopB', 'notchBottomA', 'notchBottomB']
        .map((k) => hPoint(k, p));
    },
    unitAnchor: 'center',
  },
  "svg-guard-gg": {
    title: 'Guard',
    params: { A: P(150, 499), B: P(99, 872), peaks: 3, amp: 140, hookLen: 260, hookAngle: 130, copies: 2, spacing: 900, label: 'G', labelSize: 160 },
    generate: zigzagHookFamily,
    handles: zigzagHookHandles,
    unitAnchor: 'start',
  },
  "svg-cover-cc": {
    title: 'Cover',
    params: { A: P(150, 499), B: P(99, 872), peaks: 3, amp: 140, hookLen: 260, hookAngle: 130, copies: 2, spacing: 900, label: 'C', labelSize: 160 },
    generate: zigzagHookFamily,
    handles: zigzagHookHandles,
    unitAnchor: 'start',
  },
};