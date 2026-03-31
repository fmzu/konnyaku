#!/usr/bin/env node

import { execAI } from "./exec-ai.js";
import { handleUseSubcommand } from "./handle-use.js";

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
  return execAI(PROMPT + text);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: keigo <カジュアルなテキスト>");
  console.log("Example: keigo 明日休みます");
  process.exit(1);
}

handleUseSubcommand(args, "keigo");

const text = args.join(" ");

try {
  const result = convert(text);
  console.log(result);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  } else {
    console.error("Error:", String(error));
  }
  process.exit(1);
}
