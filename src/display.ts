import chalk from "chalk";
import type { TranslationResult } from "./translate.js";

function highlightEnglish(text: string): string {
  // Highlight text in「」(remove brackets)
  let result = text.replace(/「([^」]+)」/g, (_, content) => chalk.cyan(content));
  // Highlight text in ""(remove quotes)
  result = result.replace(/"([^"]+)"/g, (_, content) => chalk.cyan(content));
  // Highlight standalone English words/phrases between non-ASCII chars
  result = result.replace(/(?<=[^\x00-\x7F]|^)([A-Za-z][A-Za-z\s'.,\-~]+[A-Za-z.])(?=[^\x00-\x7F]|$)/g,
    (match) => chalk.cyan(match));
  return result;
}

export function displayResult(result: TranslationResult): void {
  const lines: string[] = [];

  // 翻訳
  lines.push(result.translation);
  lines.push("");

  // ニュアンス
  for (const nuance of result.nuances) {
    lines.push(chalk.gray("・") + highlightEnglish(nuance));
  }

  // トーン説明（EN→JPの場合のみ）
  if (result.targetLanguage === "Japanese" && result.toneDescription) {
    lines.push("");
    lines.push(chalk.gray(result.toneDescription));
  }

  console.log("");
  console.log(lines.join("\n"));
  console.log("");
}

export function displayToneOptions(): void {
  console.log(chalk.gray("[1] もっとカジュアルに  [2] もっとフォーマルに  [Enter] 終了"));
}
