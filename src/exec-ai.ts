import { loadConfig } from "./load-config.js";
import type { CommandFailure } from "./run-command.js";
import { runCommand } from "./run-command.js";
import { startSpinner } from "./spinner.js";

export async function execAI(
  prompt: string,
  command?: string,
  label = "翻訳中",
): Promise<string> {
  const cmd = command ?? loadConfig().command;
  const parts = cmd.split(" ");
  const bin = parts[0];
  const args = [...parts.slice(1), prompt];

  const stopSpinner = startSpinner(label);
  try {
    const { stdout } = await runCommand(bin, args);
    return stdout.trim();
  } catch (e: unknown) {
    const err = e as CommandFailure & { code?: string | number };
    if (err.code === "ENOENT") {
      throw new Error(
        `コマンド "${bin}" が見つかりません。\nAIコマンドを設定してください: konnyaku use "claude -p"`,
      );
    }
    const stderr = (err.stderr ?? "").trim();
    throw new Error(
      `コマンド "${bin}" が失敗しました: ${stderr || err.message}`,
    );
  } finally {
    stopSpinner();
  }
}
