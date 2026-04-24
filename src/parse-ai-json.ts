import type { z } from "zod";

export function parseAIJson<T>(output: string, schema: z.ZodType<T>): T {
  let parsed: unknown;
  try {
    parsed = JSON.parse(output);
  } catch {
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(
        "Failed to parse AI response: no JSON object found in output",
      );
    }
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error("Failed to parse AI response: extracted JSON is invalid");
    }
  }

  try {
    return schema.parse(parsed);
  } catch {
    throw new Error(
      "AI応答が期待された形式と一致しません。再試行してください。",
    );
  }
}
