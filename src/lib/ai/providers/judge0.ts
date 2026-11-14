export function getJudge0ApiKey(): string | undefined {
  if (typeof process !== "undefined") {
    return process.env["JUDGE0_API_KEY"];
  }
  return undefined;
}

export function isJudge0Configured(): boolean {
  return Boolean(getJudge0ApiKey());
}

export async function checkJudge0Status(): Promise<{
  isConfigured: boolean;
  status: string;
  error?: string;
}> {
  const apiKey = getJudge0ApiKey();
  if (!apiKey) {
    return {
      isConfigured: false,
      status: "Waiting for configuration (JUDGE0_API_KEY)",
    };
  }

  const host = process.env["JUDGE0_API_URL"] || "https://judge0-ce.p.rapidapi.com";

  try {
    const res = await fetch(`${host}/about`, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    });

    if (res.ok) {
      return { isConfigured: true, status: "Online" };
    }
    return { isConfigured: true, status: `HTTP ${res.status}` };
  } catch (err) {
    return {
      isConfigured: true,
      status: "Error",
      error: err instanceof Error ? err.message : "Failed to reach Judge0 sandbox",
    };
  }
}
