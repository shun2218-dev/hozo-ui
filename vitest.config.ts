import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],

    typecheck: {
      include: ["src/**/*.test-d.{ts,tsx}"],
      tsconfig: "./tsconfig.json",
    },
  },
});
