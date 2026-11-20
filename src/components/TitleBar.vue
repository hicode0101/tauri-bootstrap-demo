<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useI18n } from "vue-i18n";
import { isTauri } from "@/lib/tauri";
import Icon from "./Icon.vue";

const { t } = useI18n();
const maximized = ref(false);
const win = isTauri() ? getCurrentWindow() : null;

let unlisten: (() => void) | null = null;

onMounted(async () => {
  if (!win) return;
  maximized.value = await win.isMaximized();
  unlisten = await win.onResized(async () => {
    maximized.value = await win.isMaximized();
  });
});

onUnmounted(() => {
  unlisten?.();
});

function minimize(): void {
  void win?.minimize();
}
function toggleMaximize(): void {
  void win?.toggleMaximize();
}
function close(): void {
  void win?.close();
}
</script>

<template>
  <header class="titlebar">
    <div class="drag-region" data-tauri-drag-region>
      <svg class="app-logo" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="var(--accent)" />
        <path
          d="M7.2 8.4 10.7 12l-3.5 3.6"
          stroke="var(--accent-text)"
          stroke-width="1.9"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M12.8 15.6H17" stroke="var(--accent-text)" stroke-width="1.9" fill="none" stroke-linecap="round" />
      </svg>
      <span class="app-name" data-tauri-drag-region>{{ t("app.name") }}</span>
    </div>

    <div class="tb-actions">
      <div class="caption-group">
        <button class="tb-btn caption" @click="minimize">
          <Icon name="minimize" :size="14" />
        </button>
        <button class="tb-btn caption" @click="toggleMaximize">
          <Icon :name="maximized ? 'restore' : 'maximize'" :size="13" />
        </button>
        <button class="tb-btn caption close" @click="close">
          <Icon name="dismiss" :size="14" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--titlebar-height);
  -webkit-app-region: drag;
}

.drag-region {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 14px;
  height: 100%;
  flex: 1;
}

.app-logo {
  border-radius: 4px;
}

.app-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.tb-actions {
  display: flex;
  align-items: center;
  height: 100%;
  -webkit-app-region: no-drag;
}

.tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background 0.15s ease;
}
.tb-btn:hover {
  background: var(--bg-hover);
}
.tb-btn:active {
  background: var(--bg-active);
}

.caption-group {
  display: flex;
  height: 100%;
  margin-left: 4px;
}
.tb-btn.caption {
  width: 46px;
}
.tb-btn.caption.close:hover {
  background: #c42b1c;
  color: #fff;
}
.tb-btn.caption.close:active {
  background: #b3261e;
  color: #fff;
}
</style>
