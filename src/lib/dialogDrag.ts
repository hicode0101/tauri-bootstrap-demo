import { computed, ref } from "vue";

/**
 * Drag-to-move behavior for custom dialog cards. Bind `cardStyle` to the
 * card root element, bind `onHeaderPointerDown` to the header acting as the
 * drag handle, and call `reset()` when the dialog closes so it re-centers
 * on next open.
 */
export function useDraggableCard() {
  const x = ref(0);
  const y = ref(0);
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;

  function onHeaderPointerDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    // Never start a drag from interactive controls inside the header.
    if ((e.target as HTMLElement).closest("button, a, input, select")) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    baseX = x.value;
    baseY = y.value;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  function onPointerMove(e: PointerEvent): void {
    if (!dragging) return;
    x.value = baseX + (e.clientX - startX);
    y.value = baseY + (e.clientY - startY);
  }

  function onPointerUp(): void {
    dragging = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }

  function reset(): void {
    onPointerUp();
    x.value = 0;
    y.value = 0;
  }

  const cardStyle = computed(() => ({
    transform: `translate(${x.value}px, ${y.value}px)`,
  }));

  return { cardStyle, onHeaderPointerDown, reset };
}
