import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

interface Config {
  command: string;
}

const CONFIG_DIR = join(homedir(), ".config", "konnyaku");
const CONFIG_PATH = join(CONFIG_DIR, "settings.json");

const DEFAULT_CONFIG: Config = {
  command: "codex exec",
};

export function loadConfig(): Config {
  try {
    const data = readFileSync(CONFIG_PATH, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: Partial<Config>): void {
  const current = loadConfig();
  const merged = { ...current, ...config };
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2) + "\n");
}
