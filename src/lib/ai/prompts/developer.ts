import type { CodeHelperInput, SqlHelperInput } from "../types";

export function buildCodeHelperPrompt(input: CodeHelperInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are NEXORA Principal Software Engineer and Compiler Architect.
Provide production-ready, clean, secure, idiomatically typed code.
Follow modern best practices (clean architecture, error handling, defensive programming).
Include syntax-highlighted code blocks with the exact language tag.
Provide clear explanations of computational complexity (Big O time & space) where relevant.`;

  let userPrompt = `LANGUAGE: ${input.language}\nACTION: ${input.action.toUpperCase()}\n\n`;

  if (input.action === "generate") {
    userPrompt += `TASK:\n${input.task}\n\nGenerate complete, well-commented code meeting these requirements.`;
  } else if (input.action === "debug") {
    userPrompt += `PROBLEM / ERROR:\n${input.task}\n\nSOURCE CODE:\n\`\`\`${input.language}\n${input.code || ""}\n\`\`\`\n\nIdentify the root cause, explain the flaw, and provide the fully corrected code with defensive guards.`;
  } else if (input.action === "optimize") {
    userPrompt += `SOURCE CODE TO OPTIMIZE:\n\`\`\`${input.language}\n${input.code || ""}\n\`\`\`\n\nAnalyze time/space bottlenecks, optimize algorithmic efficiency, and present the refactored code with benchmark reasoning.`;
  } else if (input.action === "convert") {
    userPrompt += `CONVERT FROM: ${input.language}\nCONVERT TO: ${input.targetLanguage || "TypeScript"}\n\nSOURCE CODE:\n\`\`\`${input.language}\n${input.code || ""}\n\`\`\`\n\nConvert into idiomatic, modern ${input.targetLanguage}.`;
  } else {
    userPrompt += `CODE TO EXPLAIN:\n\`\`\`${input.language}\n${input.code || ""}\n\`\`\`\n\nExplain this code step by step, highlighting control flow, state mutations, and architecture.`;
  }

  return { systemPrompt, userPrompt };
}

export function buildSqlHelperPrompt(input: SqlHelperInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are NEXORA Database Administrator & Query Optimizer.
Target Dialect: ${input.dialect}.
Provide production-grade SQL with appropriate indexing suggestions, EXPLAIN analysis notes, and dialect-specific optimizations.`;

  let userPrompt = `DIALECT: ${input.dialect}\nACTION: ${input.action.toUpperCase()}\n`;
  if (input.schema) {
    userPrompt += `EXISTING SCHEMA:\n\`\`\`sql\n${input.schema}\n\`\`\`\n`;
  }
  userPrompt += `\nREQUEST:\n${input.prompt}`;

  return { systemPrompt, userPrompt };
}
