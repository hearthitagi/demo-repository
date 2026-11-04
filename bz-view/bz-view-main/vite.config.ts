import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/noAuth": {
        target: "http://127.0.0.1:3131/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/noAuth/, ""),
      },
      "/common": {
        target: "http://127.0.0.1:3131/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/common/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
