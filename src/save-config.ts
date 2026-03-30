import { writeFileSync, mkdirSync } from "node:fs";
import { CONFIG_DIR, CONFIG_PATH, loadConfig } from "./load-config.js";
import type { Config } from "./load-config.js";

export function saveConfig(config: Partial<Config>): void {
  const current = loadConfig();
  const merged = { ...current, ...config };
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2) + "\n");
}
