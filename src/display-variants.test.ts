import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { displayVariants } from "./display-variants.js";
import type { TranslationResult } from "./translate.js";

type EnglishTranslationResult = Extract<
  TranslationResult,
  { targetLanguage: "English" }
>;

describe("displayVariants", () => {
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

  const result: EnglishTranslationResult = {
    targetLanguage: "English",
    detectedLanguage: "Japanese",
    variants: {
      casual: { text: "Sorry, I'm late!", gloss: "ごめん、遅刻しちゃった！" },
      neutral: {
        text: "I'm sorry for being late.",
        gloss: "すみません、遅刻しました",
      },
      business: {
        text: "I sincerely apologize for my late arrival.",
        gloss: "大変申し訳ございません、遅刻いたしました",
      },
    },
  };

  it("3バリアントのラベル・英文・glossがすべて出力される", () => {
    displayVariants(result);

    const joined = logOutputs.join("\n");
    expect(joined).toContain("[カジュアル]");
    expect(joined).toContain("Sorry, I'm late!");
    expect(joined).toContain("ごめん、遅刻しちゃった！");

    expect(joined).toContain("[ふつう]");
    expect(joined).toContain("I'm sorry for being late.");
    expect(joined).toContain("すみません、遅刻しました");

    expect(joined).toContain("[ビジネス]");
    expect(joined).toContain("I sincerely apologize for my late arrival.");
    expect(joined).toContain("大変申し訳ございません、遅刻いたしました");
  });

  it("英文と入れ替わりでニュアンス箇条書き(・)は表示されない", () => {
    displayVariants(result);

    const joined = logOutputs.join("\n");
    expect(joined).not.toContain("・");
  });
});
