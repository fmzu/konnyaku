import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "./run-command.js";
import { runCommand } from "./run-command.js";

describe("runCommand", () => {
  it("正常終了時にstdoutを返す", async () => {
    const result = await runCommand("echo", ["hello"]);
    expect(result.stdout.trim()).toBe("hello");
  });

  it("stdinを閉じるため、標準入力を待つコマンドでもハングしない", async () => {
    // cat は stdin が閉じられていれば即座にEOFで終了する
    const result = await runCommand("cat", []);
    expect(result.stdout).toBe("");
  });

  it("存在しないコマンドはENOENTで失敗する", async () => {
    await expect(
      runCommand("nonexistent-command-xyz", []),
    ).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("非ゼロ終了コードの場合はstderrを含めて失敗する", async () => {
    try {
      await runCommand("sh", ["-c", "echo err-message 1>&2; exit 1"]);
      throw new Error("should not reach here");
    } catch (e) {
      const err = e as CommandFailure;
      expect(err.code).toBe(1);
      expect(err.stderr).toContain("err-message");
    }
  });

  it("成功時でもstderrへの出力は結果に含める（表示はしない）", async () => {
    const result = await runCommand("sh", ["-c", "echo noise 1>&2"]);
    expect(result.stderr).toContain("noise");
  });
});
