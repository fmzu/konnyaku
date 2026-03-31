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
  } catch (e: unknown) {
    if (e instanceof Error && 'code' in e && (e as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `コマンド "${bin}" が見つかりません。\nAIコマンドを設定してください: konnyaku use "claude -p"`
      );
    }
    if (e instanceof Error && 'stderr' in e) {
      const stderr = String((e as any).stderr || "").trim();
      throw new Error(`コマンド "${bin}" が失敗しました: ${stderr || e.message}`);
    }
    throw new Error(`コマンドの実行に失敗しました: ${e instanceof Error ? e.message : String(e)}`);
  }
}
