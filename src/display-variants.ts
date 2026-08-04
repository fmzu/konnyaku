import chalk from "chalk";
import type { TranslationResult } from "./translate.js";

type EnglishTranslationResult = Extract<
  TranslationResult,
  { targetLanguage: "English" }
>;

const VARIANT_LABELS = {
  casual: "カジュアル",
  neutral: "ふつう",
  business: "ビジネス",
} as const;

export function displayVariants(result: EnglishTranslationResult): void {
  const lines: string[] = [];

  for (const key of ["casual", "neutral", "business"] as const) {
    const variant = result.variants[key];
    lines.push(
      `${chalk.bold.cyan(`[${VARIANT_LABELS[key]}]`)} ${chalk.whiteBright(variant.text)}`,
    );
    lines.push(chalk.gray(`  （${variant.gloss}）`));
    lines.push("");
  }

  console.log("");
  console.log(lines.join("\n"));
}
