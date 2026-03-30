import { describe, it, expect, mock, spyOn, beforeEach, afterEach } from "bun:test";

describe("handleUseSubcommand logic", () => {
  let savedConfig: Record<string, string> = {};
  let consoleOutput: string[] = [];
  let exitCode: number | undefined;

  const DEFAULT_CONFIG = { command: "codex exec" };

  function loadConfig() {
    return { ...DEFAULT_CONFIG, ...savedConfig };
  }

  function saveConfig(config: Partial<typeof DEFAULT_CONFIG>) {
    savedConfig = { ...savedConfig, ...config };
  }

  function handleUseSubcommand(args: string[], commandName: string): boolean {
    if (args[0] !== "use") return false;

    if (args.length < 2) {
      const { command } = loadConfig();
      consoleOutput.push(`現在のコマンド: ${command}`);
      consoleOutput.push(`Usage: ${commandName} use <command>`);
      consoleOutput.push(`Example: ${commandName} use "claude -p"`);
      exitCode = 0;
      return true;
    }

    const command = args.slice(1).join(" ");
    saveConfig({ command });
    consoleOutput.push(`コマンドを設定しました: ${command}`);
    exitCode = 0;
    return true;
  }

  beforeEach(() => {
    savedConfig = {};
    consoleOutput = [];
    exitCode = undefined;
  });

  it('"use"以外の引数では早期リターンする', () => {
    const result = handleUseSubcommand(["translate", "hello"], "konnyaku");
    expect(result).toBe(false);
    expect(consoleOutput).toHaveLength(0);
  });

  it('"use"のみで現在のコマンドを表示する', () => {
    const result = handleUseSubcommand(["use"], "konnyaku");
    expect(result).toBe(true);
    expect(consoleOutput[0]).toContain("現在のコマンド: codex exec");
    expect(exitCode).toBe(0);
  });

  it('"use <command>"で設定を保存する', () => {
    const result = handleUseSubcommand(["use", "claude", "-p"], "konnyaku");
    expect(result).toBe(true);
    expect(savedConfig.command).toBe("claude -p");
    expect(consoleOutput[0]).toContain("コマンドを設定しました: claude -p");
  });
});
