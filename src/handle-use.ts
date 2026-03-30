import { loadConfig } from "./load-config.js";
import { saveConfig } from "./save-config.js";

export function handleUseSubcommand(args: string[], commandName: string): void {
  if (args[0] !== "use") return;

  if (args.length < 2) {
    const { command } = loadConfig();
    console.log(`現在のコマンド: ${command}`);
    console.log(`Usage: ${commandName} use <command>`);
    console.log(`Example: ${commandName} use "claude -p"`);
    process.exit(0);
  }

  const command = args.slice(1).join(" ");
  saveConfig({ command });
  console.log(`コマンドを設定しました: ${command}`);
  process.exit(0);
}
