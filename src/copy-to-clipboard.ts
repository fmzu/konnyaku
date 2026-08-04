import { spawn } from "node:child_process";

/**
 * macOS の pbcopy にテキストを渡してクリップボードにコピーする。
 * darwin 以外での利用可否は呼び出し元が isClipboardSupported で判定すること。
 */
export function copyToClipboard(
  text: string,
  deps: { spawn: typeof spawn } = { spawn },
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = deps.spawn("pbcopy", {
      stdio: ["pipe", "ignore", "ignore"],
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`pbcopy exited with code ${code}`));
      }
    });

    child.stdin?.end(text);
  });
}
