import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type Declarations = Record<string, string>;

export function readSource(relativePath: string): string {
  return readFileSync(resolve(__dirname, '../src', relativePath), 'utf8');
}

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Returns the body of the first rule whose selector list matches exactly. */
export function ruleBody(css: string, selector: string): string {
  const source = stripComments(css);
  const start = source.indexOf(`${selector} {`);
  if (start === -1) {
    throw new Error(`Selector not found: ${selector}`);
  }
  let depth = 0;
  for (let index = source.indexOf('{', start); index < source.length; index++) {
    if (source[index] === '{') depth++;
    if (source[index] === '}') depth--;
    if (depth === 0) {
      return source.slice(source.indexOf('{', start) + 1, index);
    }
  }
  throw new Error(`Unbalanced rule: ${selector}`);
}

/** Parses `--name: value;` custom property declarations, normalizing whitespace. */
export function customProperties(body: string): Declarations {
  const declarations: Declarations = {};
  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    declarations[match[1]] = match[2].replace(/\s+/g, ' ').trim();
  }
  return declarations;
}
