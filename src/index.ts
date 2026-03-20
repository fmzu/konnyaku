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

    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const ask = (prompt: string): Promise<string> =>
      new Promise((resolve) => rl.question(prompt, resolve));

    try {
      while (true) {
        // 選択肢表示
        let selectedIndex = 0;
        const showChoices = () => {
          for (let i = 0; i < choices.length; i++) {
            const prefix = i === selectedIndex ? chalk.cyan("❯") : " ";
            const num = chalk.gray(`[${choices[i].key}]`);
            console.log(`${prefix} ${num} ${choices[i].label}`);
          }
          console.log(chalk.gray("  [Enter] 終了"));
        };
        showChoices();

        const answer = (await ask("")).trim();

        if (answer === "") break;

        const choice = choices.find((c) => c.key === answer);
        if (!choice) continue;

        result = await retranslateWithTone(text, result.translation, choice.value);
        displayResult(result);
      }
    } finally {
      rl.close();
    }
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
  process.exit(1);
}
