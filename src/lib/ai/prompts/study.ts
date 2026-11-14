import type { QuizInput, FlashcardInput, SummarizeInput } from "../types";

export function buildQuizPrompt(input: QuizInput): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are NEXORA Assessment Engine. You generate rigorous interactive quizzes with multiple-choice questions.
Always respond with valid JSON adhering to this exact schema:
{
  "title": "Quiz Title",
  "topic": "${input.topic}",
  "difficulty": "${input.difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed explanation of why this option is correct."
    }
  ]
}
Do not wrap in markdown code blocks if returning JSON. Only output valid JSON.`;

  const userPrompt = `Generate a ${input.difficulty} level quiz on the topic "${input.topic}".
Create exactly ${input.questionCount} questions.
Question Type: ${input.type === "true-false" ? "True/False (2 options per question)" : "Multiple Choice (4 distinct plausible options per question)"}.
Make distractors thoughtful and explanations academically thorough.`;

  return { systemPrompt, userPrompt };
}

export function buildFlashcardPrompt(input: FlashcardInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are NEXORA Active Recall Architect. You construct optimal flashcards for spaced repetition.
Always respond with valid JSON adhering to this schema:
{
  "title": "Flashcards: ${input.topic}",
  "topic": "${input.topic}",
  "cards": [
    {
      "id": 1,
      "front": "Prompt or Question",
      "back": "Concise, authoritative explanation",
      "category": "Core Principle"
    }
  ]
}
Do not wrap in markdown code blocks. Output pure JSON only.`;

  const userPrompt = `Create ${input.cardCount} flashcards for topic: "${input.topic}".
Depth: ${input.depth}.
Ensure the front prompts active retrieval, and the back is crisp, clear, and comprehensive.`;

  return { systemPrompt, userPrompt };
}

export function buildSummarizePrompt(input: SummarizeInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are NEXORA Neural Synthesizer. You condense documents and complex texts into high-density executive intelligence.
Formatting guidelines:
- If format is 'bullet-points': use crisp, thematic bulleted clusters.
- If format is 'executive-summary': provide an executive briefing followed by key strategic implications.
- If format is 'key-takeaways': highlight actionable conclusions with priority tags.
- Always include a Key Definitions glossary if requested.`;

  const userPrompt = `Target length: ${input.length.toUpperCase()}
Format: ${input.format}
Include Definitions: ${input.includeDefinitions ? "YES" : "NO"}

SOURCE CONTENT TO SYNTHESIZE:
"""
${input.text}
"""

Synthesize the content now with maximum informational clarity.`;

  return { systemPrompt, userPrompt };
}
