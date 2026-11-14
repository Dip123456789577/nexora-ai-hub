import { isGeminiConfigured } from "./providers/gemini";
import { isOpenAIConfigured } from "./providers/openai";
import { isAnthropicConfigured } from "./providers/anthropic";
import { isTavilyConfigured } from "./providers/tavily";
import { isJudge0Configured } from "./providers/judge0";
import type { ProviderConfigStatus } from "./types";

export function getAllProviderStatuses(): ProviderConfigStatus[] {
  const isSupabaseConfigured = Boolean(
    typeof process !== "undefined" &&
    (process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"]) &&
    (process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"]),
  );

  return [
    {
      id: "gemini",
      name: "Google Gemini",
      description:
        "Primary AI engine for multi-turn chat, exam answers, structured reasoning, code generation, and multimodal vision.",
      category: "text",
      envVar: "GEMINI_API_KEY",
      isConfigured: isGeminiConfigured(),
      defaultModel: "gemini-2.5-flash",
      supportedModels: ["gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.5-pro"],
      docsUrl: "https://aistudio.google.com/app/apikey",
      statusMessage: isGeminiConfigured()
        ? "Connected & Operational"
        : "Waiting for GEMINI_API_KEY",
    },
    {
      id: "supabase",
      name: "Supabase Cloud",
      description:
        "Database, user authentication, RLS row-level security, cloud history, and file storage.",
      category: "database",
      envVar: "SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY",
      isConfigured: isSupabaseConfigured,
      defaultModel: "PostgreSQL 15 + RLS",
      supportedModels: ["PostgreSQL Auth", "PostgreSQL Database", "Supabase Storage"],
      docsUrl: "https://supabase.com/dashboard",
      statusMessage: isSupabaseConfigured
        ? "Connected & Operational"
        : "Waiting for Supabase credentials",
    },
    {
      id: "openai",
      name: "OpenAI",
      description:
        "Optional alternative intelligence provider for GPT-4o and specialized reasoning pipelines.",
      category: "text",
      envVar: "OPENAI_API_KEY",
      isConfigured: isOpenAIConfigured(),
      defaultModel: "gpt-4o",
      supportedModels: ["gpt-4o", "gpt-4o-mini", "o1-mini"],
      docsUrl: "https://platform.openai.com/api-keys",
      statusMessage: isOpenAIConfigured()
        ? "Connected & Operational"
        : "Waiting for OPENAI_API_KEY (Optional)",
    },
    {
      id: "anthropic",
      name: "Anthropic Claude",
      description: "Optional Claude 3.5 Sonnet provider for nuanced analysis and technical prose.",
      category: "text",
      envVar: "ANTHROPIC_API_KEY",
      isConfigured: isAnthropicConfigured(),
      defaultModel: "claude-3-5-sonnet-20241022",
      supportedModels: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"],
      docsUrl: "https://console.anthropic.com/settings/keys",
      statusMessage: isAnthropicConfigured()
        ? "Connected & Operational"
        : "Waiting for ANTHROPIC_API_KEY (Optional)",
    },
    {
      id: "tavily",
      name: "Tavily Search Engine",
      description:
        "Autonomous web search API for grounding research and citing live factual sources.",
      category: "search",
      envVar: "TAVILY_API_KEY",
      isConfigured: isTavilyConfigured(),
      defaultModel: "Tavily Search v1",
      supportedModels: ["Tavily Deep Search", "Tavily News"],
      docsUrl: "https://tavily.com",
      statusMessage: isTavilyConfigured()
        ? "Connected & Operational"
        : "Waiting for TAVILY_API_KEY (Optional)",
    },
    {
      id: "judge0",
      name: "Judge0 Code Sandbox",
      description:
        "Isolated containerized execution sandbox for compiling and executing code safely.",
      category: "code-exec",
      envVar: "JUDGE0_API_KEY",
      isConfigured: isJudge0Configured(),
      defaultModel: "Judge0 CE v1.13",
      supportedModels: ["Python 3.10", "Node.js 20", "C++ 20", "Java 17", "Rust 1.70"],
      docsUrl: "https://judge0.com",
      statusMessage: isJudge0Configured()
        ? "Connected & Operational"
        : "Waiting for JUDGE0_API_KEY (Optional)",
    },
  ];
}
