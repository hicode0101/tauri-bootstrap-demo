/**
 * Static app metadata shared by the About dialog and other surfaces.
 *
 * NOTE: the app version is intentionally NOT defined here. The single
 * source of truth is `src-tauri/Cargo.toml` (`[package] version`): the
 * bundle, Windows assembly info and the `app_version` IPC command all
 * derive from it, `scripts/sync-version.mjs` mirrors it into
 * `package.json`, and the frontend reads it back via `api.appVersion()`.
 */
export const APP_HOMEPAGE = "https://github.com/hicode0101";
export const APP_AUTHOR = "hicode0101";
