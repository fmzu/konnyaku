#!/usr/bin/env bun

import { createInterface } from "node:readline";
import chalk from "chalk";
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
    const choices = [
      { key: "1", label: "もっとカジュアルに", value: "casual" as const },
      { key: "2", label: "もっとフォーマルに", value: "formal" as const },
    ];

    const waitForKey = (): Promise<string> =>
      new Promise((resolve) => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once("data", (data) => {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          resolve(data.toString());
        });
      });

    while (true) {
      for (const c of choices) {
        console.log(chalk.gray(`[${c.key}]`) + ` ${c.label}`);
      }
      console.log(chalk.gray("[Enter] 終了"));

      const key = await waitForKey();

      // Ctrl+C
      if (key === "\x03") {
        process.exit(0);
      }
      // Enter
      if (key === "\r" || key === "\n") break;

      const choice = choices.find((c) => c.key === key);
      if (!choice) continue;

      result = await retranslateWithTone(text, result.translation, choice.value);
      displayResult(result);
    }
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
  process.exit(1);
}
