import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // 振る舞いのテスト
    include: ["src/**/*.test.{ts,tsx}"],

    // 型のテスト。`npm run test:types` は --typecheck.only でこちらだけを回す
    typecheck: {
      include: ["src/**/*.test-d.ts"],
      tsconfig: "./tsconfig.json",
    },
  },
});
