import { defineConfig } from "vite";
import path from "path";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@js": path.resolve(__dirname, "./src/scripts"),
      "@glsl": path.resolve(__dirname, "./src/glsl"),
    },
  },
});
