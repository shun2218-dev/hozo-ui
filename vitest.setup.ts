import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// テストごとにレンダリング結果を破棄する（StrictMode の二重レンダーや
// テスト間の DOM 汚染で検証が壊れるのを防ぐ）
afterEach(() => {
  cleanup();
});
