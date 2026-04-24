import { describe, expect, it, mock } from "bun:test";
import { retranslateWithTone } from "./retranslate.js";

describe("retranslateWithTone", () => {
  it("casual 指定で再翻訳結果を返す", () => {
    const execAIMock = mock((_prompt: string) =>
      JSON.stringify({
        translation: "Hey, what's up?",
        nuances: ["カジュアルな挨拶"],
        toneDescription: "",
        detectedLanguage: "Japanese",
        targetLanguage: "English",
      }),
    );

    const result = retranslateWithTone("こんにちは", "Hello", "casual", {
      execAI: execAIMock,
    });

    expect(result.translation).toBe("Hey, what's up?");
    expect(result.targetLanguage).toBe("English");
  });

  it("formal 指定で再翻訳結果を返す", () => {
    const execAIMock = mock((_prompt: string) =>
      JSON.stringify({
        translation: "Good day to you.",
        nuances: ["フォーマルな挨拶"],
        toneDescription: "",
        detectedLanguage: "Japanese",
        targetLanguage: "English",
      }),
    );

    const result = retranslateWithTone("こんにちは", "Hello", "formal", {
      execAI: execAIMock,
    });

    expect(result.translation).toBe("Good day to you.");
  });

  it("プロンプトに original/current/direction が全て埋め込まれる", () => {
    const execAIMock = mock((_prompt: string) =>
      JSON.stringify({
        translation: "Hi",
        nuances: [],
        toneDescription: "",
        detectedLanguage: "Japanese",
        targetLanguage: "English",
      }),
    );

    retranslateWithTone("おはよう", "Good morning", "casual", {
      execAI: execAIMock,
    });

    const promptArg = execAIMock.mock.calls[0]?.[0] as string;
    expect(promptArg).toContain("おはよう");
    expect(promptArg).toContain("Good morning");
    expect(promptArg).toContain("casual");
    // {direction} などのプレースホルダが残っていないこと
    expect(promptArg).not.toContain("{direction}");
    expect(promptArg).not.toContain("{originalText}");
    expect(promptArg).not.toContain("{currentTranslation}");
  });

  it("formal 指定時に direction プレースホルダが formal で置換される", () => {
    const execAIMock = mock((_prompt: string) =>
      JSON.stringify({
        translation: "Hello",
        nuances: [],
        toneDescription: "",
        detectedLanguage: "Japanese",
        targetLanguage: "English",
      }),
    );

    retranslateWithTone("こんにちは", "Hi", "formal", { execAI: execAIMock });

    const promptArg = execAIMock.mock.calls[0]?.[0] as string;
    expect(promptArg).toContain("formal");
    expect(promptArg).not.toContain("casual");
  });

  it("AI出力がスキーマに合わない場合はエラーを投げる", () => {
    const execAIMock = mock((_prompt: string) =>
      JSON.stringify({ invalid: "shape" }),
    );

    expect(() =>
      retranslateWithTone("テスト", "test", "casual", { execAI: execAIMock }),
    ).toThrow();
  });

  it("AI出力がJSON形式でない場合はエラーを投げる", () => {
    const execAIMock = mock((_prompt: string) => "not valid json");

    expect(() =>
      retranslateWithTone("テスト", "test", "formal", { execAI: execAIMock }),
    ).toThrow();
  });
});
