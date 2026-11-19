<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { NButton, NModal, NSelect, NSwitch } from "naive-ui";
import { useI18n } from "vue-i18n";
import { ui } from "@/stores/ui";
import { settings, updateLanguage, updateTheme } from "@/stores/settings";
import { api } from "@/lib/tauri";
import type { LangOption } from "@/lib/i18n";
import Icon from "./Icon.vue";

const { t } = useI18n();
const version = ref("");

onMounted(async () => {
  try {
    version.value = await api.appVersion();
  } catch {
    // Running outside Tauri (e.g. plain browser) — leave the version empty.
  }
});

const languageOptions = computed(() => [
  { label: t("settings.followSystem"), value: "system" },
  { label: "简体中文", value: "zh-CN" },
  { label: "English", value: "en-US" },
]);

const isDark = computed(() => settings.theme === "dark");

function onThemeToggle(dark: boolean): void {
  void updateTheme(dark ? "dark" : "light");
}

function onLanguageChange(value: string | number): void {
  void updateLanguage(String(value) as LangOption);
}
</script>

<template>
  <NModal v-model:show="ui.settingsOpen" :mask-style="{ background: 'rgba(0, 0, 0, 0.35)' }">
    <div class="settings-card" role="dialog" :aria-label="t('settings.title')">
      <header class="card-header">
        <h2 class="card-title">{{ t("settings.title") }}</h2>
        <button class="icon-btn" :aria-label="t('settings.close')" @click="ui.settingsOpen = false">
          <Icon name="dismiss" :size="16" />
        </button>
      </header>

      <div class="card-body">
        <!-- Theme -->
        <div class="setting-row">
          <span class="row-icon"><Icon name="moon" :size="20" /></span>
          <div class="row-text">
            <div class="row-label">{{ t("settings.darkMode") }}</div>
            <div class="row-hint">{{ t("settings.darkModeHint") }}</div>
          </div>
          <NSwitch :value="isDark" @update:value="onThemeToggle" />
        </div>

        <!-- Language -->
        <div class="setting-row">
          <span class="row-icon"><Icon name="globe" :size="20" /></span>
          <div class="row-text">
            <div class="row-label">{{ t("settings.language") }}</div>
            <div class="row-hint">{{ t("settings.languageHint") }}</div>
          </div>
          <NSelect
            class="row-select"
            :value="settings.language"
            :options="languageOptions"
            :consistent-menu-width="false"
            @update:value="onLanguageChange"
          />
        </div>

        <!-- About -->
        <div class="setting-row">
          <span class="row-icon"><Icon name="info" :size="20" /></span>
          <div class="row-text">
            <div class="row-label">{{ t("settings.about") }}</div>
            <div class="row-hint">{{ t("app.name") }}</div>
          </div>
          <span class="row-value">v{{ version || "-" }}</span>
        </div>
      </div>

      <footer class="card-footer">
        <NButton type="primary" @click="ui.settingsOpen = false">
          {{ t("settings.close") }}
        </NButton>
      </footer>
    </div>
  </NModal>
</template>

<style scoped>
.settings-card {
  display: flex;
  flex-direction: column;
  width: 560px;
  max-width: calc(100vw - 48px);
  padding: 20px 24px 16px;
  background: var(--bg-layer);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dialog);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background 0.15s ease;
}
.icon-btn:hover {
  background: var(--bg-hover);
}
.icon-btn:active {
  background: var(--bg-active);
}

.card-body {
  display: flex;
  flex-direction: column;
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 2px;
}
.setting-row + .setting-row {
  border-top: 1px solid var(--stroke);
}

.row-icon {
  display: inline-flex;
  color: var(--text-secondary);
}

.row-text {
  flex: 1;
  min-width: 0;
}

.row-label {
  font-size: 14px;
}

.row-hint {
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-secondary);
}

.row-select {
  width: 190px;
}

.row-value {
  font-size: 13px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>
