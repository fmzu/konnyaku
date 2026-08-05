#!/usr/bin/env node

import { copyWithMessage } from "./copy-with-message.js";
import { handleUseSubcommand } from "./handle-use.js";
import { convertToKeigo } from "./keigo-convert.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: keigo <カジュアルなテキスト>");
  console.log("Example: keigo 明日休みます");
  process.exit(1);
}

handleUseSubcommand(args, "keigo");

const text = args.join(" ");

if (text.trim() === "") {
  console.log("Usage: keigo <カジュアルなテキスト>");
  console.log("Example: keigo 明日休みます");
  process.exit(1);
}

try {
  const result = await convertToKeigo(text);
  console.log(result);
  await copyWithMessage(result);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  } else {
    console.error("Error:", String(error));
  }
  process.exit(1);
}
