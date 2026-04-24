import { execAI } from "./exec-ai.js";

const PROMPT = `あなたは日本語の敬語変換アシスタントです。
入力されたカジュアルな日本語を、Slackで上司やクライアントに送る丁寧な敬語に変換してください。

ルール：
- 変換後のテキストのみを出力すること（説明・注釈は一切不要）
- Slackメッセージとして自然な敬語にすること（ビジネスメールほど堅くしすぎない）
- 改行や構造は必要に応じて整えること
- マークダウンやコードブロックで囲まないこと

変換するテキスト：
`;

export function convertToKeigo(
  text: string,
  deps: { execAI: (prompt: string) => string } = { execAI },
): string {
  return deps.execAI(PROMPT + text);
}
