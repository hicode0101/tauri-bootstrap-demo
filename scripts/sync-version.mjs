// Mirror the app version from the single source of truth
// (`src-tauri/Cargo.toml` -> [package] version) into package.json.
// Run automatically via the `predev` / `prebuild` npm hooks.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const cargo = readFileSync(join(root, "src-tauri", "Cargo.toml"), "utf8");
const match = /^version\s*=\s*"([^"]+)"/m.exec(cargo);
if (!match) {
  console.error("[sync-version] no [package] version found in src-tauri/Cargo.toml");
  process.exit(1);
}
const version = match[1];

const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
if (pkg.version === version) {
  console.log(`[sync-version] package.json already at ${version}`);
} else {
  pkg.version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`[sync-version] package.json -> ${version}`);
}
