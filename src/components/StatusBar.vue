<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "@/lib/tauri";

const { t } = useI18n();
const version = ref("");

onMounted(async () => {
  try {
    version.value = await api.appVersion();
  } catch {
    // Running outside Tauri (e.g. plain browser) — hide the version item.
  }
});
</script>

<template>
  <footer class="status-bar">
    <div class="side">
      <span class="dot"></span>
      <span class="item">{{ t("status.ready") }}</span>
    </div>
    <div class="side">
      <span class="item">Tauri 2 · Vue 3 · Naive UI</span>
      <span v-if="version" class="divider"></span>
      <span v-if="version" class="item">v{{ version }}</span>
    </div>
  </footer>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 0 14px;
  border-top: 1px solid var(--stroke);
  font-size: 11.5px;
  color: var(--text-secondary);
  background: var(--bg-card);
}

.side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item {
  white-space: nowrap;
}

.divider {
  width: 1px;
  height: 12px;
  background: var(--stroke-strong);
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--success);
}
</style>
