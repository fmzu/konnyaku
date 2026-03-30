import { execFileSync } from "node:child_process";
import { loadConfig } from "./load-config.js";

export function execAI(prompt: string): string {
  const { command } = loadConfig();
  const parts = command.split(" ");
  const cmd = parts[0];
  const args = [...parts.slice(1), prompt];

  try {
    return execFileSync(cmd, args, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch (e: any) {
    throw new Error(`Command failed: ${e.stderr || e.message}`);
  }
}
