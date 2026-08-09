import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],

    // コンポーネントのテストが DOM を必要とするため既定を jsdom にする。
    // DOM を使わないテストは、ファイル先頭に次の docblock を書けば個別に外せる:
    //   // @vitest-environment node
    environment: "jsdom",

    // Testing Library のカスタムマッチャ（toBeInTheDocument など）を有効にする
    setupFiles: ["./vitest.setup.ts"],

    typecheck: {
      include: ["src/**/*.test-d.{ts,tsx}"],
      tsconfig: "./tsconfig.json",
    },
  },
});
