import { describe, expect, it } from "bun:test";
import { execAI } from "./exec-ai.js";

describe("execAI", () => {
  it("コマンドが正常に実行される", async () => {
    const result = await execAI("hello", "echo");
    expect(result).toBe("hello");
  });

  it("存在しないコマンドでエラーが投げられる", async () => {
    await expect(execAI("test", "nonexistent-command-xyz")).rejects.toThrow(
      'コマンド "nonexistent-command-xyz" が見つかりません',
    );
  });

  it("コマンドが非ゼロ終了コードの場合はエラーメッセージにコマンド名が含まれる", async () => {
    await expect(execAI("test", "false")).rejects.toThrow(
      'コマンド "false" が失敗しました',
    );
  });
});
