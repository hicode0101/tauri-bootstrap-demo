<script setup lang="ts">
import { computed } from "vue";
import { NButton, NSelect } from "naive-ui";
import { useI18n } from "vue-i18n";
import { ui } from "@/stores/ui";
import { settings, updateLanguage, updateTheme } from "@/stores/settings";
import type { LangOption } from "@/lib/i18n";
import type { ThemeOption } from "@/lib/theme";
import DialogCard from "./DialogCard.vue";
import Icon from "./Icon.vue";

const { t } = useI18n();

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
  <!-- Capabilities (header drag / edge resize) are on by default; pass
       :draggable="false" / :resizable="false" to disable either. -->
  <DialogCard
    v-model:open="ui.settingsOpen"
    :title="t('settings.title')"
    :aria-label="t('settings.title')"
    :close-label="t('settings.close')"
    :min-width="400"
    :min-height="260"
  >
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

    <template #footer>
      <NButton type="primary" @click="ui.settingsOpen = false">
        {{ t("settings.close") }}
      </NButton>
    </template>
  </DialogCard>
</template>

<style scoped>
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
</style>
