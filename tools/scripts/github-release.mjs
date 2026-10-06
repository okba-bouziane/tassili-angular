#!/usr/bin/env node
/**
 * Packs @tassili/tokens and @tassili/ui into dist/packages/*.tgz and, when run with
 * --publish, attaches them to a GitHub Release tagged v<version>.
 *
 *   node tools/scripts/github-release.mjs            pack only (run `pnpm build` first)
 *   node tools/scripts/github-release.mjs --publish  pack + create the release (CI, needs GH_TOKEN)
 *
 * Both packages share one version (Changesets "fixed" group). The release is skipped
 * when the tag already exists or the version is still 0.0.0.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT = resolve('dist/packages');
const PACKAGES = [
  {
    name: '@tassili/tokens',
    manifest: 'libs/tokens/package.json',
    dir: 'libs/tokens',
    changelog: 'libs/tokens/CHANGELOG.md',
  },
  {
    name: '@tassili/ui',
    manifest: 'libs/ui/package.json',
    dir: 'dist/libs/ui',
    changelog: 'libs/ui/CHANGELOG.md',
  },
];
const REPO = 'okba-bouziane/tassili-angular';

const run = (command, args, options = {}) =>
  execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    ...options,
  }).trim();

const versions = new Set(
  PACKAGES.map((pkg) => JSON.parse(readFileSync(pkg.manifest, 'utf8')).version),
);
if (versions.size !== 1) {
  throw new Error(`Packages must share one version, found: ${[...versions].join(', ')}`);
}
const [version] = versions;
const tag = `v${version}`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const files = PACKAGES.map((pkg) => {
  const tarball = run('npm', ['pack', '--pack-destination', OUT], { cwd: resolve(pkg.dir) })
    .split('\n')
    .pop();
  return resolve(OUT, tarball);
});
console.log(`Packed ${tag}:\n  ${files.join('\n  ')}`);

if (!process.argv.includes('--publish')) {
  process.exit(0);
}
if (version === '0.0.0') {
  console.log('Version is 0.0.0; nothing to release yet.');
  process.exit(0);
}
const existing = run('git', ['ls-remote', '--tags', 'origin', `refs/tags/${tag}`]);
if (existing) {
  console.log(`${tag} already released; skipping.`);
  process.exit(0);
}

/** Section of a Changesets CHANGELOG for one version. */
function changelogSection(path) {
  try {
    const text = readFileSync(path, 'utf8');
    const start = text.indexOf(`## ${version}`);
    if (start === -1) return '';
    const next = text.indexOf('\n## ', start + 1);
    return text.slice(start, next === -1 ? undefined : next).trim();
  } catch {
    return '';
  }
}

const base = `https://github.com/${REPO}/releases/download/${tag}`;
const notes = `## Install

\`\`\`bash
pnpm add ${base}/tassili-tokens-${version}.tgz ${base}/tassili-ui-${version}.tgz
\`\`\`

${PACKAGES.map((pkg) => changelogSection(pkg.changelog).replace(/^## .*/, `### ${pkg.name}`)).join('\n\n')}
`;
const notesFile = resolve(OUT, 'RELEASE_NOTES.md');
writeFileSync(notesFile, notes);

run(
  'gh',
  [
    'release',
    'create',
    tag,
    ...files,
    '--repo',
    REPO,
    '--title',
    `Tassili ${tag}`,
    '--notes-file',
    notesFile,
  ],
  {
    stdio: 'inherit',
  },
);
console.log(`Released ${tag}`);
