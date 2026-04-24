import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Config } from "./load-config.js";
import { CONFIG_PATH, loadConfig } from "./load-config.js";

export function saveConfig(
  config: Partial<Config>,
  configPath: string = CONFIG_PATH,
): void {
  const current = loadConfig(configPath);
  const merged = { ...current, ...config };
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify(merged, null, 2)}\n`);
}
