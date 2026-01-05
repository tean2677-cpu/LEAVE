import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "/LEAVE/",   // GitHub Pages path

  plugins: [
    react(),
    runtimeErrorOverlay(),
    glsl(), // Add GLSL shader support
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },

  root: path.resolve(__dirname, "client"),

  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    target: 'es2015', // Target older browsers
    rollupOptions: {
      output: {
        format: 'iife', // Immediately Invoked Function Expression
        entryFileNames: 'bundle.js',
        chunkFileNames: 'chunk.js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    assetsDir: 'assets'
  },

  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
});
