import { z } from "zod";
import { execAI } from "./exec-ai.js";
import { parseAIJson } from "./parse-ai-json.js";

export const TranslationResultSchema = z.object({
  translation: z.string(),
  nuances: z.array(z.string()),
  toneDescription: z.string(), // text description of tone (EN→JP only)
  detectedLanguage: z.string(),
  targetLanguage: z.string(),
});

export type TranslationResult = z.infer<typeof TranslationResultSchema>;

const PROMPT_TEMPLATE = `You are a translation assistant. Translate the given text and provide nuance explanations.

Detect the input language:
- If Japanese → translate to English
- If English (or other) → translate to Japanese

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "translation": "translated text here",
  "nuances": [
    "explanation of nuance 1",
    "explanation of nuance 2"
  ],
  "toneDescription": "tone description here or empty string",
  "detectedLanguage": "English",
  "targetLanguage": "Japanese"
}

Rules for nuances (IMPORTANT — behavior differs by direction):

If input is English → output is Japanese:
- Explain the tone and intent of the English input's expressions
- Note if expressions are casual, formal, or business-like
- Explain cultural context if relevant

If input is Japanese → output is English:
- Do NOT explain the Japanese input's meaning
- Instead, explain the English grammar and expressions used in YOUR translation
- Help the user (a Japanese learner of English) understand WHY you chose those English expressions
- Examples of good nuance explanations for Japanese→English:
  - "I'd like to" は丁寧に希望を伝える表現。"I want to" よりフォーマル
  - "regarding" は "about" のフォーマルな言い換えで、ビジネスメールでよく使われる
  - "Could you ...?" は "Can you ...?" より丁寧な依頼表現

General rules for nuances:
- Write nuance explanations in Japanese
- 2-4 bullet points

Rules for toneDescription:
- If input is English (translating to Japanese): Write a natural Japanese sentence describing the tone/formality of the original English text. Examples: "ビジネスシーンでよく使われるカジュアルな表現です", "フォーマルな文書向けの表現です", "友人同士で使うくだけた表現です"
- If input is Japanese (translating to English): Set toneDescription to "" (empty string)

Text to translate:
`;

export function translate(
  text: string,
  deps: { execAI: (prompt: string) => string } = { execAI },
): TranslationResult {
  const prompt = PROMPT_TEMPLATE + text;
  const output = deps.execAI(prompt);
  return parseAIJson(output, TranslationResultSchema);
}
