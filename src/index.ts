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

      result = await retranslateWithTone(text, result.translation, choice as "casual" | "formal");
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
