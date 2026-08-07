import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "coverage/**", "trace/**"] },
  js.configs.recommended,
  tseslint.configs.recommended,

  // Node 上で動くスクリプト（Claude Code のフック、各種設定ファイル）
  {
    files: [".claude/hooks/**/*.{js,mjs}", "*.config.{js,ts}"],
    languageOptions: { globals: globals.node },
  },
);
