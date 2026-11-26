<script setup lang="ts">
import { RESIZE_DIRECTIONS, type ResizeDirection } from "@/lib/dialogDrag";

// Invisible edge/corner strips that let the user resize a dialog card by
// dragging its borders. Emits (direction, event); the parent forwards it to
// `useDraggableCard().onResizePointerDown`. Must be a direct child of the
// card root element so the zones align with its edges.
const emit = defineEmits<{ resizeStart: [dir: ResizeDirection, event: PointerEvent] }>();
</script>

<template>
  <span
    v-for="dir in RESIZE_DIRECTIONS"
    :key="dir"
    class="resize-zone"
    :data-dir="dir"
    @pointerdown.stop.prevent="emit('resizeStart', dir, $event)"
  />
</template>

<style scoped>
/* Strips straddle the card border (half outside) for a generous hit area.
   Corners render after edges in DOM order so they win the overlap. */
.resize-zone {
  position: absolute;
  z-index: 1;
  touch-action: none;
}
.resize-zone[data-dir="n"] {
  top: -4px;
  right: 10px;
  left: 10px;
  height: 8px;
  cursor: ns-resize;
}
.resize-zone[data-dir="s"] {
  bottom: -4px;
  right: 10px;
  left: 10px;
  height: 8px;
  cursor: ns-resize;
}
.resize-zone[data-dir="e"] {
  top: 10px;
  bottom: 10px;
  right: -4px;
  width: 8px;
  cursor: ew-resize;
}
.resize-zone[data-dir="w"] {
  top: 10px;
  bottom: 10px;
  left: -4px;
  width: 8px;
  cursor: ew-resize;
}
.resize-zone[data-dir="ne"] {
  top: -5px;
  right: -5px;
  width: 14px;
  height: 14px;
  cursor: nesw-resize;
}
.resize-zone[data-dir="nw"] {
  top: -5px;
  left: -5px;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
}
.resize-zone[data-dir="se"] {
  bottom: -5px;
  right: -5px;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
}
.resize-zone[data-dir="sw"] {
  bottom: -5px;
  left: -5px;
  width: 14px;
  height: 14px;
  cursor: nesw-resize;
}
</style>
