import { spawn } from "node:child_process";

export type CommandFailure = Error & {
  stdout?: string;
  stderr?: string;
  code?: string | number;
};

export type CommandResult = {
  stdout: string;
  stderr: string;
};

/**
 * 子プロセスを実行し、stdin を閉じた状態で stdout/stderr を収集する。
 * stderr は成功時には一切出力しない（呼び出し元がエラー時にのみ利用する）。
 */
export function runCommand(
  bin: string,
  args: string[],
  deps: { spawn: typeof spawn } = { spawn },
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = deps.spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      reject(Object.assign(error, { stdout, stderr }) as CommandFailure);
    });

    child.on("close", (exitCode) => {
      if (exitCode === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(
          Object.assign(new Error(`exited with code ${exitCode}`), {
            stdout,
            stderr,
            code: exitCode ?? undefined,
          }) as CommandFailure,
        );
      }
    });
  });
}
