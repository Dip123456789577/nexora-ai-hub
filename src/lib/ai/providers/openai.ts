import type { AIResult } from "../types";

export function getOpenAIApiKey(): string | undefined {
  if (typeof process !== "undefined") {
    return process.env["OPENAI_API_KEY"];
  }
  return undefined;
}

export function isOpenAIConfigured(): boolean {
  return Boolean(getOpenAIApiKey());
}

export async function callOpenAI(
  prompt: string,
  options: {
    model?: string | undefined;
    systemPrompt?: string | undefined;
    jsonMode?: boolean | undefined;
  } = {},
): Promise<AIResult<string>> {
  const startTime = Date.now();
  const apiKey = getOpenAIApiKey();

  if (!apiKey) {
    return {
      success: false,
      isConfigured: false,
      provider: "OpenAI",
      model: options.model || "gpt-4o",
      error:
        "OpenAI API key is not configured. Add OPENAI_API_KEY to your environment variables or in Settings.",
      configGuide: {
        provider: "OpenAI",
        envVar: "OPENAI_API_KEY",
        docsUrl: "https://platform.openai.com/api-keys",
        message: "Get your OpenAI API key from the OpenAI developer platform.",
      },
      durationMs: 0,
    };
  }

  const model = options.model || "gpt-4o";
  const messages: Array<{ role: string; content: string }> = [];

  if (options.systemPrompt) {
    messages.push({ role: "system", content: options.systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    const durationMs = Date.now() - startTime;

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMsg =
        (errorData as { error?: { message?: string } })?.error?.message ||
        `OpenAI returned status ${res.status}`;
      return {
        success: false,
        isConfigured: true,
        provider: "OpenAI",
        model,
        error: errorMsg,
        durationMs,
      };
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data?.choices?.[0]?.message?.content;

    return {
      success: true,
      data: text || "",
      isConfigured: true,
      provider: "OpenAI",
      model,
      durationMs,
    };
  } catch (err) {
    return {
      success: false,
      isConfigured: true,
      provider: "OpenAI",
      model,
      error: err instanceof Error ? err.message : "Network error with OpenAI API.",
      durationMs: Date.now() - startTime,
    };
  }
}
