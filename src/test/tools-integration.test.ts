import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { buildExamAnswerPrompt } from "../lib/ai/prompts/exam-answer";
import { buildCodeHelperPrompt, buildSqlHelperPrompt } from "../lib/ai/prompts/developer";
import { buildTranslatePrompt, buildParaphrasePrompt } from "../lib/ai/prompts/writing";

describe("NEXORA AI Complete Suite Routing", () => {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
  });

  const routesToTest = [
    "/",
    "/dashboard",
    "/study/exam-answer",
    "/study/quiz",
    "/study/flashcards",
    "/study/summarizer",
    "/assistant/chat",
    "/assistant/image-qa",
    "/assistant/image-generator",
    "/developer/debugger",
    "/developer/sql",
    "/writing/translate",
    "/writing/paraphrase",
    "/career/resume-builder",
    "/research/web",
    "/productivity/tasks",
    "/history",
    "/settings",
    "/admin",
    "/auth/login",
  ];

  routesToTest.forEach((path) => {
    it(`correctly matches route for ${path}`, () => {
      const matches = router.matchRoutes(path);
      expect(matches.length).toBeGreaterThan(0);
      const lastMatch = matches.at(-1);
      expect(lastMatch?.routeId).toBeDefined();
    });
  });
});

describe("Academic & Developer Prompt Engines", () => {
  it("enforces 2-mark concise definition guidelines", () => {
    const { userPrompt } = buildExamAnswerPrompt({
      question: "Define Amdahl’s Law.",
      marks: 2,
      difficulty: "Foundation",
      academicLevel: "Undergraduate",
      subject: "Computer Science",
      language: "English",
      format: "Standard Exam",
    });
    expect(userPrompt).toContain("2 marks");
    expect(userPrompt).toContain("80-120 words");
  });

  it("enforces 20-mark capstone thesis guidelines", () => {
    const { userPrompt } = buildExamAnswerPrompt({
      question:
        "Critique the Paxos consensus algorithm in asynchronous networks with Byzantine faults.",
      marks: 20,
      difficulty: "Master",
      academicLevel: "Postgraduate",
      subject: "Distributed Systems",
      language: "English",
      format: "Thesis & Analytical",
    });
    expect(userPrompt).toContain("20 marks");
    expect(userPrompt).toContain("1800-2500 words");
  });

  it("formats SQL prompt with schema injection", () => {
    const { userPrompt } = buildSqlHelperPrompt({
      prompt: "Calculate user churn per cohort",
      dialect: "PostgreSQL",
      schema: "CREATE TABLE churn_log (user_id UUID, churned_at TIMESTAMPTZ);",
      action: "generate",
    });
    expect(userPrompt).toContain("PostgreSQL");
    expect(userPrompt).toContain("churn_log");
  });

  it("formats Code Debugger prompt with error diagnosis tags", () => {
    const { userPrompt } = buildCodeHelperPrompt({
      task: "Fix NullPointerException in payment webhook",
      language: "Java",
      code: "payment.process();",
      action: "debug",
    });
    expect(userPrompt).toContain("NullPointerException");
    expect(userPrompt).toContain("Java");
    expect(userPrompt).toContain("DEBUG");
  });

  it("formats Translation prompt preserving code tags", () => {
    const { systemPrompt } = buildTranslatePrompt({
      text: 'Console.log("Hello World");',
      targetLanguage: "German",
      tone: "Technical",
    });
    expect(systemPrompt).toContain("German");
    expect(systemPrompt).toContain("code blocks");
  });
});
