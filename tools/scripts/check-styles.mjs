#!/usr/bin/env node
/**
 * Enforces two design-system rules that ESLint cannot see inside class strings:
 *
 * 1. RTL: only logical directions (ms-*, pe-*, start-*, border-s, text-start…).
 * 2. Tokens only: no hard-coded colors or arbitrary px/rem values.
 *
 * Opt out on one line with a reason:  tsl-allow-style: <why>
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOTS = ['libs/ui', 'apps/template/src'];
const EXTENSIONS = new Set(['.ts', '.html', '.css', '.mdx']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.angular', 'storybook-static']);
const ALLOW_MARKER = 'tsl-allow-style:';

const PHYSICAL_UTILITY =
  /(?<![\w-])-?(?:m[lr]|p[lr]|scroll-m[lr]|scroll-p[lr]|left|right|border-[lr]|rounded-[lr]|rounded-[tb][lr]|inset-[lr]|translate-x-(?!0\b)|space-x-reverse|divide-x-reverse)(?:-[\w./[\]()%-]+)?(?![\w-])/;
const PHYSICAL_KEYWORD =
  /(?<![\w-])(?:text-left|text-right|float-left|float-right|clear-left|clear-right)(?![\w-])/;
const PHYSICAL_CSS =
  /(?:^|[\s;{])(?:margin-left|margin-right|padding-left|padding-right|border-left|border-right|left|right)\s*:|text-align\s*:\s*(?:left|right)/;

const HARD_COLOR =
  /\[#[0-9a-fA-F]{3,8}\]|:\s*#[0-9a-fA-F]{3,8}\b|['"`]#[0-9a-fA-F]{3,8}['"`]|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/;
const ARBITRARY_LENGTH = /-\[-?\d*\.?\d+(?:px|rem|em|vh|vw|%)\]/;

const rules = [
  {
    name: 'physical direction utility (use ms/me/ps/pe/start/end)',
    test: PHYSICAL_UTILITY,
    scope: 'classes',
  },
  {
    name: 'physical alignment keyword (use text-start/text-end)',
    test: PHYSICAL_KEYWORD,
    scope: 'all',
  },
  { name: 'physical CSS property (use logical properties)', test: PHYSICAL_CSS, scope: 'css' },
  { name: 'hard-coded color (use a token)', test: HARD_COLOR, scope: 'all' },
  {
    name: 'arbitrary length (use the spacing scale or a token)',
    test: ARBITRARY_LENGTH,
    scope: 'all',
  },
];

function* walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (EXTENSIONS.has(extname(path))) yield path;
  }
}

/** Class-like content: quoted strings in TS/HTML (where Tailwind classes live). */
function classCandidates(line) {
  return [...line.matchAll(/(['"`])((?:(?!\1).)*)\1/g)].map((match) => match[2]);
}

const violations = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const isCss = file.endsWith('.css');
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (line.includes(ALLOW_MARKER)) return;
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
        for (const rule of rules) {
          if (rule.scope === 'css' && !isCss) continue;
          const targets = rule.scope === 'classes' ? (isCss ? [] : classCandidates(line)) : [line];
          const hit = targets.find((text) => rule.test.test(text));
          if (hit !== undefined) {
            violations.push(
              `${relative(process.cwd(), file)}:${index + 1}  ${rule.name}\n    ${trimmed}`,
            );
          }
        }
      });
  }
}

if (violations.length > 0) {
  console.error(`Style check failed (${violations.length}):\n\n${violations.join('\n')}`);
  console.error(`\nAdd "${ALLOW_MARKER} <reason>" to the line only if the exception is justified.`);
  process.exit(1);
}
console.log('Style check passed: logical directions and tokens only.');
