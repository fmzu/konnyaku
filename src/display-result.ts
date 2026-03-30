import chalk from "chalk";
import { highlightEnglish } from "./highlight-english.js";
import type { TranslationResult } from "./translate.js";

export function displayResult(result: TranslationResult): void {
  const lines: string[] = [];

  // 翻訳
  lines.push(chalk.bold.whiteBright(result.translation));
  lines.push("");

  // ニュアンス
  for (const nuance of result.nuances) {
    lines.push(chalk.gray("・") + highlightEnglish(nuance));
  }

  // トーン説明
  if (result.toneDescription) {
    lines.push("");
    lines.push(chalk.gray(result.toneDescription));
  }

  console.log("");
  console.log(lines.join("\n"));
  console.log("");
}
