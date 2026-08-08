import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to the gateway during dev
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});