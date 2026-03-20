export interface TranslationResult {
  translation: string;
  nuances: string[];
  toneDescription: string; // text description of tone (EN→JP only)
  detectedLanguage: string;
  targetLanguage: string;
}

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

const RETRANSLATE_PROMPT_TEMPLATE = `You are a translation assistant. The following Japanese text was translated to English as shown below. Please provide a more {direction} version of this English translation.

Original Japanese: {originalText}
Current English translation: {currentTranslation}

Adjust the tone to be more {direction}. Keep the meaning the same.

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "translation": "adjusted English translation here",
  "nuances": [
    "explanation of nuance 1",
    "explanation of nuance 2"
  ],
  "toneDescription": "",
  "detectedLanguage": "Japanese",
  "targetLanguage": "English"
}

Rules for nuances:
- Explain the English grammar and expressions used in YOUR translation
- Help the user (a Japanese learner of English) understand WHY you chose those English expressions
- Write nuance explanations in Japanese
- 2-4 bullet points
`;

import { execFileSync } from "node:child_process";

function runClaude(prompt: string): TranslationResult {
  let output: string;
  try {
    output = execFileSync("claude", ["-p", prompt], {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch (e: any) {
    throw new Error(`claude command failed: ${e.stderr || e.message}`);
  }

  // Extract JSON from response (handle potential markdown code fences)
  const jsonMatch = output.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse translation response");
  }

  return JSON.parse(jsonMatch[0]) as TranslationResult;
}

export async function translate(text: string): Promise<TranslationResult> {
  const prompt = PROMPT_TEMPLATE + text;
  return runClaude(prompt);
}

export async function retranslateWithTone(
  originalText: string,
  currentTranslation: string,
  direction: "casual" | "formal",
): Promise<TranslationResult> {
  const directionJa = direction === "casual" ? "casual" : "formal";
  const prompt = RETRANSLATE_PROMPT_TEMPLATE
    .replace(/\{direction\}/g, directionJa)
    .replace("{originalText}", originalText)
    .replace("{currentTranslation}", currentTranslation);
  return runClaude(prompt);
}
