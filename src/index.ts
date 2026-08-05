#!/usr/bin/env node

import { select } from "@inquirer/prompts";
import { copyWithMessage } from "./copy-with-message.js";
import { displayResult } from "./display-result.js";
import { displayVariants } from "./display-variants.js";
import { handleUseSubcommand } from "./handle-use.js";
import { isClipboardSupported } from "./is-clipboard-supported.js";
import { translate } from "./translate.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: konnyaku <text to translate>");
  console.log("Example: konnyaku Hello! How are you?");
  process.exit(1);
}

handleUseSubcommand(args, "konnyaku");

const text = args.join(" ");

if (text.trim() === "") {
  console.log("Usage: konnyaku <text to translate>");
  console.log("Example: konnyaku Hello! How are you?");
  process.exit(1);
}

try {
  const result = await translate(text);

  if (result.targetLanguage === "English") {
    displayVariants(result);

    if (isClipboardSupported()) {
      const choice = await select({
        message: "どれを使う？（選ぶとコピーされます）",
        choices: [
          { name: "[1] カジュアル", value: "casual" },
          { name: "[2] ふつう", value: "neutral" },
          { name: "[3] ビジネス", value: "business" },
          { name: "[4] コピーしない", value: "none" },
        ],
      }).catch(() => "none" as const);

      if (choice !== "none") {
        const variant =
          result.variants[choice as "casual" | "neutral" | "business"];
        await copyWithMessage(variant.text);
      }
    }
  } else {
    displayResult(result);
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  } else {
    console.error("Error:", String(error));
  }
  process.exit(1);
}
