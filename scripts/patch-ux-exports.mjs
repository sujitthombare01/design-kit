// ng-packagr's "assets" mechanism copies the css-variable/*.css files into
// dist/ux, but it only adds a package.json "exports" entry for the entry
// point's JS module — not for the raw CSS assets sitting beside it. Without
// a matching subpath pattern, bundlers that honor "exports" (e.g. Vite)
// can't resolve `@design-kit/ux/css-variable/index.css`. This patches the
// built package.json with that pattern after every `ng build ux`.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(rootDir, '../dist/ux/package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

pkg.exports['./css-variable/*'] = './css-variable/*';

writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
