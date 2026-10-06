/** Minimal OKLCH → sRGB math for WCAG contrast checks (no dependencies). */

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

const OKLCH_PATTERN = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*[\d.]+\s*)?\)$/;

export function parseOklch(value: string): Oklch | null {
  const match = OKLCH_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }
  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) };
}

/** Linear-light sRGB channels; values outside [0, 1] are out of gamut. */
export function toLinearSrgb({ l, c, h }: Oklch): [number, number, number] {
  const radians = (h * Math.PI) / 180;
  const a = c * Math.cos(radians);
  const b = c * Math.sin(radians);
  const lc = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mc = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sc = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  ];
}

export function isInSrgbGamut(color: Oklch, tolerance = 0.002): boolean {
  return toLinearSrgb(color).every((channel) => channel >= -tolerance && channel <= 1 + tolerance);
}

function relativeLuminance(color: Oklch): number {
  const [r, g, b] = toLinearSrgb(color).map((channel) => Math.min(1, Math.max(0, channel)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(first: Oklch, second: Oklch): number {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
