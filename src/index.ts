#!/usr/bin/env node

import { select } from "@inquirer/prompts";
import { translate } from "./translate.js";
import { retranslateWithTone } from "./retranslate.js";
import { displayResult } from "./display-result.js";
import { handleUseSubcommand } from "./handle-use.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: konnyaku <text to translate>");
  console.log("Example: konnyaku Hello! How are you?");
  process.exit(1);
}

handleUseSubcommand(args, "konnyaku");

const text = args.join(" ");

try {
  let result = translate(text);
  displayResult(result);

  // JP→EN の場合、トーン調整のインタラクティブループ
  if (result.targetLanguage === "English") {
    const MAX_LEVEL = 3;
    let toneLevel = 0; // -3(最カジュアル) 〜 0(初期) 〜 +3(最フォーマル)

    while (true) {
      const choices = [];
      if (toneLevel > -MAX_LEVEL) {
        choices.push({ name: "[1] もっとカジュアルに", value: "casual" });
      }
      if (toneLevel < MAX_LEVEL) {
        choices.push({ name: "[2] もっとフォーマルに", value: "formal" });
      }
      choices.push({ name: `[${choices.length + 1}] 終了`, value: "exit" });

      const choice = await select({
        message: "トーンを調整",
        choices,
      }).catch(() => "exit" as const);

      if (choice === "exit") break;

      result = retranslateWithTone(text, result.translation, choice as "casual" | "formal");
      if (choice === "casual") toneLevel--;
      if (choice === "formal") toneLevel++;

      displayResult(result);
    }
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
  process.exit(1);
}
