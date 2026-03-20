import chalk from "chalk";
import boxen from "boxen";
import type { TranslationResult } from "./translate.js";

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
  lines.push(chalk.bold.cyan("翻訳"));
  lines.push(result.translation);
  lines.push("");

  // ニュアンス
  lines.push(chalk.bold.cyan("ニュアンス"));
  for (const nuance of result.nuances) {
    lines.push(chalk.gray("・") + nuance);
  }
  lines.push("");

  // フォーマル度
  const stars = formalityStars(result.formality);
  const label = formalityLabel(result.formality);
  lines.push(chalk.bold.cyan("フォーマル度") + " " + chalk.yellow(stars) + chalk.gray(` （${label}）`));

  const box = boxen(lines.join("\n"), {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "cyan",
  });

  console.log(box);
}
