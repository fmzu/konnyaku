import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { displayResult } from "./display-result.js";
import type { TranslationResult } from "./translate.js";

type JapaneseTranslationResult = Extract<
  TranslationResult,
  { targetLanguage: "Japanese" }
>;

describe("displayResult", () => {
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

  it("翻訳結果とニュアンスが出力される", () => {
    const result: JapaneseTranslationResult = {
      targetLanguage: "Japanese",
      translation: "こんにちは",
      nuances: ["挨拶です", "カジュアルな表現です"],
      toneDescription: "",
      detectedLanguage: "English",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("こんにちは");
    expect(joined).toContain("挨拶です");
    expect(joined).toContain("カジュアルな表現です");
  });

  it("toneDescriptionがあれば出力される", () => {
    const result: JapaneseTranslationResult = {
      targetLanguage: "Japanese",
      translation: "こんにちは",
      nuances: ["挨拶"],
      toneDescription: "カジュアルな表現です",
      detectedLanguage: "English",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("カジュアルな表現です");
  });

  it("toneDescriptionが空文字なら出力されない", () => {
    const result: JapaneseTranslationResult = {
      targetLanguage: "Japanese",
      translation: "やあ",
      nuances: ["カジュアル"],
      toneDescription: "",
      detectedLanguage: "English",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("やあ");
    expect(joined).toContain("カジュアル");
  });

  it("nuancesが空配列でもエラーにならず translation は出力される", () => {
    const result: JapaneseTranslationResult = {
      targetLanguage: "Japanese",
      translation: "Hi",
      nuances: [],
      toneDescription: "",
      detectedLanguage: "English",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("Hi");
    expect(logSpy).toHaveBeenCalled();
  });

  it("ニュアンスの各項目に「・」プレフィックスが付く", () => {
    const result: JapaneseTranslationResult = {
      targetLanguage: "Japanese",
      translation: "翻訳",
      nuances: ["項目1", "項目2"],
      toneDescription: "",
      detectedLanguage: "English",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("・");
  });
});
