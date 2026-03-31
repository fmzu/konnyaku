import { describe, it, expect } from "bun:test";
import { z } from "zod";
import { parseAIJson } from "./parse-ai-json.js";

const testSchema = z.object({
  translation: z.string(),
  explanation: z.string(),
});

describe("parseAIJson", () => {
  it("正しいJSONを直接パースできる", () => {
    const input = JSON.stringify({
      translation: "Hello",
      explanation: "挨拶",
    });
    const result = parseAIJson(input, testSchema);
    expect(result).toEqual({ translation: "Hello", explanation: "挨拶" });
  });

  it("JSON以外のテキストが前後にある場合でもパースできる", () => {
    const input = `Here is the result:\n{"translation": "Hello", "explanation": "挨拶"}\nDone.`;
    const result = parseAIJson(input, testSchema);
    expect(result).toEqual({ translation: "Hello", explanation: "挨拶" });
  });

  it("JSONが含まれない出力でエラーを投げる", () => {
    expect(() => parseAIJson("no json here", testSchema)).toThrow(
      "no JSON object found"
    );
  });

  it("不正なJSONでエラーを投げる", () => {
    expect(() => parseAIJson("prefix {invalid json} suffix", testSchema)).toThrow(
      "extracted JSON is invalid"
    );
  });

  it("zodスキーマに合わないJSONでエラーを投げる", () => {
    const input = JSON.stringify({ wrong: "field" });
    expect(() => parseAIJson(input, testSchema)).toThrow();
  });
});
