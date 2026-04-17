import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = path.resolve("/Users/garry/AI-Inbox");
const apolloCorePath = path.resolve(
  "/Users/garry/cursor-apollo-workshop/node_modules/@xplortech/apollo-core",
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "apollo-core-local": apolloCorePath,
    },
  },
  server: {
    fs: {
      allow: [projectRoot, apolloCorePath],
    },
  },
});
