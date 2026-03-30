import { describe, it, expect, mock, beforeEach } from "bun:test";
import { execFileSync } from "node:child_process";

describe("execAI logic", () => {
  const DEFAULT_CONFIG = { command: "codex exec" };

  function execAIWithConfig(prompt: string, command: string): string {
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

  it("コマンド実行が成功する", () => {
    const result = execAIWithConfig("hello", "echo");
    expect(result).toBe("hello");
  });

  it("コマンド実行が失敗するとエラーを投げる", () => {
    expect(() => execAIWithConfig("test", "nonexistent-command-xyz")).toThrow(
      "Command failed"
    );
  });
});
