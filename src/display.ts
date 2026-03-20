import chalk from "chalk";
import type { TranslationResult } from "./translate.js";

function highlightEnglish(text: string): string {
  // Highlight text in「」
  let result = text.replace(/「([^」]+)」/g, (_, content) => `「${chalk.cyan(content)}」`);
  // Highlight text in ""
  result = result.replace(/"([^"]+)"/g, (_, content) => `"${chalk.cyan(content)}"`);
  // Highlight standalone English words/phrases between non-ASCII chars
  result = result.replace(/(?<=[^\x00-\x7F]|^)([A-Za-z][A-Za-z\s'.,\-~]+[A-Za-z.])(?=[^\x00-\x7F]|$)/g,
    (match) => chalk.cyan(match));
  return result;
}

function formalityStars(level: number): string {
  return "★".repeat(level) + "☆".repeat(5 - level);
}

function formalityLabel(level: number): string {
  const labels = ["", "とてもカジュアル", "カジュアル", "ビジネスカジュアル", "フォーマル", "とてもフォーマル"];
  return labels[level] || "";
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
  lines.push("");

  // フォーマル度
  const stars = formalityStars(result.formality);
  const label = formalityLabel(result.formality);
  lines.push(chalk.yellow(stars) + chalk.gray(` （${label}）`));

  console.log("");
  console.log(lines.join("\n"));
  console.log("");
}
