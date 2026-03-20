#!/usr/bin/env bun

import { translate, retranslateWithTone } from "./translate.js";
import { displayResult } from "./display.js";
import { select } from "@inquirer/prompts";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: eigo <text to translate>");
  console.log("Example: eigo Hello! How are you?");
  process.exit(1);
}

const text = args.join(" ");

try {
  let result = await translate(text);
  displayResult(result);

  // JP→EN の場合、トーン調整のインタラクティブループ
  if (result.targetLanguage === "English") {
    while (true) {
      const choice = await select({
        message: "トーンを調整しますか？",
        choices: [
          { name: "もっとカジュアルに", value: "casual" },
          { name: "もっとフォーマルに", value: "formal" },
          { name: "終了", value: "exit" },
        ],
      }).catch(() => "exit" as const);

      if (choice === "exit") break;

      result = await retranslateWithTone(text, result.translation, choice as "casual" | "formal");
      displayResult(result);
    }
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
  process.exit(1);
}
