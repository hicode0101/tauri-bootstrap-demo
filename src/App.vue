<script setup lang="ts">
import { computed } from "vue";
import {
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  dateEnUS,
  dateZhCN,
  enUS,
  zhCN,
} from "naive-ui";
import { useI18n } from "vue-i18n";
import { fluentDark, fluentLight } from "@/theme/fluent";
import { resolvedTheme } from "@/lib/theme";
import TitleBar from "@/components/TitleBar.vue";
import MenuBar from "@/components/MenuBar.vue";
import WelcomeView from "@/components/WelcomeView.vue";
import StatusBar from "@/components/StatusBar.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import AboutDialog from "@/components/AboutDialog.vue";

const { locale } = useI18n();

const isDark = computed(() => resolvedTheme.value === "dark");
const naiveLocale = computed(() => (locale.value === "en-US" ? enUS : zhCN));
const naiveDateLocale = computed(() =>
  locale.value === "en-US" ? dateEnUS : dateZhCN,
);
</script>

<template>
  <NConfigProvider
    :theme="isDark ? darkTheme : null"
    :theme-overrides="isDark ? fluentDark : fluentLight"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
  >
    <!-- Toasts pop in the bottom-right corner, Windows 11 notification style -->
    <NMessageProvider placement="bottom-right" :duration="4000" :max="3" keep-alive-on-hover>
      <div class="app-shell">
        <TitleBar />
        <MenuBar />
        <main class="app-main">
          <WelcomeView />
        </main>
        <StatusBar />
      </div>
      <SettingsDialog />
      <AboutDialog />
    </NMessageProvider>
  </NConfigProvider>
</template>
