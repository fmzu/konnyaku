import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("saveConfig logic", () => {
  const testDir = join(tmpdir(), "konnyaku-save-test-" + Date.now());
  const testConfigPath = join(testDir, "settings.json");

  const DEFAULT_CONFIG = { command: "codex exec" };

  function loadConfigFromPath(configPath: string) {
    try {
      const data = readFileSync(configPath, "utf-8");
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }

  function saveConfigToPath(
    configDir: string,
    configPath: string,
    config: Partial<typeof DEFAULT_CONFIG>
  ) {
    const current = loadConfigFromPath(configPath);
    const merged = { ...current, ...config };
    mkdirSync(configDir, { recursive: true });
    writeFileSync(configPath, JSON.stringify(merged, null, 2) + "\n");
  }

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it("設定を保存できる", () => {
    saveConfigToPath(testDir, testConfigPath, { command: "claude -p" });
    const saved = JSON.parse(readFileSync(testConfigPath, "utf-8"));
    expect(saved.command).toBe("claude -p");
  });

  it("既存設定とマージされる", () => {
    writeFileSync(
      testConfigPath,
      JSON.stringify({ command: "old-command" })
    );
    saveConfigToPath(testDir, testConfigPath, { command: "new-command" });
    const saved = JSON.parse(readFileSync(testConfigPath, "utf-8"));
    expect(saved.command).toBe("new-command");
  });
});
