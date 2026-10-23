import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const sourceRoot = fileURLToPath(new URL('../', import.meta.url));
const typescript = createRequire(import.meta.url)('typescript');
const fontFiles = ['NotoSansThai-Variable.woff2', 'NotoSerifThai-Variable.woff2', 'OFL.txt', 'README.md'];
const checksum = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

function checkFonts(site) {
  const layout = typescript.createSourceFile('layout.tsx', readFileSync(join(site, 'app', 'layout.tsx'), 'utf8'), typescript.ScriptTarget.Latest, true, typescript.ScriptKind.TSX);
  const imports = layout.statements.filter(typescript.isImportDeclaration).map((statement) => statement.moduleSpecifier.text);
  assert.ok(imports.includes('next/font/local'), 'Generated layout must load local fonts');
  assert.ok(!imports.includes('next/font/google'), 'Generated layout must build without Google Fonts');
  for (const file of fontFiles) {
    const packaged = join(site, 'app', 'fonts', file);
    assert.ok(existsSync(packaged), `Missing packaged font asset: ${file}`);
    assert.equal(checksum(packaged), checksum(join(sourceRoot, 'app', 'fonts', file)), file);
  }
  const referenced = new Set();
  function visit(node) {
    if (typescript.isPropertyAssignment(node) && node.name.getText(layout) === 'path' && typescript.isStringLiteral(node.initializer)) {
      referenced.add(node.initializer.text);
    }
    typescript.forEachChild(node, visit);
  }
  visit(layout);
  assert.deepEqual([...referenced].sort(), ['./fonts/NotoSansThai-Variable.woff2', './fonts/NotoSerifThai-Variable.woff2']);
}

function listFiles(directory, root = directory, result = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) listFiles(file, root, result);
    else result.push(relative(root, file));
  }
  return result;
}

const templateRoot = join(sourceRoot, 'templates', 'site');
// Rewritten by the pSEO migration after the copy (from the same template files, so they still match).
const migratedFromTemplate = new Set(['lib/site-config.ts', 'components/pseo-page.tsx', 'lib/readiness.ts']);

function checkSiteTemplate(site) {
  for (const file of listFiles(templateRoot)) {
    assert.equal(checksum(join(site, file)), checksum(join(templateRoot, file)), `${file} must come from templates/site${migratedFromTemplate.has(file) ? ' (via the migration)' : ''}`);
  }
  const pkg = JSON.parse(readFileSync(join(site, 'package.json'), 'utf8'));
  const base = JSON.parse(readFileSync(join(sourceRoot, 'package.json'), 'utf8'));
  assert.deepEqual(pkg.dependencies, base.dependencies, 'site dependencies must match the copied lockfile');
  assert.deepEqual(pkg.devDependencies, base.devDependencies, 'site devDependencies must match the copied lockfile');
  assert.equal(pkg.dependencies.next, '16.4.2');
  assert.ok(!('eslint-config-next' in pkg.dependencies), 'eslint-config-next is a devDependency');
  for (const script of ['lint', 'typecheck', 'test', 'check']) assert.ok(pkg.scripts[script], `missing ${script} script`);
  const ci = readFileSync(join(site, '.github', 'workflows', 'ci.yml'), 'utf8');
  assert.match(ci, /bookchaowalit\/platform-ci-workflows\/\.github\/workflows\/ci-node\.yml@[0-9a-f]{40}/);
  assert.match(ci, /require-tests: true/);
  assert.match(ci, /npm run check/);
  assert.ok(existsSync(join(site, 'instrumentation-client.ts')), 'browser Sentry init');
  assert.ok(!existsSync(join(site, 'instrumentation.ts')), 'static export: no server Sentry runtime');
  assert.match(readFileSync(join(site, '.gitignore'), 'utf8'), /\*\.tsbuildinfo/);
}

// One generated site must pass its own lint, typecheck and tests with the shared node_modules.
function checkSiteToolchain(site, run) {
  symlinkSync(join(sourceRoot, 'node_modules'), join(site, 'node_modules'), 'dir');
  const bin = (name) => join(sourceRoot, 'node_modules', name);
  for (const [label, args] of [
    ['tsc', [bin('typescript/bin/tsc'), '--noEmit', '-p', site]],
    ['eslint', [bin('eslint/bin/eslint.js'), site]],
    ['vitest', [bin('vitest/vitest.mjs'), 'run', '--root', site]],
  ]) {
    const result = run(args, site);
    assert.equal(result.status, 0, `${label} failed in the generated site:\n${result.stdout}${result.stderr}`);
  }
  unlinkSync(join(site, 'node_modules'));
}

function snapshot(directory, result = {}, root = directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) snapshot(file, result, root);
    else result[relative(root, file)] = checksum(file);
  }
  return result;
}

test('showcase tools package local fonts and preserve existing targets', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'agency-font-test-'));
  const main = join(fixture, 'agency-main-web');
  try {
    mkdirSync(main);
    for (const directory of ['scripts', 'lib', 'app/fonts', '.github', 'templates']) {
      if (existsSync(join(sourceRoot, directory))) cpSync(join(sourceRoot, directory), join(main, directory), { recursive: true });
    }
    for (const file of ['package.json', 'package-lock.json']) cpSync(join(sourceRoot, file), join(main, file));
    symlinkSync(join(sourceRoot, 'node_modules'), join(main, 'node_modules'), 'dir');
    function run(args, cwd = main) {
      const result = spawnSync(process.execPath, args, { cwd, env: { PATH: process.env.PATH, TMPDIR: fixture }, encoding: 'utf8' });
      if (result.error) throw result.error;
      return result;
    }
    const generated = run(['scripts/generate-showcase-sites.mjs']);
    assert.equal(generated.status, 0, generated.stdout + generated.stderr);
    const sites = readdirSync(fixture).filter((name) => name.startsWith('agency-') && name.endsWith('-web') && name !== 'agency-main-web');
    assert.equal(sites.length, 14);
    for (const name of sites) checkFonts(join(fixture, name));
    for (const name of sites) checkSiteTemplate(join(fixture, name));
    checkSiteToolchain(join(fixture, 'agency-legal-web'), run);

    const before = Object.fromEntries(sites.map((name) => [name, snapshot(join(fixture, name))]));
    const refused = run(['scripts/generate-showcase-sites.mjs']);
    assert.notEqual(refused.status, 0);
    assert.match(refused.stderr, /Refusing to overwrite existing directory/);
    assert.deepEqual(Object.fromEntries(sites.map((name) => [name, snapshot(join(fixture, name))])), before);

    const cyber = join(fixture, 'agency-cyber-security-web');
    rmSync(join(cyber, 'app', 'fonts'), { recursive: true });
    const migrated = run(['--input-type=module', '--eval', "const { migrateSites } = await import('./scripts/migrate-showcase-pseo.mjs'); await migrateSites({ onlySlugs: ['cyber-security'] });"]);
    assert.equal(migrated.status, 0, migrated.stdout + migrated.stderr);
    checkFonts(cyber);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
