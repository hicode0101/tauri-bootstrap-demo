import { createI18n } from "vue-i18n";

export type LangOption = "system" | "zh-CN" | "en-US";
export type ResolvedLocale = "zh-CN" | "en-US";

export const FALLBACK_LOCALE: ResolvedLocale = "zh-CN";

const LANGUAGE_PREFERENCES: readonly LangOption[] = [
  "system",
  "zh-CN",
  "en-US",
];

/** Normalize a persisted value into a known language preference. */
export function normalizeLangOption(value: unknown): LangOption {
  return LANGUAGE_PREFERENCES.includes(value as LangOption)
    ? (value as LangOption)
    : "system";
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: FALLBACK_LOCALE,
  fallbackLocale: FALLBACK_LOCALE,
  messages: {},
});

const bundles = new Map<string, Record<string, unknown>>();

/** Resolve the OS language to a supported locale (zh -> zh-CN, else en-US). */
export function detectSystemLocale(): ResolvedLocale {
  const lang = (navigator.language || "en").toLowerCase();
  return lang.startsWith("zh") ? "zh-CN" : "en-US";
}

async function loadBundle(locale: string): Promise<Record<string, unknown>> {
  const cached = bundles.get(locale);
  if (cached) return cached;
  const resp = await fetch(`/locales/${locale}.json`);
  if (!resp.ok) throw new Error(`locale ${locale} not found`);
  const json = (await resp.json()) as Record<string, unknown>;
  bundles.set(locale, json);
  return json;
}

/**
 * Resolve the UI language (user setting -> system language) and load its
 * messages from `public/locales/<locale>.json`. Falls back to zh-CN.
 */
export async function setLanguage(pref: LangOption): Promise<ResolvedLocale> {
  const target: ResolvedLocale =
    pref === "system" ? detectSystemLocale() : pref;
  try {
    i18n.global.setLocaleMessage(target, await loadBundle(target));
    i18n.global.locale.value = target;
    return target;
  } catch {
    i18n.global.setLocaleMessage(
      FALLBACK_LOCALE,
      await loadBundle(FALLBACK_LOCALE).catch(() => ({})),
    );
    i18n.global.locale.value = FALLBACK_LOCALE;
    return FALLBACK_LOCALE;
  }
}
