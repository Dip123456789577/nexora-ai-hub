import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Code2,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { runCustomPromptFn } from "@/lib/ai/server-functions";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/developer/regex")({
  component: RegexGeneratorPage,
});

function RegexGeneratorPage() {
  const [description, setDescription] = useState(
    "Match valid RFC 5322 email addresses, disallowing consecutive dots, and requiring valid TLDs of 2 to 6 alphabetic characters.",
  );
  const [regexPattern, setRegexPattern] = useState(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,6}$",
  );
  const [flags, setFlags] = useState("gm");
  const [testString, setTestString] = useState(
    "contact@nexora.ai\ninvalid..email@example\ntest.user+tag@domain.co.uk\nnot-an-email",
  );
  const [explanation, setExplanation] = useState(
    "This regular expression validates email addresses by ensuring proper local-part characters, single domain separators, and an alphabetic top-level domain.",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const handleGenerateRegex = async () => {
    if (!description.trim()) {
      toast.error("Please describe your regex pattern requirements.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    const prompt = `You are NEXORA Compiler & Formal Language Automata Engine.
Construct a production-grade Regular Expression for the following requirement:
"${description}"

Output JSON format strictly with this schema:
{
  "pattern": "^[a-z0-9]+$",
  "flags": "gm",
  "explanation": "Detailed breakdown of character classes, anchors, and lookaheads",
  "sampleMatches": ["test1", "abc2"],
  "sampleNonMatches": ["FAIL!", "123"]
}
Do not wrap in markdown quotes if returning raw JSON. Pure JSON only.`;

    try {
      const res = await runCustomPromptFn({
        data: {
          prompt,
          provider: "gemini",
          model: "gemini-2.5-flash",
          systemPrompt: "You are NEXORA Regex Architect. Return valid JSON only.",
        },
      });

      if (res.success && res.data) {
        try {
          const clean = res.data
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          const parsed = JSON.parse(clean);
          if (parsed.pattern) {
            setRegexPattern(parsed.pattern);
            if (parsed.flags) setFlags(parsed.flags);
            if (parsed.explanation) setExplanation(parsed.explanation);
            if (parsed.sampleMatches && parsed.sampleNonMatches) {
              setTestString([...parsed.sampleMatches, ...parsed.sampleNonMatches].join("\n"));
            }
            toast.success("Regular expression compiled successfully!");
          }
        } catch {
          // If model returned plain text explanation
          setExplanation(res.data);
          toast.success("Generated regex explanation.");
        }
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to generate regex.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error generating regex.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`/${regexPattern}/${flags}`);
      setCopied(true);
      toast.success("Regex pattern copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Run live matching
  const testLines = testString.split("\n").filter((l) => l.trim().length > 0);
  const getMatchResults = () => {
    try {
      const re = new RegExp(regexPattern, flags);
      return testLines.map((line) => ({
        line,
        matched: re.test(line),
      }));
    } catch {
      return testLines.map((line) => ({
        line,
        matched: false,
        error: "Invalid Regex syntax",
      }));
    }
  };

  const matchResults = getMatchResults();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
            <Code2 className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Regex Generator & Match Tester
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Natural language pattern synthesis • Character class breakdown • Live interactive test
              runner
            </p>
          </div>
        </div>
      </div>

      {configError && (
        <ApiConfigBanner
          providerName={configError.provider}
          envVar={configError.envVar}
          docsUrl={configError.docsUrl}
          message={configError.message}
        />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Natural Language Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Describe the Pattern in Plain English
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Match international phone numbers with optional country code (+1, +44, +91) and hyphens"
                className="min-h-[100px] bg-surface-container-lowest font-sans text-xs border-border/60"
              />
            </div>

            <Button
              onClick={handleGenerateRegex}
              disabled={isLoading || !description.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Synthesizing Finite Automaton...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Generate Regex Pattern</span>
                </>
              )}
            </Button>

            {/* Compiled Pattern Display */}
            <div className="rounded-xl border border-border/60 bg-surface-container-lowest p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-secondary font-semibold">
                  Compiled Expression
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 gap-1 border-border/60 text-[11px]"
                >
                  {copied ? (
                    <Check className="size-3 text-emerald-400" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>

              <div className="flex items-center gap-2 font-mono text-sm text-foreground bg-surface-container/60 p-2.5 rounded-lg border border-border/40 overflow-x-auto">
                <span className="text-muted-foreground">/</span>
                <input
                  type="text"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  className="flex-1 bg-transparent border-0 text-secondary focus:outline-none"
                />
                <span className="text-muted-foreground">/</span>
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  className="w-8 bg-transparent border-0 text-primary focus:outline-none"
                  title="Flags"
                />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{explanation}</p>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Matcher */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="size-4 text-primary" />
                <Label className="text-xs font-semibold text-muted-foreground">
                  Interactive Test Strings (1 per line)
                </Label>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">Live Matcher</span>
            </div>

            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Paste test strings to verify matches..."
              className="min-h-[140px] bg-surface-container-lowest font-mono text-xs border-border/60"
            />

            {/* Match Results List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground">
                Match Results ({matchResults.filter((r) => r.matched).length} /{" "}
                {matchResults.length} Matched)
              </span>

              <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                {matchResults.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-colors ${
                      r.matched
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-red-500/40 bg-red-500/10 text-red-300"
                    }`}
                  >
                    <span className="truncate pr-2">{r.line}</span>
                    <span className="flex items-center gap-1 shrink-0 text-[11px] font-semibold">
                      {r.matched ? (
                        <>
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                          <span>Match</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3.5 text-red-400" />
                          <span>No Match</span>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
