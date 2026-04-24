import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

describe("translate", () => {
  let execAIMock: ReturnType<typeof mock>;

  beforeEach(() => {
    execAIMock = mock((_prompt: string) => "");
    mock.module("./exec-ai.js", () => ({
      execAI: execAIMock,
    }));
  });

  afterEach(() => {
    mock.restore();
  });

  it("AIの出力を TranslationResult としてパースして返す", async () => {
    execAIMock.mockImplementation(() =>
      JSON.stringify({
        translation: "Hello",
        nuances: ["丁寧な挨拶表現です"],
        toneDescription: "",
        detectedLanguage: "Japanese",
        targetLanguage: "English",
      }),
    );

    const { translate } = await import("./translate.js");
    const result = translate("こんにちは");

    expect(result.translation).toBe("Hello");
    expect(result.nuances).toEqual(["丁寧な挨拶表現です"]);
    expect(result.detectedLanguage).toBe("Japanese");
    expect(result.targetLanguage).toBe("English");
    expect(result.toneDescription).toBe("");
  });

  it("execAI にプロンプトと入力テキストが連結されて渡される", async () => {
    execAIMock.mockImplementation(() =>
      JSON.stringify({
        translation: "Hi",
        nuances: [],
        toneDescription: "",
        detectedLanguage: "Japanese",
        targetLanguage: "English",
      }),
    );

    const { translate } = await import("./translate.js");
    translate("やあ");

    expect(execAIMock).toHaveBeenCalledTimes(1);
    const promptArg = execAIMock.mock.calls[0]?.[0] as string;
    expect(promptArg).toContain("やあ");
    expect(promptArg).toContain("translation assistant");
  });

  it("EN→JP 翻訳で toneDescription を含む結果も正しく返す", async () => {
    execAIMock.mockImplementation(() =>
      JSON.stringify({
        translation: "こんにちは",
        nuances: ["カジュアルな挨拶", "一般的な表現"],
        toneDescription: "友人同士で使うくだけた表現です",
        detectedLanguage: "English",
        targetLanguage: "Japanese",
      }),
    );

    const { translate } = await import("./translate.js");
    const result = translate("Hello");

    expect(result.toneDescription).toBe("友人同士で使うくだけた表現です");
    expect(result.nuances).toHaveLength(2);
  });

  it("AI出力がJSON形式でない場合はエラーを投げる", async () => {
    execAIMock.mockImplementation(() => "this is not json at all");

    const { translate } = await import("./translate.js");
    expect(() => translate("test")).toThrow();
  });

  it("AI出力がスキーマに合わない場合はエラーを投げる", async () => {
    execAIMock.mockImplementation(() => JSON.stringify({ wrong: "structure" }));

    const { translate } = await import("./translate.js");
    expect(() => translate("test")).toThrow();
  });
});
