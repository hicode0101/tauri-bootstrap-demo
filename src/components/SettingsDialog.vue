<script setup lang="ts">
import { computed, watch } from "vue";
import { NButton, NModal, NSelect } from "naive-ui";
import { useI18n } from "vue-i18n";
import { ui } from "@/stores/ui";
import { settings, updateLanguage, updateTheme } from "@/stores/settings";
import type { LangOption } from "@/lib/i18n";
import type { ThemeOption } from "@/lib/theme";
import { useDraggableCard } from "@/lib/dialogDrag";
import Icon from "./Icon.vue";

const { t } = useI18n();

// Drag-to-move via the header; re-center when the dialog closes.
const { cardStyle, onHeaderPointerDown, reset: resetDragPosition } = useDraggableCard();
watch(
  () => ui.settingsOpen,
  (open) => {
    if (!open) resetDragPosition();
  },
);

const themeOptions = computed(() => [
  { label: t("settings.light"), value: "light" },
  { label: t("settings.dark"), value: "dark" },
]);

const languageOptions = computed(() => [
  { label: t("settings.followSystem"), value: "system" },
  { label: "简体中文", value: "zh-CN" },
  { label: "English", value: "en-US" },
]);

function onThemeChange(value: string | number): void {
  void updateTheme(String(value) as ThemeOption);
}

function onLanguageChange(value: string | number): void {
  void updateLanguage(String(value) as LangOption);
}
</script>

<template>
  <NModal v-model:show="ui.settingsOpen" :mask-style="{ background: 'rgba(0, 0, 0, 0.35)' }">
    <div class="settings-card" :style="cardStyle" role="dialog" :aria-label="t('settings.title')">
      <header class="card-header" @pointerdown="onHeaderPointerDown">
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
            <div class="row-label">{{ t("settings.theme") }}</div>
            <div class="row-hint">{{ t("settings.themeHint") }}</div>
          </div>
          <NSelect
            class="row-select"
            :value="settings.theme"
            :options="themeOptions"
            :consistent-menu-width="false"
            @update:value="onThemeChange"
          />
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
  cursor: grab;
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

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>
