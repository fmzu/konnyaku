import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { readFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { saveConfig } from "./save-config.js";
import { loadConfig } from "./load-config.js";

describe("saveConfig", () => {
  const testDir = join(tmpdir(), `konnyaku-test-save-${Date.now()}`);
  const testConfigPath = join(testDir, "settings.json");

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it("設定を保存できる", () => {
    saveConfig({ command: "new-cmd" }, testConfigPath);
    const saved = JSON.parse(readFileSync(testConfigPath, "utf-8"));
    expect(saved.command).toBe("new-cmd");
  });

  it("既存の設定とマージされる", () => {
    saveConfig({ command: "first-cmd" }, testConfigPath);
    saveConfig({ command: "second-cmd" }, testConfigPath);
    const config = loadConfig(testConfigPath);
    expect(config.command).toBe("second-cmd");
  });
});
