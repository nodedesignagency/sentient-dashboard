/** Angles are degrees from 12 o'clock, increasing clockwise. */
export function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

export function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const a = polar(cx, cy, r, startDeg);
  const b = polar(cx, cy, r, endDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg >= startDeg ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} ${sweep} ${b.x} ${b.y}`;
}

export const arcLength = (r: number, spanDeg: number) => (Math.abs(spanDeg) * Math.PI * r) / 180;
