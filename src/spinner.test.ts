import { describe, expect, it, mock } from "bun:test";
import { startSpinner } from "./spinner.js";

function createDeps(nowValues: number[]) {
  const writes: string[] = [];
  let capturedCallback: (() => void) | undefined;
  let capturedMs: number | undefined;
  let nowIndex = 0;
  const clearIntervalMock = mock((_timer: unknown) => {});

  const deps = {
    write: (text: string) => writes.push(text),
    isTTY: () => true,
    setInterval: mock((callback: () => void, ms: number) => {
      capturedCallback = callback;
      capturedMs = ms;
      return 1 as unknown as ReturnType<typeof setInterval>;
    }),
    clearInterval: clearIntervalMock,
    now: () => nowValues[Math.min(nowIndex++, nowValues.length - 1)] ?? 0,
  };

  return {
    deps,
    writes,
    tick: () => capturedCallback?.(),
    getMs: () => capturedMs,
    clearIntervalMock,
  };
}

describe("startSpinner", () => {
  it("開始時にラベルと経過0秒を表示する", () => {
    const { deps, writes } = createDeps([0, 0]);

    startSpinner("翻訳中", deps);

    expect(writes).toHaveLength(1);
    expect(writes[0]).toContain("翻訳中");
    expect(writes[0]).toContain("(0s)");
  });

  it("setIntervalに指定した間隔でコールバックを登録する", () => {
    const { deps, getMs } = createDeps([0]);

    startSpinner("翻訳中", deps);

    expect(getMs()).toBe(100);
  });

  it("時間経過に応じて経過秒数が更新される", () => {
    const { deps, writes, tick } = createDeps([0, 0, 3000]);

    startSpinner("翻訳中", deps);
    tick();

    expect(writes[1]).toContain("(3s)");
  });

  it("フレームが呼び出しごとに切り替わる", () => {
    const { deps, writes, tick } = createDeps([0, 0, 0]);

    startSpinner("翻訳中", deps);
    tick();

    const firstFrame = writes[0]?.match(/^\r(\S)/)?.[1];
    const secondFrame = writes[1]?.match(/^\r(\S)/)?.[1];
    expect(firstFrame).toBeDefined();
    expect(secondFrame).toBeDefined();
    expect(firstFrame).not.toBe(secondFrame);
  });

  it("停止時にclearIntervalが呼ばれ、表示行がクリアされる", () => {
    const { deps, writes, clearIntervalMock } = createDeps([0, 0]);

    const stop = startSpinner("翻訳中", deps);
    stop();

    expect(clearIntervalMock).toHaveBeenCalledTimes(1);
    const lastWrite = writes[writes.length - 1];
    expect(lastWrite).toMatch(/^\r\s*\r$/);
  });
});

describe("startSpinner (non-TTY)", () => {
  it("does not render anything when stderr is not a TTY", () => {
    const { deps, writes } = createDeps([0]);
    const nonTtyDeps = { ...deps, isTTY: () => false };
    const stop = startSpinner("翻訳中", nonTtyDeps);
    stop();
    expect(writes.length).toBe(0);
    expect(nonTtyDeps.setInterval).not.toHaveBeenCalled();
  });
});
