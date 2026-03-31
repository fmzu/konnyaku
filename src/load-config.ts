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
  try {
    const data = readFileSync(configPath, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
