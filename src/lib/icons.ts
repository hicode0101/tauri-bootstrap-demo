/**
 * Fluent-style inline SVG icons (24x24 grid, 1.6px rounded strokes).
 * Rendered by Icon.vue via v-html on an <svg> host.
 */
export const icons: Record<string, string> = {
  settings: `<path d="M4 7h8.2M16.8 7H20M4 17h3.2M11.8 17H20"/><circle cx="14.5" cy="7" r="2.3"/><circle cx="9.5" cy="17" r="2.3"/>`,
  dismiss: `<path d="M6 6l12 12M18 6 6 18"/>`,
  minimize: `<path d="M5 12h14"/>`,
  maximize: `<rect x="5.5" y="5.5" width="13" height="13" rx="1.8"/>`,
  restore: `<rect x="5" y="8.2" width="10.8" height="10.8" rx="1.6"/><path d="M8.6 5.8h8.6A1.6 1.6 0 0 1 18.8 7.4v8.6"/>`,
  terminal: `<path d="M5 7l5 5-5 5"/><path d="M12 17h7"/>`,
  globe: `<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.7 2.3 4 5.2 4 8.5s-1.3 6.2-4 8.5c-2.7-2.3-4-5.2-4-8.5s1.3-6.2 4-8.5z"/>`,
  moon: `<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>`,
  info: `<circle cx="12" cy="12" r="8.5"/><path d="M12 11.2v4.6"/><path d="M12 8h.01"/>`,
};
