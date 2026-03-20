export interface TranslationResult {
  translation: string;
  nuances: string[];
  formality: number; // 1-5
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
  "formality": 3,
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

Rules for formality:
- 1: Very casual (slang, friends)
- 2: Casual (everyday conversation)
- 3: Neutral/Business casual
- 4: Formal (business)
- 5: Very formal (official documents)

Text to translate:
`;

export async function translate(text: string): Promise<TranslationResult> {
  const prompt = PROMPT_TEMPLATE + text;

  const result = Bun.spawnSync(["claude", "-p", prompt], {
    stdout: "pipe",
    stderr: "pipe",
  });

  if (result.exitCode !== 0) {
    const stderr = result.stderr.toString();
    throw new Error(`claude command failed: ${stderr}`);
  }

  const output = result.stdout.toString().trim();

  // Extract JSON from response (handle potential markdown code fences)
  const jsonMatch = output.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse translation response");
  }

  return JSON.parse(jsonMatch[0]) as TranslationResult;
}
