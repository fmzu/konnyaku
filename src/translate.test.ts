import { describe, expect, it, mock } from "bun:test";
import { translate } from "./translate.js";

describe("translate", () => {
  it("AIの出力を TranslationResult としてパースして返す", () => {
    const execAIMock = mock((_prompt: string) =>
      JSON.stringify({
        translation: "Hello",
        nuances: ["丁寧な挨拶表現です"],
        toneDescription: "",
        detectedLanguage: "Japanese",
        targetLanguage: "English",
      }),
    );

    const result = translate("こんにちは", { execAI: execAIMock });

    expect(result.translation).toBe("Hello");
    expect(result.nuances).toEqual(["丁寧な挨拶表現です"]);
    expect(result.detectedLanguage).toBe("Japanese");
    expect(result.targetLanguage).toBe("English");
    expect(result.toneDescription).toBe("");
  });

  it("execAI にプロンプトと入力テキストが連結されて渡される", () => {
    const execAIMock = mock((_prompt: string) =>
      JSON.stringify({
        translation: "Hi",
        nuances: [],
        toneDescription: "",
        detectedLanguage: "Japanese",
        targetLanguage: "English",
      }),
    );

    translate("やあ", { execAI: execAIMock });

    expect(execAIMock).toHaveBeenCalledTimes(1);
    const promptArg = execAIMock.mock.calls[0]?.[0] as string;
    expect(promptArg).toContain("やあ");
    expect(promptArg).toContain("translation assistant");
  });

  it("EN→JP 翻訳で toneDescription を含む結果も正しく返す", () => {
    const execAIMock = mock((_prompt: string) =>
      JSON.stringify({
        translation: "こんにちは",
        nuances: ["カジュアルな挨拶", "一般的な表現"],
        toneDescription: "友人同士で使うくだけた表現です",
        detectedLanguage: "English",
        targetLanguage: "Japanese",
      }),
    );

    const result = translate("Hello", { execAI: execAIMock });

    expect(result.toneDescription).toBe("友人同士で使うくだけた表現です");
    expect(result.nuances).toHaveLength(2);
  });

  it("AI出力がJSON形式でない場合はエラーを投げる", () => {
    const execAIMock = mock((_prompt: string) => "this is not json at all");

    expect(() => translate("test", { execAI: execAIMock })).toThrow();
  });

  it("AI出力がスキーマに合わない場合はエラーを投げる", () => {
    const execAIMock = mock((_prompt: string) =>
      JSON.stringify({ wrong: "structure" }),
    );

    expect(() => translate("test", { execAI: execAIMock })).toThrow();
  });
});
