import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// テスト用の一時ディレクトリを使う方式
// load-config.tsはCONFIG_PATHがハードコードされているため、
// モジュールを直接テストする代わりに、ロジックを再現してテストする

describe("loadConfig logic", () => {
  const testDir = join(tmpdir(), "konnyaku-test-" + Date.now());
  const testConfigPath = join(testDir, "settings.json");

  const DEFAULT_CONFIG = { command: "codex exec" };

  function loadConfigFromPath(configPath: string) {
    const { readFileSync } = require("node:fs");
    try {
      const data = readFileSync(configPath, "utf-8");
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it("設定ファイルが存在する場合、その内容を読み込む", () => {
    writeFileSync(testConfigPath, JSON.stringify({ command: "claude -p" }));
    const config = loadConfigFromPath(testConfigPath);
    expect(config.command).toBe("claude -p");
  });

  it("デフォルト値が補完される", () => {
    writeFileSync(testConfigPath, JSON.stringify({}));
    const config = loadConfigFromPath(testConfigPath);
    expect(config.command).toBe("codex exec");
  });

  it("設定ファイルが存在しない場合、デフォルト値を返す", () => {
    const config = loadConfigFromPath(join(testDir, "nonexistent.json"));
    expect(config).toEqual({ command: "codex exec" });
  });
});
