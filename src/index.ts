#!/usr/bin/env bun

import chalk from "chalk";
import { select, Separator } from "@inquirer/prompts";
import { translate, retranslateWithTone } from "./translate.js";
import { displayResult } from "./display.js";

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
        message: "トーンを調整",
        choices: [
          { name: "[1] もっとカジュアルに", value: "casual", key: "1" },
          { name: "[2] もっとフォーマルに", value: "formal", key: "2" },
          { name: "[3] 終了", value: "exit", key: "3" },
        ],
      }).catch(() => "exit" as const);

      if (choice === "exit") break;

      const prevTranslation = result.translation;
      result = await retranslateWithTone(text, result.translation, choice as "casual" | "formal");

      if (result.translation === prevTranslation) {
        console.log(chalk.gray("これ以上の調整はできません。"));
        break;
      }

      displayResult(result);
    }
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
  process.exit(1);
}
