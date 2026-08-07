#!/usr/bin/env node
// 実装コードへの編集をブロックする。
// permissions.deny と二重にかける保険。jq 不要（Node のみ）。

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let path = "";
  try {
    const input = JSON.parse(raw);
    path = input?.tool_input?.file_path ?? input?.tool_input?.path ?? "";
  } catch {
    process.exit(0); // 解釈できないときは判断しない
  }

  if (!path) process.exit(0);

  const normalized = path.replace(/\\/g, "/");
  const isSrc = /(^|\/)src\//.test(normalized);

  if (isSrc) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            "src/ 配下は学習者が自分で書く領域です。実装コードを書かず、ヒントかレビューを返してください（CLAUDE.md 参照）。",
        },
      })
    );
  }
  process.exit(0);
});
