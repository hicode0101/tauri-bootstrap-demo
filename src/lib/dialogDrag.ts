import { computed, ref } from "vue";

/** Edge and corner directions a dialog card can be resized from. */
export const RESIZE_DIRECTIONS = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;
export type ResizeDirection = (typeof RESIZE_DIRECTIONS)[number];

/** Options for `useDraggableCard`. */
export interface DialogCardOptions {
  /** Allow moving the dialog by dragging its header. Default true. */
  draggable?: boolean;
  /** Allow resizing from edges/corners. Default true. */
  resizable?: boolean;
  minWidth?: number;
  minHeight?: number;
}

/** Keep the resized card this far away from the viewport edges. */
const VIEWPORT_MARGIN = 24;

/**
 * Drag-to-move and edge-resize behavior for custom dialog cards. Bind
 * `cardStyle` to the card root element, bind `onHeaderPointerDown` to the
 * header acting as the drag handle, render `<ResizeHandles>` as a direct
 * child of the card and forward its `resize-start` event to
 * `onResizePointerDown`. Call `reset()` when the dialog closes so it
 * re-centers at its default size on next open.
 *
 * NModal flex-centers the card, so growing the card by d px shifts each
 * edge by d/2 px. Resize therefore compensates with translate(d/2) to keep
 * the edge opposite to the dragged one anchored in place.
 */
export function useDraggableCard(options: DialogCardOptions = {}) {
  const draggable = options.draggable ?? true;
  const resizable = options.resizable ?? true;
  const minWidth = options.minWidth ?? 320;
  const minHeight = options.minHeight ?? 220;

  const x = ref(0);
  const y = ref(0);
  // Explicit size stays null until the first resize so the card keeps its
  // CSS default (auto height) on open.
  const width = ref<number | null>(null);
  const height = ref<number | null>(null);
  // Naive's base styles put a catch-all transition on the modal card; while
  // it animates, the card lags behind the pointer. Disable transitions only
  // for the duration of a gesture (open/close animations stay intact).
  const interacting = ref(false);
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;

  // Resize session state: direction, pointer origin, card rect and viewport
  // clamps captured when the gesture started.
  let resizeDir: ResizeDirection = "e";
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeBaseW = 0;
  let resizeBaseH = 0;
  let resizeMaxW = 0;
  let resizeMaxH = 0;

  function onHeaderPointerDown(e: PointerEvent): void {
    if (!draggable) return;
    if (e.button !== 0) return;
    // Never start a drag from interactive controls inside the header.
    if ((e.target as HTMLElement).closest("button, a, input, select")) return;
    dragging = true;
    interacting.value = true;
    startX = e.clientX;
    startY = e.clientY;
    baseX = x.value;
    baseY = y.value;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  }

  function onPointerMove(e: PointerEvent): void {
    if (!dragging) return;
    x.value = baseX + (e.clientX - startX);
    y.value = baseY + (e.clientY - startY);
  }

  function onPointerUp(): void {
    dragging = false;
    interacting.value = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  }

  function onResizePointerDown(direction: ResizeDirection, e: PointerEvent): void {
    if (!resizable) return;
    if (e.button !== 0) return;
    e.preventDefault();
    // `<ResizeHandles>` is a direct child of the card root, so the zone's
    // parent is the card whose rect anchors the whole gesture.
    const card = (e.currentTarget as HTMLElement).parentElement;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    resizeDir = direction;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    interacting.value = true;
    resizeBaseW = rect.width;
    resizeBaseH = rect.height;
    resizeMaxW = window.innerWidth - VIEWPORT_MARGIN * 2;
    resizeMaxH = window.innerHeight - VIEWPORT_MARGIN * 2;
    // Seed the explicit size per axis from the rendered card so the gesture
    // starts from the current visual size. Axes the direction doesn't touch
    // keep their auto behavior (e.g. height follows content while dragging
    // an edge horizontally).
    if (resizeDir.includes("e") || resizeDir.includes("w")) {
      width.value = Math.round(resizeBaseW);
    }
    if (resizeDir.includes("n") || resizeDir.includes("s")) {
      height.value = Math.round(resizeBaseH);
    }
    baseX = x.value;
    baseY = y.value;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeEnd);
    window.addEventListener("pointercancel", onResizeEnd);
  }

  function onResizeMove(e: PointerEvent): void {
    const dx = e.clientX - resizeStartX;
    const dy = e.clientY - resizeStartY;
    let dw = 0;
    let dh = 0;
    if (resizeDir.includes("e")) dw = dx;
    if (resizeDir.includes("w")) dw = -dx;
    if (resizeDir.includes("s")) dh = dy;
    if (resizeDir.includes("n")) dh = -dy;
    dw = Math.min(Math.max(dw, minWidth - resizeBaseW), resizeMaxW - resizeBaseW);
    dh = Math.min(Math.max(dh, minHeight - resizeBaseH), resizeMaxH - resizeBaseH);
    if (dw !== 0) {
      width.value = Math.round(resizeBaseW + dw);
      // Re-center compensation keeps the opposite edge anchored. Dragging
      // the west edge anchors the east one, so the sign flips.
      x.value = baseX + (resizeDir.includes("w") ? -dw / 2 : dw / 2);
    }
    if (dh !== 0) {
      height.value = Math.round(resizeBaseH + dh);
      y.value = baseY + (resizeDir.includes("n") ? -dh / 2 : dh / 2);
    }
  }

  function onResizeEnd(): void {
    interacting.value = false;
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", onResizeEnd);
    window.removeEventListener("pointercancel", onResizeEnd);
  }

  function reset(): void {
    onPointerUp();
    onResizeEnd();
    x.value = 0;
    y.value = 0;
    width.value = null;
    height.value = null;
    interacting.value = false;
  }

  const cardStyle = computed(() => ({
    transform: `translate(${x.value}px, ${y.value}px)`,
    width: width.value === null ? undefined : `${width.value}px`,
    height: height.value === null ? undefined : `${height.value}px`,
    transition: interacting.value ? "none" : undefined,
  }));

  return { cardStyle, onHeaderPointerDown, onResizePointerDown, reset };
}
