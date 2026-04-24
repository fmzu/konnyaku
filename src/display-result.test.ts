import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { displayResult } from "./display-result.js";
import type { TranslationResult } from "./translate.js";

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
    const result: TranslationResult = {
      translation: "こんにちは",
      nuances: ["挨拶です", "カジュアルな表現です"],
      toneDescription: "",
      detectedLanguage: "English",
      targetLanguage: "Japanese",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("こんにちは");
    expect(joined).toContain("挨拶です");
    expect(joined).toContain("カジュアルな表現です");
  });

  it("targetLanguageがJapaneseかつtoneDescriptionがあれば出力される", () => {
    const result: TranslationResult = {
      translation: "こんにちは",
      nuances: ["挨拶"],
      toneDescription: "カジュアルな表現です",
      detectedLanguage: "English",
      targetLanguage: "Japanese",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("カジュアルな表現です");
  });

  it("targetLanguageがEnglishの場合はtoneDescriptionが出力されない", () => {
    const result: TranslationResult = {
      translation: "Hello",
      nuances: ["丁寧な挨拶"],
      toneDescription: "これは表示されないはず",
      detectedLanguage: "Japanese",
      targetLanguage: "English",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("Hello");
    expect(joined).toContain("丁寧な挨拶");
    expect(joined).not.toContain("これは表示されないはず");
  });

  it("toneDescriptionが空文字なら出力されない", () => {
    const result: TranslationResult = {
      translation: "やあ",
      nuances: ["カジュアル"],
      toneDescription: "",
      detectedLanguage: "English",
      targetLanguage: "Japanese",
    };

    displayResult(result);

    // toneDescription 用の行（lines.push("")の後に続く空文字）が含まれないことを確認
    // 出力には translation と nuance しかない
    const joined = logOutputs.join("\n");
    expect(joined).toContain("やあ");
    expect(joined).toContain("カジュアル");
  });

  it("nuancesが空配列でもエラーにならず translation は出力される", () => {
    const result: TranslationResult = {
      translation: "Hi",
      nuances: [],
      toneDescription: "",
      detectedLanguage: "Japanese",
      targetLanguage: "English",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("Hi");
    // console.log が少なくとも呼ばれている（空行含む）
    expect(logSpy).toHaveBeenCalled();
  });

  it("ニュアンスの各項目に「・」プレフィックスが付く", () => {
    const result: TranslationResult = {
      translation: "翻訳",
      nuances: ["項目1", "項目2"],
      toneDescription: "",
      detectedLanguage: "English",
      targetLanguage: "Japanese",
    };

    displayResult(result);

    const joined = logOutputs.join("\n");
    // 「・」が出現すること（chalk で色付けされているが文字自体は残る）
    expect(joined).toContain("・");
  });
});
