#!/usr/bin/env bun

import { translate } from "./translate.js";
import { displayResult } from "./display.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: eigo <text to translate>");
  console.log("Example: eigo Hello! How are you?");
  process.exit(1);
}

const text = args.join(" ");

try {
  const result = await translate(text);
  displayResult(result);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
  process.exit(1);
}
