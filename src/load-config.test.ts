import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadConfig } from "./load-config.js";

describe("loadConfig", () => {
  const testDir = join(tmpdir(), `konnyaku-test-${Date.now()}`);
  const testConfigPath = join(testDir, "settings.json");

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it("設定ファイルが存在する場合、設定を読み込む", () => {
    writeFileSync(testConfigPath, JSON.stringify({ command: "test-cmd" }));
    const config = loadConfig(testConfigPath);
    expect(config.command).toBe("test-cmd");
  });

  it("設定ファイルにないキーはデフォルト値で補完される", () => {
    writeFileSync(testConfigPath, JSON.stringify({}));
    const config = loadConfig(testConfigPath);
    expect(config.command).toBe("codex exec");
  });

  it("設定ファイルが存在しない場合、デフォルト設定を返す", () => {
    const config = loadConfig(join(testDir, "nonexistent.json"));
    expect(config.command).toBe("codex exec");
  });
});
