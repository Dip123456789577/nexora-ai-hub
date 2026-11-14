export function getTavilyApiKey(): string | undefined {
  if (typeof process !== "undefined") {
    return process.env["TAVILY_API_KEY"];
  }
  return undefined;
}

export function isTavilyConfigured(): boolean {
  return Boolean(getTavilyApiKey());
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
  publishedDate?: string;
}

export interface TavilySearchResponse {
  query: string;
  results: TavilySearchResult[];
  answer?: string;
}

export async function searchTavily(query: string): Promise<{
  success: boolean;
  isConfigured: boolean;
  data?: TavilySearchResponse;
  error?: string;
}> {
  const apiKey = getTavilyApiKey();
  if (!apiKey) {
    return {
      success: false,
      isConfigured: false,
      error:
        "Tavily Search API key is not configured. Add TAVILY_API_KEY to your environment variables or in Settings.",
    };
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        include_answer: true,
        max_results: 6,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        isConfigured: true,
        error: `Tavily returned error status ${res.status}`,
      };
    }

    const data = (await res.json()) as TavilySearchResponse;
    return {
      success: true,
      isConfigured: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      isConfigured: true,
      error: err instanceof Error ? err.message : "Network error with Tavily Search API",
    };
  }
}
