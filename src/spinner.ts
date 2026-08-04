const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INTERVAL_MS = 100;

export type SpinnerDeps = {
  write: (text: string) => void;
  setInterval: (
    callback: () => void,
    ms: number,
  ) => ReturnType<typeof setInterval>;
  clearInterval: (timer: ReturnType<typeof setInterval>) => void;
  now: () => number;
};

const defaultDeps: SpinnerDeps = {
  write: (text) => {
    process.stderr.write(text);
  },
  setInterval,
  clearInterval,
  now: Date.now,
};

/**
 * ラベル付きのスピナーを stderr に表示する。
 * 戻り値の関数を呼ぶとスピナーを止めて表示行を消す。
 */
export function startSpinner(
  label: string,
  deps: SpinnerDeps = defaultDeps,
): () => void {
  const startedAt = deps.now();
  let frame = 0;
  let lastLength = 0;

  const render = () => {
    const elapsedSeconds = Math.floor((deps.now() - startedAt) / 1000);
    const line = `${FRAMES[frame % FRAMES.length]} ${label}... (${elapsedSeconds}s)`;
    frame++;
    const padding =
      lastLength > line.length ? " ".repeat(lastLength - line.length) : "";
    deps.write(`\r${line}${padding}`);
    lastLength = line.length;
  };

  render();
  const timer = deps.setInterval(render, INTERVAL_MS);

  return () => {
    deps.clearInterval(timer);
    deps.write(`\r${" ".repeat(lastLength)}\r`);
  };
}
