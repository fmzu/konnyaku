#!/usr/bin/env node

import chalk from "chalk";
import { select, Separator } from "@inquirer/prompts";
import { translate, retranslateWithTone } from "./translate.js";
import { displayResult } from "./display.js";
import { saveConfig, loadConfig } from "./config.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: eigo <text to translate>");
  console.log("Example: eigo Hello! How are you?");
  process.exit(1);
}

// Handle 'use' subcommand
if (args[0] === "use") {
  if (args.length < 2) {
    const { command } = loadConfig();
    console.log(`現在のコマンド: ${command}`);
    console.log("Usage: konnyaku use <command>");
    console.log('Example: konnyaku use "codex exec"');
    process.exit(0);
  }
  const command = args.slice(1).join(" ");
  saveConfig({ command });
  console.log(`コマンドを設定しました: ${command}`);
  process.exit(0);
}

const text = args.join(" ");

try {
  let result = await translate(text);
  displayResult(result);

  // JP→EN の場合、トーン調整のインタラクティブループ
  if (result.targetLanguage === "English") {
    const MAX_ADJUSTMENTS = 3;
    let casualCount = 0;
    let formalCount = 0;

    while (true) {
      const choices = [];
      if (casualCount < MAX_ADJUSTMENTS) {
        choices.push({ name: `[1] もっとカジュアルに（残り${MAX_ADJUSTMENTS - casualCount}回）`, value: "casual" });
      }
      if (formalCount < MAX_ADJUSTMENTS) {
        choices.push({ name: `[2] もっとフォーマルに（残り${MAX_ADJUSTMENTS - formalCount}回）`, value: "formal" });
      }
      choices.push({ name: `[${choices.length + 1}] 終了`, value: "exit" });

      if (choices.length === 1) {
        console.log(chalk.gray("これ以上の調整はできません。"));
        break;
      }

      const choice = await select({
        message: "トーンを調整",
        choices,
      }).catch(() => "exit" as const);

      if (choice === "exit") break;

      result = await retranslateWithTone(text, result.translation, choice as "casual" | "formal");
      if (choice === "casual") casualCount++;
      if (choice === "formal") formalCount++;

      displayResult(result);
    }
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
  process.exit(1);
}
