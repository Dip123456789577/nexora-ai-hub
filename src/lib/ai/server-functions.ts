import { createServerFn } from "@tanstack/react-start";
import { callGemini } from "./providers/gemini";
import { callOpenAI } from "./providers/openai";
import { callAnthropic } from "./providers/anthropic";
import { getAllProviderStatuses } from "./provider-manager";
import { buildExamAnswerPrompt } from "./prompts/exam-answer";
import { buildQuizPrompt, buildFlashcardPrompt, buildSummarizePrompt } from "./prompts/study";
import { buildTranslatePrompt, buildParaphrasePrompt, buildGrammarPrompt } from "./prompts/writing";
import { buildCodeHelperPrompt, buildSqlHelperPrompt } from "./prompts/developer";
import type {
  ExamAnswerInput,
  QuizInput,
  FlashcardInput,
  SummarizeInput,
  TranslateInput,
  ParaphraseInput,
  GrammarInput,
  CodeHelperInput,
  SqlHelperInput,
  ImageQAInput,
  AIResult,
  QuizResultData,
  FlashcardResultData,
  GrammarResultData,
  ProviderConfigStatus,
} from "./types";

// Central Status Function
export const getProviderStatusesFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProviderConfigStatus[]> => {
    return getAllProviderStatuses();
  },
);

// Exam Answer Writer Server Function
export const generateExamAnswerFn = createServerFn({ method: "POST" })
  .validator((data: ExamAnswerInput) => data)
  .handler(async ({ data }): Promise<AIResult<string>> => {
    const { systemPrompt, userPrompt } = buildExamAnswerPrompt(data);
    return await callGemini(userPrompt, {
      systemPrompt,
      temperature: 0.5,
      maxOutputTokens: 8192,
    });
  });

// Quiz Generator Server Function
export const generateQuizFn = createServerFn({ method: "POST" })
  .validator((data: QuizInput) => data)
  .handler(async ({ data }): Promise<AIResult<QuizResultData>> => {
    const { systemPrompt, userPrompt } = buildQuizPrompt(data);
    const result = await callGemini(userPrompt, {
      systemPrompt,
      temperature: 0.6,
      jsonMode: true,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        isConfigured: result.isConfigured,
        provider: result.provider,
        model: result.model,
        error: result.error,
        configGuide: result.configGuide,
        durationMs: result.durationMs,
        metadata: result.metadata,
      };
    }

    try {
      const cleanJson = result.data
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleanJson) as QuizResultData;
      return {
        success: true,
        data: parsed,
        isConfigured: result.isConfigured,
        provider: result.provider,
        model: result.model,
        durationMs: result.durationMs,
        metadata: result.metadata,
      };
    } catch {
      return {
        success: false,
        error: "Failed to parse structured quiz data from model response.",
        isConfigured: result.isConfigured,
        provider: result.provider,
        model: result.model,
        durationMs: result.durationMs,
        metadata: result.metadata,
      };
    }
  });

// Flashcard Generator Server Function
export const generateFlashcardsFn = createServerFn({ method: "POST" })
  .validator((data: FlashcardInput) => data)
  .handler(async ({ data }): Promise<AIResult<FlashcardResultData>> => {
    const { systemPrompt, userPrompt } = buildFlashcardPrompt(data);
    const result = await callGemini(userPrompt, {
      systemPrompt,
      temperature: 0.6,
      jsonMode: true,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        isConfigured: result.isConfigured,
        provider: result.provider,
        model: result.model,
        error: result.error,
        configGuide: result.configGuide,
        durationMs: result.durationMs,
        metadata: result.metadata,
      };
    }

    try {
      const cleanJson = result.data
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleanJson) as FlashcardResultData;
      return {
        success: true,
        data: parsed,
        isConfigured: result.isConfigured,
        provider: result.provider,
        model: result.model,
        durationMs: result.durationMs,
        metadata: result.metadata,
      };
    } catch {
      return {
        success: false,
        error: "Failed to parse structured flashcards data from model response.",
        isConfigured: result.isConfigured,
        provider: result.provider,
        model: result.model,
        durationMs: result.durationMs,
        metadata: result.metadata,
      };
    }
  });

// Summarizer Server Function
export const generateSummaryFn = createServerFn({ method: "POST" })
  .validator((data: SummarizeInput) => data)
  .handler(async ({ data }): Promise<AIResult<string>> => {
    const { systemPrompt, userPrompt } = buildSummarizePrompt(data);
    return await callGemini(userPrompt, {
      systemPrompt,
      temperature: 0.4,
    });
  });

