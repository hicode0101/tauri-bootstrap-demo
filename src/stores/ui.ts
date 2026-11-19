import { reactive } from "vue";

/** Transient UI state (not persisted). */
export const ui = reactive({
  settingsOpen: false,
  aboutOpen: false,
});
