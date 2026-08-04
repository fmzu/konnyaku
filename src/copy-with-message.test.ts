import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { copyWithMessage } from "./copy-with-message.js";

describe("copyWithMessage", () => {
  let logSpy: ReturnType<typeof spyOn>;
  let logOutputs: string[];

  beforeEach(() => {
    logOutputs = [];
    logSpy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      logOutputs.push(args.map((a) => String(a)).join(" "));
    });
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("クリップボード対応時はコピーして完了メッセージを表示する", async () => {
    const copyToClipboardMock = mock(async (_text: string) => {});
    const isClipboardSupportedMock = mock(() => true);

    await copyWithMessage("Hello", {
      copyToClipboard: copyToClipboardMock,
      isClipboardSupported: isClipboardSupportedMock,
    });

    expect(copyToClipboardMock).toHaveBeenCalledWith("Hello");
    expect(logOutputs.join("\n")).toContain("📋 コピーしました");
  });

  it("クリップボード非対応時は何もしない", async () => {
    const copyToClipboardMock = mock(async (_text: string) => {});
    const isClipboardSupportedMock = mock(() => false);

    await copyWithMessage("Hello", {
      copyToClipboard: copyToClipboardMock,
      isClipboardSupported: isClipboardSupportedMock,
    });

    expect(copyToClipboardMock).not.toHaveBeenCalled();
    expect(logOutputs).toHaveLength(0);
  });
});
