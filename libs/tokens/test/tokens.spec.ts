import { describe, expect, it } from 'vitest';
import { customProperties, Declarations, readSource, ruleBody } from './css';
import { contrastRatio, isInSrgbGamut, Oklch, parseOklch } from './oklch';

const tokensCss = readSource('tokens.css');
const light = customProperties(ruleBody(tokensCss, ":root,\n[data-theme='light']"));
const dark = customProperties(ruleBody(tokensCss, "[data-theme='dark']"));
const systemDark = customProperties(ruleBody(tokensCss, ':root:not([data-theme])'));
const oasis = {
  ...light,
  ...customProperties(ruleBody(readSource('themes/oasis.css'), "[data-theme='oasis']")),
};

const themes: Record<string, Declarations> = { light, dark, oasis };

const TEXT = 4.5;
const LARGE_OR_UI = 3;

/** [foreground, background, minimum ratio] using token names without the --tsl-color- prefix. */
const pairs: [string, string, number][] = [
  ['foreground', 'background', 7],
  ['card-foreground', 'card', 7],
  ['popover-foreground', 'popover', 7],
  ['muted-foreground', 'background', TEXT],
  ['muted-foreground', 'muted', TEXT],
  ['muted-foreground', 'card', TEXT],
  ['primary-foreground', 'primary', TEXT],
  ['primary-foreground', 'primary-hover', TEXT],
  ['secondary-foreground', 'secondary', TEXT],
  ['secondary-foreground', 'secondary-hover', TEXT],
  ['accent-foreground', 'accent', TEXT],
  ['brand-foreground', 'brand', TEXT],
  ['destructive-foreground', 'destructive', TEXT],
  ['destructive-foreground', 'destructive-hover', TEXT],
  ['success-foreground', 'success', TEXT],
  ['warning-foreground', 'warning', TEXT],
  ['info-foreground', 'info', TEXT],
  ['sidebar-foreground', 'sidebar', 7],
  ['sidebar-accent-foreground', 'sidebar-accent', TEXT],
  // Colored text directly on page surfaces (links, inline errors)
  ['primary', 'background', TEXT],
  ['primary', 'card', TEXT],
  ['destructive', 'background', TEXT],
  ['destructive', 'card', TEXT],
  // Non-text UI: focus ring, control outlines, filled indicators (WCAG 1.4.11)
  ['ring', 'background', LARGE_OR_UI],
  ['ring', 'card', LARGE_OR_UI],
  ['input', 'background', LARGE_OR_UI],
  ['input', 'card', LARGE_OR_UI],
  ['success', 'background', LARGE_OR_UI],
  ['info', 'background', LARGE_OR_UI],
  ['brand', 'background', LARGE_OR_UI],
];

function color(theme: Declarations, name: string): Oklch {
  const value = theme[`--tsl-color-${name}`];
  const parsed = value ? parseOklch(value) : null;
  if (!parsed) {
    throw new Error(`--tsl-color-${name} is missing or not an oklch() value: ${value}`);
  }
  return parsed;
}

describe('design tokens', () => {
  for (const [themeName, theme] of Object.entries(themes)) {
    describe(`${themeName} theme`, () => {
      it.each(pairs)('%s on %s meets %d:1', (foreground, background, minimum) => {
        const ratio = contrastRatio(color(theme, foreground), color(theme, background));
        expect(ratio, `${foreground} / ${background} = ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(
          minimum,
        );
      });

      it('keeps every color inside the sRGB gamut', () => {
        const outOfGamut = Object.entries(theme)
          .filter(([name]) => name.startsWith('--tsl-color-'))
          .filter(([, value]) => {
            const parsed = parseOklch(value);
            return parsed !== null && !isInSrgbGamut(parsed);
          })
          .map(([name]) => name);
        expect(outOfGamut).toEqual([]);
      });
    });
  }

  it('defines every light color token in the dark theme', () => {
    const colorNames = (theme: Declarations) =>
      Object.keys(theme).filter(
        (name) => name.startsWith('--tsl-color-') || name.startsWith('--tsl-shadow-'),
      );
    expect(colorNames(dark).sort()).toEqual(colorNames(light).sort());
  });

  it('mirrors the dark theme in the prefers-color-scheme fallback', () => {
    expect(systemDark).toEqual(dark);
  });

  it('maps every color token into the Tailwind theme', () => {
    const tailwind = readSource('tailwind.css');
    const unmapped = Object.keys(light)
      .filter((name) => name.startsWith('--tsl-color-'))
      .filter((name) => !tailwind.includes(`var(${name})`));
    expect(unmapped).toEqual([]);
  });
});
