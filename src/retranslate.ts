import { execAI } from "./exec-ai.js";
import { parseAIJson } from "./parse-ai-json.js";
import {
  type TranslationResult,
  TranslationResultSchema,
} from "./translate.js";

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

export function retranslateWithTone(
  originalText: string,
  currentTranslation: string,
  direction: "casual" | "formal",
): TranslationResult {
  const directionJa = direction === "casual" ? "casual" : "formal";
  const prompt = RETRANSLATE_PROMPT_TEMPLATE.replaceAll(
    "{direction}",
    directionJa,
  )
    .replaceAll("{originalText}", originalText)
    .replaceAll("{currentTranslation}", currentTranslation);
  const output = execAI(prompt);
  return parseAIJson(output, TranslationResultSchema);
}
