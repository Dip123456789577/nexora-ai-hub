import type { AIResult } from "../types";

export function getAnthropicApiKey(): string | undefined {
  if (typeof process !== "undefined") {
    return process.env["ANTHROPIC_API_KEY"];
  }
  return undefined;
}

export function isAnthropicConfigured(): boolean {
  return Boolean(getAnthropicApiKey());
}

export async function callAnthropic(
  prompt: string,
  options: { model?: string | undefined; systemPrompt?: string | undefined } = {},
): Promise<AIResult<string>> {
  const startTime = Date.now();
  const apiKey = getAnthropicApiKey();

  if (!apiKey) {
    return {
      success: false,
      isConfigured: false,
      provider: "Anthropic",
      model: options.model || "claude-3-5-sonnet-20241022",
      error:
        "Anthropic API key is not configured. Add ANTHROPIC_API_KEY to your environment variables or in Settings.",
      configGuide: {
        provider: "Anthropic",
        envVar: "ANTHROPIC_API_KEY",
        docsUrl: "https://console.anthropic.com/settings/keys",
        message: "Get your Claude API key from the Anthropic Console.",
      },
      durationMs: 0,
    };
  }

  const model = options.model || "claude-3-5-sonnet-20241022";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        ...(options.systemPrompt ? { system: options.systemPrompt } : {}),
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const durationMs = Date.now() - startTime;

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMsg =
        (errorData as { error?: { message?: string } })?.error?.message ||
        `Anthropic returned status ${res.status}`;
      return {
        success: false,
        isConfigured: true,
        provider: "Anthropic",
        model,
        error: errorMsg,
        durationMs,
      };
    }

    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const text = data?.content?.[0]?.text;

    return {
      success: true,
      data: text || "",
      isConfigured: true,
      provider: "Anthropic",
      model,
      durationMs,
    };
  } catch (err) {
    return {
      success: false,
      isConfigured: true,
      provider: "Anthropic",
      model,
      error: err instanceof Error ? err.message : "Network error with Anthropic API.",
      durationMs: Date.now() - startTime,
    };
  }
}
