import { describe, expect, it } from "bun:test";
import chalk from "chalk";
import { highlightEnglish } from "./highlight-english.js";

describe("highlightEnglish", () => {
  it("「」内の英語がハイライトされる", () => {
    const result = highlightEnglish("これは「Hello World」です");
    expect(result).toBe(`これは${chalk.cyan("Hello World")}です`);
  });

  it('""内の英語がハイライトされる', () => {
    const result = highlightEnglish('これは"Hello World"です');
    expect(result).toBe(`これは${chalk.cyan("Hello World")}です`);
  });

  it("日本語中の英語フレーズがハイライトされる", () => {
    const result = highlightEnglish("今日はGood morningと言った");
    expect(result).toBe(`今日は${chalk.cyan("Good morning")}と言った`);
  });

  it("英語のみのテキストはハイライトされる", () => {
    const result = highlightEnglish("Hello World.");
    expect(result).toBe(chalk.cyan("Hello World."));
  });

  it("日本語のみのテキストはそのまま返る", () => {
    const result = highlightEnglish("こんにちは世界");
    expect(result).toBe("こんにちは世界");
  });
});
