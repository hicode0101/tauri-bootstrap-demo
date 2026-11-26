<script setup lang="ts">
import { computed, watch } from "vue";
import { NModal } from "naive-ui";
import { useDraggableCard } from "@/lib/dialogDrag";
import ResizeHandles from "./ResizeHandles.vue";
import Icon from "./Icon.vue";

// Unified Fluent dialog card: wraps NModal with the scaffold's fixed mask
// policy (mask click and Esc never dismiss) and a single `useDraggableCard`
// instance. Capabilities are toggled via the `draggable` / `resizable`
// props; closing is only possible through explicit in-dialog actions (the
// header X or footer slot buttons), never by clicking the mask.
const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    ariaLabel?: string;
    closeLabel?: string;
    draggable?: boolean;
    resizable?: boolean;
    minWidth?: number;
    minHeight?: number;
  }>(),
  { draggable: true, resizable: true, title: "", ariaLabel: "", closeLabel: "" },
);

const emit = defineEmits<{ "update:open": [value: boolean] }>();

const { cardStyle, onHeaderPointerDown, onResizePointerDown, reset } = useDraggableCard({
  draggable: props.draggable,
  resizable: props.resizable,
  minWidth: props.minWidth,
  minHeight: props.minHeight,
});

// Re-center at the default size whenever the dialog closes.
watch(
  () => props.open,
  (open) => {
    if (!open) reset();
  },
);

const visible = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

function close(): void {
  emit("update:open", false);
}
</script>

<template>
  <!-- Mask clicks and Esc must NOT dismiss the dialog; only in-dialog actions may close it. -->
  <NModal
    v-model:show="visible"
    :mask-closable="false"
    :close-on-esc="false"
    :mask-style="{ background: 'rgba(0, 0, 0, 0.35)' }"
  >
    <div class="dialog-card" :style="cardStyle" role="dialog" :aria-label="ariaLabel || title">
      <ResizeHandles v-if="resizable" @resize-start="onResizePointerDown" />
      <header class="dialog-header" @pointerdown="onHeaderPointerDown">
        <h2 class="dialog-title">{{ title }}</h2>
        <slot name="header-extra" />
        <button class="dialog-close" type="button" :aria-label="closeLabel" @click="close">
          <Icon name="dismiss" :size="16" />
        </button>
      </header>
      <div class="dialog-body">
        <slot />
      </div>
      <footer class="dialog-footer">
        <slot name="footer" />
      </footer>
    </div>
  </NModal>
</template>

<style scoped>
.dialog-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 560px;
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 48px);
  background: var(--bg-layer);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dialog);
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 24px 6px;
  cursor: grab;
}

.dialog-title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.dialog-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}
.dialog-close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.dialog-close:active {
  background: var(--bg-active);
}

.dialog-body {
  flex: 1;
  min-height: 0;
  padding: 0 24px;
  overflow-x: hidden;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 14px 24px;
  border-top: 1px solid var(--stroke);
}
</style>
