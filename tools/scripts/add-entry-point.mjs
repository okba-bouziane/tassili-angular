#!/usr/bin/env node
/**
 * Scaffolds a @tassili/ui secondary entry point.
 *   node tools/scripts/add-entry-point.mjs <name>
 * Creates libs/ui/<name>/{ng-package.json,src/index.ts} and the tsconfig path alias.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('Usage: node tools/scripts/add-entry-point.mjs <kebab-case-name>');
  process.exit(1);
}

const dir = `libs/ui/${name}`;
if (existsSync(dir)) {
  console.error(`${dir} already exists`);
  process.exit(1);
}
mkdirSync(`${dir}/src`, { recursive: true });
writeFileSync(
  `${dir}/ng-package.json`,
  `${JSON.stringify({ lib: { entryFile: 'src/index.ts' } }, null, 2)}\n`,
);
writeFileSync(`${dir}/src/index.ts`, '');

const tsconfigPath = 'tsconfig.base.json';
const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
const paths = {
  ...tsconfig.compilerOptions.paths,
  [`@tassili/ui/${name}`]: [`./${dir}/src/index.ts`],
};
tsconfig.compilerOptions.paths = Object.fromEntries(
  Object.entries(paths).sort(([a], [b]) => a.localeCompare(b)),
);
writeFileSync(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);

console.log(`Created @tassili/ui/${name} at ${dir}`);
