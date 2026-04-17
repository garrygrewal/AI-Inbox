import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname;
const apolloCorePath = path.join(projectRoot, "node_modules", "@xplortech", "apollo-core");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Apollo exports `./css/*` → `./build/*.css`; Vite 4 can fail to resolve that pattern for CSS.
      "@xplortech/apollo-core/apollo-styles.css": path.join(
        apolloCorePath,
        "build",
        "style.css",
      ),
    },
  },
  server: {
    fs: {
      allow: [projectRoot, apolloCorePath],
    },
  },
});
