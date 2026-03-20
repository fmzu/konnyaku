import Anthropic from "@anthropic-ai/sdk";

export interface TranslationResult {
  translation: string;
  nuances: string[];
  formality: number; // 1-5
  detectedLanguage: string;
  targetLanguage: string;
}

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a translation assistant. Translate the given text and provide nuance explanations.

Detect the input language:
- If Japanese → translate to English
- If English (or other) → translate to Japanese

Respond ONLY with valid JSON in this exact format:
{
  "translation": "translated text here",
  "nuances": [
    "explanation of nuance 1",
    "explanation of nuance 2"
  ],
  "formality": 3,
  "detectedLanguage": "English",
  "targetLanguage": "Japanese"
}

Rules for nuances:
- Explain the tone and intent of expressions
- Note if expressions are casual, formal, or business-like
- Explain cultural context if relevant
- Write nuance explanations in Japanese
- 2-4 bullet points

Rules for formality:
- 1: Very casual (slang, friends)
- 2: Casual (everyday conversation)
- 3: Neutral/Business casual
- 4: Formal (business)
- 5: Very formal (official documents)`;

export async function translate(text: string): Promise<TranslationResult> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: text }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  return JSON.parse(content.text) as TranslationResult;
}
