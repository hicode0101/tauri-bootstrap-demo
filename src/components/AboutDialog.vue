<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { NButton, NModal } from "naive-ui";
import { useI18n } from "vue-i18n";
import { ui } from "@/stores/ui";
import { api, openExternal } from "@/lib/tauri";
import { APP_AUTHOR, APP_HOMEPAGE } from "@/lib/appInfo";
import { useDraggableCard } from "@/lib/dialogDrag";

const { t } = useI18n();
const version = ref("");

// Drag-to-move via the header; re-center when the dialog closes.
const { cardStyle, onHeaderPointerDown, reset: resetDragPosition } = useDraggableCard();
watch(
  () => ui.aboutOpen,
  (open) => {
    if (!open) resetDragPosition();
  },
);

onMounted(async () => {
  try {
    version.value = await api.appVersion();
  } catch {
    // Running outside Tauri (e.g. plain browser) — leave the version empty.
  }
});

function openHomepage(): void {
  void openExternal(APP_HOMEPAGE);
}
</script>

<template>
  <NModal v-model:show="ui.aboutOpen" :mask-style="{ background: 'rgba(0, 0, 0, 0.35)' }">
    <div class="about-card" :style="cardStyle" role="dialog" :aria-label="t('about.title', { name: t('app.name') })">
      <header class="about-header" @pointerdown="onHeaderPointerDown">
        <h2 class="about-title">{{ t("about.title", { name: t("app.name") }) }}</h2>
      </header>

      <div class="about-body">
        <svg class="about-logo" viewBox="0 0 24 24" width="72" height="72" aria-hidden="true">
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

        <div class="about-info">
          <div class="about-name-row">
            <span class="about-name">{{ t("app.name") }}</span>
            <span class="about-version">{{ version ? `v${version}` : "-" }}</span>
          </div>
          <p class="about-desc">{{ t("about.desc") }}</p>
          <div class="about-row">
            <span class="about-label">{{ t("about.homepage") }}</span>
            <a href="#" class="about-link" @click.prevent="openHomepage">{{ APP_HOMEPAGE }}</a>
          </div>
          <div class="about-row">
            <span class="about-label">{{ t("about.author") }}</span>
            <span>{{ APP_AUTHOR }}</span>
          </div>
        </div>
      </div>

      <footer class="about-footer">
        <NButton type="primary" @click="ui.aboutOpen = false">
          {{ t("settings.close") }}
        </NButton>
      </footer>
    </div>
  </NModal>
</template>

<style scoped>
.about-card {
  display: flex;
  flex-direction: column;
  width: 560px;
  max-width: calc(100vw - 48px);
  padding: 20px 24px 0;
  background: var(--bg-layer);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dialog);
}

.about-header {
  margin: 0 0 18px;
  cursor: grab;
}

.about-title {
  margin: 0;
  font-size: 20px;
  font-weight: 650;
}

.about-body {
  display: flex;
  gap: 18px;
  padding-bottom: 20px;
}

.about-logo {
  border-radius: 16px;
  flex-shrink: 0;
}

.about-info {
  flex: 1;
  min-width: 0;
  padding-top: 4px;
  font-size: 13.5px;
}

.about-name-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}

.about-name {
  font-size: 16px;
  font-weight: 650;
}

.about-version {
  font-size: 12.5px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.about-desc {
  margin: 0 0 10px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.about-row {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.about-label {
  flex-shrink: 0;
  color: var(--text-secondary);
}

.about-link {
  color: var(--accent);
  text-decoration: none;
  word-break: break-all;
}
.about-link:hover {
  text-decoration: underline;
}

.about-footer {
  display: flex;
  justify-content: flex-end;
  margin: 0 -24px;
  padding: 14px 24px;
  border-top: 1px solid var(--stroke);
}
</style>
