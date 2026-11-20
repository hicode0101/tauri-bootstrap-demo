<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { NDropdown, type DropdownOption } from "naive-ui";
import { useI18n } from "vue-i18n";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { isTauri } from "@/lib/tauri";
import { resolvedTheme } from "@/lib/theme";
import { updateTheme } from "@/stores/settings";
import { ui } from "@/stores/ui";
import Icon from "./Icon.vue";

const { t } = useI18n();
const openMenu = ref<string | null>(null);
const win = isTauri() ? getCurrentWindow() : null;

const isDark = computed(() => resolvedTheme.value === "dark");

function toggleTheme(): void {
  void updateTheme(isDark.value ? "light" : "dark");
}

const fileOptions = computed<DropdownOption[]>(() => [
  { label: t("menu.settings"), key: "settings" },
  { type: "divider", key: "file-divider" },
  { label: t("menu.exit"), key: "exit" },
]);

const helpOptions = computed<DropdownOption[]>(() => [
  { label: t("menu.about"), key: "about" },
]);

type MenuAction = "settings" | "exit" | "about";

function toggle(name: string): void {
  openMenu.value = openMenu.value === name ? null : name;
}

/** Classic menu-bar behavior: while a menu is open, hovering another title switches. */
function hoverSwitch(name: string): void {
  if (openMenu.value !== null && openMenu.value !== name) {
    openMenu.value = name;
  }
}

function onSelect(key: unknown): void {
  openMenu.value = null;
  switch (key as MenuAction) {
    case "settings":
      ui.settingsOpen = true;
      break;
    case "exit":
      void win?.close();
      break;
    case "about":
      ui.aboutOpen = true;
      break;
  }
}

function onClickOutside(): void {
  openMenu.value = null;
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === "Escape") openMenu.value = null;
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onUnmounted(() => document.removeEventListener("keydown", onKeydown));
</script>

<template>
  <nav class="menu-bar">
    <NDropdown
      trigger="manual"
      placement="bottom-start"
      size="large"
      :show="openMenu === 'file'"
      :options="fileOptions"
      @select="onSelect"
      @clickoutside="onClickOutside"
    >
      <button
        type="button"
        class="menu-item"
        :class="{ open: openMenu === 'file' }"
        @click="toggle('file')"
        @mouseenter="hoverSwitch('file')"
      >
        {{ t("menu.file") }}
      </button>
    </NDropdown>

    <NDropdown
      trigger="manual"
      placement="bottom-start"
      size="large"
      :show="openMenu === 'help'"
      :options="helpOptions"
      @select="onSelect"
      @clickoutside="onClickOutside"
    >
      <button
        type="button"
        class="menu-item"
        :class="{ open: openMenu === 'help' }"
        @click="toggle('help')"
        @mouseenter="hoverSwitch('help')"
      >
        {{ t("menu.help") }}
      </button>
    </NDropdown>

    <div class="menu-actions">
      <button type="button" class="action-btn" :title="t('menu.toggleTheme')" @click="toggleTheme">
        <Icon :name="isDark ? 'sun' : 'moon'" :size="17" />
      </button>
      <button type="button" class="action-btn" :title="t('menu.settings')" @click="ui.settingsOpen = true">
        <Icon name="settings" :size="16" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.menu-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 36px;
  padding: 0 8px;
  border-bottom: 1px solid var(--stroke);
}

.menu-item {
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 13.5px;
  color: var(--text-primary);
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s ease;
}
.menu-item:hover,
.menu-item.open {
  background: var(--bg-hover);
}
.menu-item.open {
  background: var(--bg-active);
}

.menu-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  height: 100%;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background 0.15s ease;
}
.action-btn:hover {
  background: var(--bg-hover);
}
.action-btn:active {
  background: var(--bg-active);
}
</style>
