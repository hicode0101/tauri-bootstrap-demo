import { reactive } from "vue";
import { api } from "@/lib/tauri";
import {
  applyTheme,
  normalizeThemeOption,
  type ThemeOption,
} from "@/lib/theme";
import { normalizeLangOption, setLanguage, type LangOption } from "@/lib/i18n";

/** App settings; persisted to `{app_data_dir}/config.json` via Rust. */
export const settings = reactive({
  loaded: false,
  language: "system" as LangOption,
  theme: "light" as ThemeOption,
});

export async function loadSettings(): Promise<void> {
  try {
    const cfg = await api.getConfig();
    settings.language = normalizeLangOption(cfg.language);
    settings.theme = normalizeThemeOption(cfg.theme);
  } catch {
    // Running outside Tauri (e.g. plain browser) — keep defaults.
  }
  settings.loaded = true;
}

async function persistSettings(): Promise<void> {
  try {
    await api.saveConfig({
      language: settings.language,
      theme: settings.theme,
    });
  } catch {
    // Ignore persistence failures outside Tauri.
  }
}

export async function updateTheme(pref: ThemeOption): Promise<void> {
  if (settings.theme === pref) return;
  settings.theme = pref;
  applyTheme(pref);
  await persistSettings();
}

export async function updateLanguage(pref: LangOption): Promise<void> {
  if (settings.language === pref) return;
  settings.language = pref;
  await setLanguage(pref);
  await persistSettings();
}
