import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export interface Config {
  command: string;
}

export const CONFIG_DIR = join(homedir(), ".config", "konnyaku");
export const CONFIG_PATH = join(CONFIG_DIR, "settings.json");

const DEFAULT_CONFIG: Config = {
  command: "codex exec",
};

export function loadConfig(configPath: string = CONFIG_PATH): Config {
  let data: string;
  try {
    data = readFileSync(configPath, "utf-8");
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { ...DEFAULT_CONFIG };
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Warning: 設定ファイルの読み込みに失敗しました: ${message}`);
    return { ...DEFAULT_CONFIG };
  }
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch {
    console.error(`Warning: 設定ファイルのJSONが不正です。デフォルト設定を使用します。`);
    return { ...DEFAULT_CONFIG };
  }
}
