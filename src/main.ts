import { createApp } from "vue";
import App from "./App.vue";
import { i18n, setLanguage } from "@/lib/i18n";
import { applyTheme } from "@/lib/theme";
import { isTauri } from "@/lib/tauri";
import { loadSettings, settings } from "@/stores/settings";
import "@/styles/global.css";

async function bootstrap(): Promise<void> {
  if (!isTauri()) {
    // Plain-browser flag: opaque background fallback (no Mica available).
    document.documentElement.classList.add("browser-env");
  }
  await loadSettings();
  applyTheme(settings.theme);
  await setLanguage(settings.language);
  createApp(App).use(i18n).mount("#app");
}

void bootstrap();
