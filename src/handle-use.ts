import { loadConfig as defaultLoadConfig } from "./load-config.js";
import { saveConfig as defaultSaveConfig } from "./save-config.js";

interface Deps {
  loadConfig: typeof defaultLoadConfig;
  saveConfig: typeof defaultSaveConfig;
}

const defaultDeps: Deps = {
  loadConfig: defaultLoadConfig,
  saveConfig: defaultSaveConfig,
};

export function handleUseSubcommand(
  args: string[],
  commandName: string,
  deps: Deps = defaultDeps,
): void {
  if (args[0] !== "use") return;

  if (args.length < 2) {
    const { command } = deps.loadConfig();
    console.log(`現在のコマンド: ${command}`);
    console.log(`Usage: ${commandName} use <command>`);
    console.log(`Example: ${commandName} use "claude -p"`);
    process.exit(0);
  }

  const command = args.slice(1).join(" ");
  deps.saveConfig({ command });
  console.log(`コマンドを設定しました: ${command}`);
  process.exit(0);
}
