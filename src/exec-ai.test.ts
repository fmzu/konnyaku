import { describe, it, expect } from "bun:test";
import { execAI } from "./exec-ai.js";

describe("execAI", () => {
  it("コマンドが正常に実行される", () => {
    const result = execAI("hello", "echo");
    expect(result).toBe("hello");
  });

  it("存在しないコマンドでエラーが投げられる", () => {
    expect(() => execAI("test", "nonexistent-command-xyz")).toThrow(
      "Command failed"
    );
  });
});
