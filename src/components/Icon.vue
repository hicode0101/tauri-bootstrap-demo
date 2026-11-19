<script setup lang="ts">
import { icons } from "@/lib/icons";

withDefaults(defineProps<{ name: string; size?: number }>(), {
  size: 18,
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="fluent-icon"
    v-html="icons[name] || ''"
  />
</template>

<style scoped>
.fluent-icon {
  flex-shrink: 0;
  display: block;
}
</style>
