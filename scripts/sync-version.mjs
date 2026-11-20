// Version sync utility. The single source of truth for the app version is
// `src-tauri/Cargo.toml` ([package] version); `src-tauri/tauri.conf.json`
// intentionally has NO version field, so the bundle name, Windows assembly
// info and the `app_version` IPC all fall back to the crate version.
//
// Usage:
//   node scripts/sync-version.mjs          mirror: Cargo.toml -> package.json
//                                            (wired to predev/prebuild hooks)
//   node scripts/sync-version.mjs 1.2.3    set: write the version into
//                                            Cargo.toml + package.json
//                                            (CI release: the git tag, no "v")
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const cargoPath = join(root, "src-tauri", "Cargo.toml");
const pkgPath = join(root, "package.json");

function readCargoVersion() {
  const cargo = readFileSync(cargoPath, "utf8");
  const m = /^version\s*=\s*"([^"]+)"/m.exec(cargo);
  if (!m) {
    console.error("[sync-version] no [package] version found in src-tauri/Cargo.toml");
    process.exit(1);
  }
  return m[1];
}

function writeCargoVersion(version) {
  const cargo = readFileSync(cargoPath, "utf8");
  if (!/^version\s*=\s*"[^"]*"/m.test(cargo)) {
    console.error("[sync-version] failed to patch src-tauri/Cargo.toml");
    process.exit(1);
  }
  writeFileSync(
    cargoPath,
    cargo.replace(/^version\s*=\s*"[^"]*"/m, `version = "${version}"`),
  );
}

function writePkgVersion(version) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

const arg = process.argv[2]?.trim().replace(/^v/i, "");

if (!arg) {
  // Mirror mode: package.json follows Cargo.toml (no-op when equal).
  const version = readCargoVersion();
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (pkg.version === version) {
    console.log(`[sync-version] package.json already at ${version}`);
  } else {
    writePkgVersion(version);
    console.log(`[sync-version] package.json -> ${version}`);
  }
} else if (/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(arg)) {
  // Set mode (CI release): tag version -> Cargo.toml + package.json.
  writeCargoVersion(arg);
  writePkgVersion(arg);
  console.log(
    `[sync-version] version set to ${arg} (Cargo.toml + package.json; tauri.conf.json follows Cargo by design)`,
  );
} else {
  console.error(
    `[sync-version] invalid version: ${process.argv[2]} (expected e.g. 1.2.3 or 1.2.3-beta.1)`,
  );
  process.exit(1);
}
