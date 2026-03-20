#!/usr/bin/env bun

import { createInterface } from "node:readline";
import { translate, retranslateWithTone } from "./translate.js";
import { displayResult, displayToneOptions } from "./display.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: eigo <text to translate>");
  console.log("Example: eigo Hello! How are you?");
  process.exit(1);
}

const text = args.join(" ");

function ask(rl: ReturnType<typeof createInterface>, prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

try {
  let result = await translate(text);
  displayResult(result);

  // JP→EN の場合、トーン調整のインタラクティブループ
  if (result.targetLanguage === "English") {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    try {
      while (true) {
        displayToneOptions();
        const answer = await ask(rl, "> ");
        const trimmed = answer.trim();

        if (trimmed === "1") {
          result = await retranslateWithTone(text, result.translation, "casual");
          displayResult(result);
        } else if (trimmed === "2") {
          result = await retranslateWithTone(text, result.translation, "formal");
          displayResult(result);
        } else {
          break;
        }
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
