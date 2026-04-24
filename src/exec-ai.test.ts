import { describe, expect, it } from "bun:test";
import { execAI } from "./exec-ai.js";

describe("execAI", () => {
  it("コマンドが正常に実行される", () => {
    const result = execAI("hello", "echo");
    expect(result).toBe("hello");
  });

  it("存在しないコマンドでエラーが投げられる", () => {
    expect(() => execAI("test", "nonexistent-command-xyz")).toThrow(
      'コマンド "nonexistent-command-xyz" が見つかりません',
    );
  });
});
