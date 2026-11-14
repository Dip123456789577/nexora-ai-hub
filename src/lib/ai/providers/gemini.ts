import type { AIResult } from "../types";

export interface GeminiCallOptions {
  model?: string | undefined;
  systemPrompt?: string | undefined;
  temperature?: number | undefined;
  maxOutputTokens?: number | undefined;
  jsonMode?: boolean | undefined;
  inlineImages?:
    | Array<{
        mimeType: string;
        data: string; // base64
      }>
    | undefined;
}

export function getGeminiApiKey(): string | undefined {
  if (typeof process !== "undefined") {
    return process.env["GEMINI_API_KEY"] || process.env["GOOGLE_GENERATIVE_AI_API_KEY"];
  }
  return undefined;
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

export async function callGemini(
  prompt: string,
  options: GeminiCallOptions = {},
): Promise<AIResult<string>> {
  const startTime = Date.now();
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      success: false,
      isConfigured: false,
      provider: "Google Gemini",
      model: options.model || "gemini-2.5-flash",
      error:
        "Google Gemini API key is not configured. Add GEMINI_API_KEY to your environment variables or in Settings.",
      configGuide: {
        provider: "Google Gemini",
        envVar: "GEMINI_API_KEY",
        docsUrl: "https://aistudio.google.com/app/apikey",
        message: "Get your free Gemini API key from Google AI Studio and set GEMINI_API_KEY.",
      },
      durationMs: 0,
    };
  }

  const model = options.model || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const parts: Array<Record<string, unknown>> = [];

  if (options.inlineImages && options.inlineImages.length > 0) {
    for (const img of options.inlineImages) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data,
        },
      });
    }
  }

  parts.push({ text: prompt });

  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts,
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 4096,
      ...(options.jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };

  if (options.systemPrompt) {
    body["systemInstruction"] = {
      parts: [{ text: options.systemPrompt }],
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const durationMs = Date.now() - startTime;

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMsg =
        (errorData as { error?: { message?: string } })?.error?.message ||
        `Gemini API returned status ${res.status} (${res.statusText})`;

      return {
        success: false,
        isConfigured: true,
        provider: "Google Gemini",
        model,
        error: errorMsg,
        durationMs,
      };
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
        finishReason?: string;
      }>;
    };

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        success: false,
        isConfigured: true,
        provider: "Google Gemini",
        model,
        error: "No text response received from Gemini model.",
        durationMs,
      };
    }

    return {
      success: true,
      data: text,
      isConfigured: true,
      provider: "Google Gemini",
      model,
      durationMs,
    };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      isConfigured: true,
      provider: "Google Gemini",
      model,
      error:
        err instanceof Error ? err.message : "Network error communicating with Google Gemini API.",
      durationMs,
    };
  }
}
