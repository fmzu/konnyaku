import { execFileSync } from "node:child_process";
import { loadConfig } from "./load-config.js";

export function execAI(prompt: string, command?: string): string {
  const cmd = command ?? loadConfig().command;
  const parts = cmd.split(" ");
  const bin = parts[0];
  const args = [...parts.slice(1), prompt];

  try {
    return execFileSync(bin, args, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch (e: any) {
    throw new Error(`Command failed: ${e.stderr || e.message}`);
  }
}