// Translator Server Function
export const translateTextFn = createServerFn({ method: "POST" })
  .validator((data: TranslateInput) => data)
  .handler(async ({ data }): Promise<AIResult<string>> => {
    const { systemPrompt, userPrompt } = buildTranslatePrompt(data);
    return await callGemini(userPrompt, {
      systemPrompt,
      temperature: 0.3,
    });
  });

// Paraphraser Server Function
export const paraphraseTextFn = createServerFn({ method: "POST" })
  .validator((data: ParaphraseInput) => data)
  .handler(async ({ data }): Promise<AIResult<string>> => {
    const { systemPrompt, userPrompt } = buildParaphrasePrompt(data);
    return await callGemini(userPrompt, {
      systemPrompt,
      temperature: 0.7,
    });
  });

// Grammar Checker Server Function
export const checkGrammarFn = createServerFn({ method: "POST" })
  .validator((data: GrammarInput) => data)
  .handler(async ({ data }): Promise<AIResult<GrammarResultData>> => {
    const { systemPrompt, userPrompt } = buildGrammarPrompt(data);
    const result = await callGemini(userPrompt, {
      systemPrompt,
      temperature: 0.2,
      jsonMode: true,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        isConfigured: result.isConfigured,
        provider: result.provider,
        model: result.model,
        error: result.error,
        configGuide: result.configGuide,
        durationMs: result.durationMs,
        metadata: result.metadata,
      };
    }

    try {
      const cleanJson = result.data
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleanJson) as GrammarResultData;
      return {
        success: true,
        data: parsed,
        isConfigured: result.isConfigured,
        provider: result.provider,
        model: result.model,
        durationMs: result.durationMs,
        metadata: result.metadata,
      };
    } catch {
      return {
        success: false,
        error: "Failed to parse grammar correction data.",
        isConfigured: result.isConfigured,
        provider: result.provider,
        model: result.model,
        durationMs: result.durationMs,
        metadata: result.metadata,
      };
    }
  });

// Code Helper Server Function
export const codeHelperFn = createServerFn({ method: "POST" })
  .validator((data: CodeHelperInput) => data)
  .handler(async ({ data }): Promise<AIResult<string>> => {
    const { systemPrompt, userPrompt } = buildCodeHelperPrompt(data);
    return await callGemini(userPrompt, {
      systemPrompt,
      temperature: 0.2,
      maxOutputTokens: 8192,
    });
  });

// SQL Helper Server Function
export const sqlHelperFn = createServerFn({ method: "POST" })
  .validator((data: SqlHelperInput) => data)
  .handler(async ({ data }): Promise<AIResult<string>> => {
    const { systemPrompt, userPrompt } = buildSqlHelperPrompt(data);
    return await callGemini(userPrompt, {
      systemPrompt,
      temperature: 0.2,
    });
  });

// Multimodal Image Q&A Server Function
export const imageQAFn = createServerFn({ method: "POST" })
  .validator((data: ImageQAInput) => data)
  .handler(async ({ data }): Promise<AIResult<string>> => {
    return await callGemini(data.question, {
      systemPrompt:
        "You are NEXORA Vision & Diagram Analyst. Inspect the provided image in full detail, decipher diagrams, extract text (OCR), or solve academic problems step by step.",
      inlineImages: [
        {
          mimeType: data.mimeType,
          data: data.imageBase64,
        },
      ],
      temperature: 0.4,
    });
  });

// Generic Text Prompt Runner (supports Gemini, OpenAI, Anthropic)
export const runCustomPromptFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      prompt: string;
      provider?: string | undefined;
      model?: string | undefined;
      systemPrompt?: string | undefined;
    }) => data,
  )
  .handler(async ({ data }): Promise<AIResult<string>> => {
    const provider = data.provider || "gemini";
    if (provider === "openai") {
      return await callOpenAI(data.prompt, {
        model: data.model,
        systemPrompt: data.systemPrompt,
      });
    }
    if (provider === "anthropic") {
      return await callAnthropic(data.prompt, {
        model: data.model,
        systemPrompt: data.systemPrompt,
      });
    }
    return await callGemini(data.prompt, {
      model: data.model,
      systemPrompt: data.systemPrompt,
    });
  });
