import { describe, it, expect, spyOn, beforeEach, afterEach } from "bun:test";
import { handleUseSubcommand } from "./handle-use.js";

describe("handleUseSubcommand", () => {
  let exitSpy: ReturnType<typeof spyOn>;
  let logSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    exitSpy = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    logSpy = spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
    logSpy.mockRestore();
  });

  it("'use'以外の引数では何もしない", () => {
    handleUseSubcommand(["hello"], "konnyaku");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("'use'のみで現在のコマンドを表示して終了する", () => {
    expect(() => {
      handleUseSubcommand(["use"], "konnyaku");
    }).toThrow("process.exit called");
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(logSpy).toHaveBeenCalled();
  });

  it("'use <command>'で設定を保存して終了する", () => {
    expect(() => {
      handleUseSubcommand(["use", "test-cmd"], "konnyaku");
    }).toThrow("process.exit called");
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(logSpy).toHaveBeenCalledWith("コマンドを設定しました: test-cmd");
  });
});
