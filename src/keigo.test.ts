import { describe, expect, it, mock } from "bun:test";
import { convertToKeigo } from "./keigo-convert.js";

describe("convertToKeigo", () => {
  it("execAI の結果をそのまま返す", () => {
    const execAIMock = mock(
      (_prompt: string) => "お疲れ様です。明日休暇を取得させていただきます。",
    );

    const result = convertToKeigo("明日休みます", { execAI: execAIMock });

    expect(result).toBe("お疲れ様です。明日休暇を取得させていただきます。");
  });

  it("execAI にプロンプトと入力テキストが連結されて渡される", () => {
    const execAIMock = mock((_prompt: string) => "変換結果");

    convertToKeigo("明日休みます", { execAI: execAIMock });

    expect(execAIMock).toHaveBeenCalledTimes(1);
    const promptArg = execAIMock.mock.calls[0]?.[0] as string;
    expect(promptArg).toContain("明日休みます");
    expect(promptArg).toContain("敬語変換アシスタント");
  });

  it("空文字でも execAI が呼ばれる", () => {
    const execAIMock = mock((_prompt: string) => "");

    const result = convertToKeigo("", { execAI: execAIMock });

    expect(execAIMock).toHaveBeenCalledTimes(1);
    expect(result).toBe("");
  });

  it("execAI がエラーを投げた場合はそのまま伝搬する", () => {
    const execAIMock = mock((_prompt: string): string => {
      throw new Error("AI command failed");
    });

    expect(() => convertToKeigo("テスト", { execAI: execAIMock })).toThrow(
      "AI command failed",
    );
  });

  it("改行や複数行のテキストもそのまま渡される", () => {
    const execAIMock = mock((_prompt: string) => "変換結果");

    convertToKeigo("おつかれ\n明日休みます", { execAI: execAIMock });

    const promptArg = execAIMock.mock.calls[0]?.[0] as string;
    expect(promptArg).toContain("おつかれ\n明日休みます");
  });
});
