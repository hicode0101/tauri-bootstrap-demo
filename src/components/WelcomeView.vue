<script setup lang="ts">
import { NButton, useMessage } from "naive-ui";
import { useI18n } from "vue-i18n";
import { api } from "@/lib/tauri";
import { ui } from "@/stores/ui";
import Icon from "./Icon.vue";

const { t } = useI18n();
const message = useMessage();

function openSettings(): void {
  ui.settingsOpen = true;
}

async function greetBackend(): Promise<void> {
  try {
    const reply = await api.greet("Tauri 2");
    message.info(reply);
  } catch {
    message.warning(t("welcome.greetFailed"));
  }
}
</script>

<template>
  <div class="welcome">
    <div class="welcome-card">
      <svg class="welcome-logo" viewBox="0 0 24 24" width="88" height="88" aria-hidden="true">
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
      <h1 class="welcome-title">{{ t("welcome.title", { name: t("app.name") }) }}</h1>
      <p class="welcome-desc">{{ t("welcome.desc") }}</p>
      <div class="welcome-actions">
        <NButton type="primary" @click="openSettings">
          {{ t("welcome.openSettings") }}
        </NButton>
        <NButton @click="greetBackend">
          <template #icon><Icon name="terminal" :size="15" /></template>
          {{ t("welcome.greet") }}
        </NButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 480px;
  padding: 40px;
}

.welcome-logo {
  border-radius: 18px;
  margin-bottom: 22px;
}

.welcome-title {
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 650;
}

.welcome-desc {
  margin: 0 0 26px;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.welcome-actions {
  display: flex;
  gap: 12px;
}
</style>
