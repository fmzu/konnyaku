import { describe, it, expect, spyOn, beforeEach, afterEach, mock } from "bun:test";
import { handleUseSubcommand } from "./handle-use.js";

describe("handleUseSubcommand", () => {
  let exitSpy: ReturnType<typeof spyOn>;
  let logSpy: ReturnType<typeof spyOn>;
  const saveConfigMock = mock(() => {});
  const loadConfigMock = mock(() => ({ command: "codex exec" }));
  const deps = {
    loadConfig: loadConfigMock,
    saveConfig: saveConfigMock,
  };

  beforeEach(() => {
    exitSpy = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    logSpy = spyOn(console, "log").mockImplementation(() => {});
    saveConfigMock.mockClear();
    loadConfigMock.mockClear();
  });

  afterEach(() => {
    exitSpy.mockRestore();
    logSpy.mockRestore();
  });

  it("'use'以外の引数では何もしない", () => {
    handleUseSubcommand(["hello"], "konnyaku", deps);
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("'use'のみで現在のコマンドを表示して終了する", () => {
    expect(() => {
      handleUseSubcommand(["use"], "konnyaku", deps);
    }).toThrow("process.exit called");
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(loadConfigMock).toHaveBeenCalled();
  });

  it("'use <command>'で設定を保存して終了する", () => {
    expect(() => {
      handleUseSubcommand(["use", "test-cmd"], "konnyaku", deps);
    }).toThrow("process.exit called");
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(saveConfigMock).toHaveBeenCalledWith({ command: "test-cmd" });
    expect(logSpy).toHaveBeenCalledWith("コマンドを設定しました: test-cmd");
  });
});
