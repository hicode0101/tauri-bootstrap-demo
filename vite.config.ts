import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

/**
 * Dev-only: files in public/ are outside the module graph, so editing a
 * locale JSON would never trigger HMR and the i18n bundle cache would go
 * stale. Watch the locales dir and send a full page reload on change.
 */
function localeReloadPlugin(): Plugin {
  return {
    name: "full-reload-on-locale-change",
    apply: "serve",
    configureServer(server) {
      server.watcher.add(fileURLToPath(new URL("./public/locales", import.meta.url)));
      server.watcher.on("change", (path) => {
        if (path.replace(/\\/g, "/").includes("/public/locales/")) {
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), localeReloadPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Tauri expects a fixed port, fail if that port is not available.
  // 1520: distinct from HiNote (1420) so both projects can run dev at once.
  server: {
    port: 1520,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    target: "chrome110",
    minify: "esbuild",
    sourcemap: false,
  },
});
