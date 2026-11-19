import { ref } from "vue";

export type ThemeOption = "light" | "dark";

/** Reactive mirror of the applied theme, consumed by Naive UI providers. */
export const resolvedTheme = ref<ThemeOption>("light");

/** Normalize a persisted value into a known theme option (default light). */
export function normalizeThemeOption(value: unknown): ThemeOption {
  return value === "dark" ? "dark" : "light";
}

/** Apply the theme to the document and the reactive mirror. */
export function applyTheme(pref: ThemeOption): void {
  resolvedTheme.value = pref;
  document.documentElement.dataset.theme = pref;
}
