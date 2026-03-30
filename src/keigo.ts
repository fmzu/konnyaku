#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { loadConfig, saveConfig } from "./config.js";

const PROMPT = `あなたは日本語の敬語変換アシスタントです。
入力されたカジュアルな日本語を、Slackで上司やクライアントに送る丁寧な敬語に変換してください。

ルール：
- 変換後のテキストのみを出力すること（説明・注釈は一切不要）
- Slackメッセージとして自然な敬語にすること（ビジネスメールほど堅くしすぎない）
- 改行や構造は必要に応じて整えること
- マークダウンやコードブロックで囲まないこと

変換するテキスト：
`;

function convert(text: string): string {
  const { command } = loadConfig();
  const parts = command.split(" ");
  const cmd = parts[0];
  const args = [...parts.slice(1), PROMPT + text];

  try {
    return execFileSync(cmd, args, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch (e: any) {
    throw new Error(`Command failed: ${e.stderr || e.message}`);
  }
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: keigo <カジュアルなテキスト>");
  console.log("Example: keigo 明日休みます");
  process.exit(1);
}

if (args[0] === "use") {
  if (args.length < 2) {
    const { command } = loadConfig();
    console.log(`現在のコマンド: ${command}`);
    console.log("Usage: keigo use <command>");
    console.log('Example: keigo use "claude -p"');
    process.exit(0);
  }
  const command = args.slice(1).join(" ");
  saveConfig({ command });
  console.log(`コマンドを設定しました: ${command}`);
  process.exit(0);
}

const text = args.join(" ");

try {
  const result = convert(text);
  console.log(result);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
  process.exit(1);
}
