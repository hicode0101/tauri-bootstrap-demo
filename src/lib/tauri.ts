import { invoke } from "@tauri-apps/api/core";

export interface AppConfig {
  language: string;
  theme: string;
}

/** True when running inside the Tauri webview (vs. a plain browser). */
export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

/** Open an external URL with the system browser (window.open in plain browsers). */
export async function openExternal(url: string): Promise<void> {
  if (isTauri()) {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(url);
  } else {
    window.open(url, "_blank", "noopener");
  }
}

export const api = {
  getConfig: () => invoke<AppConfig>("get_config"),
  saveConfig: (config: AppConfig) => invoke<void>("save_config", { config }),
  appVersion: () => invoke<string>("app_version"),
  greet: (name: string) => invoke<string>("greet", { name }),
};
