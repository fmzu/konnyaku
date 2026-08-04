import { describe, expect, it, mock } from "bun:test";
import { EventEmitter } from "node:events";
import { copyToClipboard } from "./copy-to-clipboard.js";

function createFakeChild() {
  const emitter = new EventEmitter() as EventEmitter & {
    stdin: { end: ReturnType<typeof mock> };
  };
  emitter.stdin = { end: mock((_text: string) => {}) };
  return emitter;
}

describe("copyToClipboard", () => {
  it("pbcopyにテキストを渡して正常終了すれば解決する", async () => {
    const child = createFakeChild();
    const spawnMock = mock(() => child);

    const promise = copyToClipboard("hello", {
      spawn: spawnMock as never,
    });
    child.emit("close", 0);
    await promise;

    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(spawnMock.mock.calls[0]?.[0]).toBe("pbcopy");
    expect(child.stdin.end).toHaveBeenCalledWith("hello");
  });

  it("pbcopyが非ゼロで終了した場合は拒否される", async () => {
    const child = createFakeChild();
    const spawnMock = mock(() => child);

    const promise = copyToClipboard("hello", { spawn: spawnMock as never });
    child.emit("close", 1);

    await expect(promise).rejects.toThrow("pbcopy exited with code 1");
  });

  it("spawn自体がエラーを出した場合は拒否される", async () => {
    const child = createFakeChild();
    const spawnMock = mock(() => child);

    const promise = copyToClipboard("hello", { spawn: spawnMock as never });
    child.emit("error", new Error("spawn failed"));

    await expect(promise).rejects.toThrow("spawn failed");
  });
});
