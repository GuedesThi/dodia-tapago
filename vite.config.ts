import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environmentMatchGlobs: [["src/tests/controllers/**", "prisma"]],
  },
});
