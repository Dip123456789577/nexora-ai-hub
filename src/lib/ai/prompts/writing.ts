import type { TranslateInput, ParaphraseInput, GrammarInput } from "../types";

export function buildTranslatePrompt(input: TranslateInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are NEXORA Polyglot Translation Engine.
Translate the text faithfully and naturally into ${input.targetLanguage}.
${input.tone ? `Maintain a ${input.tone} tone and register.` : ""}
Preserve formatting, technical jargon, code blocks, and markdown intact.
Return only the translated output unless grammatical or cultural context notes are essential.`;

  const userPrompt = `Source Language: ${input.sourceLanguage || "Auto-detect"}
Target Language: ${input.targetLanguage}
Tone: ${input.tone || "Natural"}

TEXT TO TRANSLATE:
"""
${input.text}
"""`;

  return { systemPrompt, userPrompt };
}

export function buildParaphrasePrompt(input: ParaphraseInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are NEXORA Stylistic Rewrite Engine.
Rephrase the supplied text in the requested mode: ${input.mode}.
- Formal: Elevated vocabulary, professional sentence cadence, authoritative tone.
- Simple: Clear, accessible, short sentences, plain language without jargon.
- Academic: Rigorous terminology, passive/active analytical balance, scholarly rhetoric.
- Professional: Concise, executive-ready, action-oriented.
- Creative: Rich metaphorical imagery, dynamic rhythm, engaging storytelling.
Preserve the core message and all factual information accurately.`;

  const userPrompt = `MODE: ${input.mode}

ORIGINAL TEXT:
"""
${input.text}
"""

Provide:
1. The rewritten text in full.
2. A brief 1-2 sentence note on key stylistic shifts applied.`;

  return { systemPrompt, userPrompt };
}

export function buildGrammarPrompt(input: GrammarInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are NEXORA Editorial Proofreader.
Detect all orthographic, grammatical, syntactical, and stylistic infelicities.
Always respond in valid JSON with this schema:
{
  "correctedText": "The fully corrected text",
  "score": 92,
  "summary": "Brief editorial summary of changes made",
  "corrections": [
    {
      "original": "incorrect segment",
      "corrected": "fixed segment",
      "explanation": "Why this was revised",
      "type": "grammar"
    }
  ]
}
Output valid JSON only.`;

  const userPrompt = `Review and correct this text:
"""
${input.text}
"""`;

  return { systemPrompt, userPrompt };
}
