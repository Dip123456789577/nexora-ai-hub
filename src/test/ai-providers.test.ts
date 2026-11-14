import { describe, expect, it } from "vitest";
import { getAllProviderStatuses } from "../lib/ai/provider-manager";
import { buildExamAnswerPrompt } from "../lib/ai/prompts/exam-answer";
import { buildQuizPrompt, buildFlashcardPrompt } from "../lib/ai/prompts/study";
import { callGemini } from "../lib/ai/providers/gemini";

describe("AI Provider Layer", () => {
  it("returns all provider statuses with accurate configuration flags", () => {
    const statuses = getAllProviderStatuses();
    expect(statuses.length).toBeGreaterThanOrEqual(5);

    const gemini = statuses.find((s) => s.id === "gemini");
    expect(gemini).toBeDefined();
    expect(gemini?.name).toBe("Google Gemini");
    expect(gemini?.defaultModel).toBe("gemini-2.5-flash");
  });

  it("handles missing GEMINI_API_KEY gracefully with configGuide", async () => {
    const originalKey = process.env["GEMINI_API_KEY"];
    delete process.env["GEMINI_API_KEY"];
    delete process.env["GOOGLE_GENERATIVE_AI_API_KEY"];

    const result = await callGemini("Hello");
    expect(result.success).toBe(false);
    expect(result.isConfigured).toBe(false);
    expect(result.configGuide).toBeDefined();
    expect(result.configGuide?.envVar).toBe("GEMINI_API_KEY");

    if (originalKey) {
      process.env["GEMINI_API_KEY"] = originalKey;
    }
  });

  it("builds Exam Answer Prompts with mark-specific rubrics", () => {
    const { systemPrompt, userPrompt } = buildExamAnswerPrompt({
      question: "Explain Quantum Entanglement and its applications in cryptography.",
      marks: 10,
      difficulty: "Advanced",
      academicLevel: "Undergraduate",
      subject: "Physics",
      language: "English",
      format: "Standard Exam",
    });

    expect(systemPrompt).toContain("NEXORA University Rubric Engine");
    expect(userPrompt).toContain("10 marks");
    expect(userPrompt).toContain("Quantum Entanglement");
    expect(userPrompt).toContain("Undergraduate");
  });

  it("builds structured Quiz Prompt with JSON schema expectations", () => {
    const { systemPrompt, userPrompt } = buildQuizPrompt({
      topic: "Photosynthesis",
      questionCount: 5,
      difficulty: "Medium",
      type: "mcq",
    });

    expect(systemPrompt).toContain("valid JSON");
    expect(userPrompt).toContain("Photosynthesis");
    expect(userPrompt).toContain("5 questions");
  });

  it("builds structured Flashcard Prompt", () => {
    const { userPrompt } = buildFlashcardPrompt({
      topic: "Neural Networks",
      cardCount: 8,
      depth: "Core Concepts",
    });

    expect(userPrompt).toContain("8 flashcards");
    expect(userPrompt).toContain("Neural Networks");
  });
});
