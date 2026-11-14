import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { checkGrammarFn } from "@/lib/ai/server-functions";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";
import type { GrammarResultData } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/writing/grammar")({
  component: GrammarCheckerPage,
});

function GrammarCheckerPage() {
  const [text, setText] = useState(
    "Their is several reasons why the system have failed during peak load, but the team didnt noticed it untill yesterday.",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GrammarResultData | null>(null);
  const [copied, setCopied] = useState(false);
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to check.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    try {
      const res = await checkGrammarFn({
        data: { text: text.trim() },
      });

      if (res.success && res.data) {
        setResult(res.data);
        toast.success(`Analysis complete! Score: ${res.data.score}/100`);
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Grammar check failed.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error during grammar analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCorrected = async () => {
    if (!result?.correctedText) return;
    try {
      await navigator.clipboard.writeText(result.correctedText);
      setCopied(true);
      toast.success("Corrected text copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
            <FileSpreadsheet className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Grammar & Syntactic Proofreader
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Detect spelling infelicities, grammatical concord flaws, and stylistic improvements
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
        {/* Left: Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Original Text for Inspection
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setText("")}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste prose, emails, or drafts here..."
              className="min-h-[220px] resize-y bg-surface-container-lowest font-sans text-sm border-border/60 focus:border-primary"
            />

            <Button
              onClick={handleCheck}
              disabled={isLoading || !text.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Proofreading Text...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Check Grammar & Syntax</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Score header */}
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-secondary">
                    Editorial Score
                  </span>
                  <div className="text-3xl font-black text-foreground">
                    {result.score}{" "}
                    <span className="text-sm font-normal text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <div className="text-right max-w-xs">
                  <p className="text-xs text-muted-foreground">{result.summary}</p>
                </div>
              </div>

              {/* Corrected Text Box */}
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-secondary" />
                    Corrected Text
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCorrected}
                    className="h-7 gap-1 border-border/60 text-xs"
                  >
                    {copied ? (
                      <Check className="size-3 text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <p className="text-sm text-foreground/95 leading-relaxed font-sans">
                  {result.correctedText}
                </p>
              </div>

              {/* Individual Corrections List */}
              {result.corrections && result.corrections.length > 0 && (
                <div className="rounded-2xl border border-border/60 bg-card/40 p-5 space-y-3">
                  <span className="text-xs font-bold text-foreground">
                    Granular Corrections ({result.corrections.length})
                  </span>
                  <div className="space-y-2">
                    {result.corrections.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-border/40 bg-surface-container/30 text-xs space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="line-through text-red-400 font-mono">{c.original}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {c.corrected}
                          </span>
                          <span className="ml-auto text-[10px] font-mono uppercase text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                            {c.type}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px]">{c.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[360px]">
              <FileSpreadsheet className="size-8 text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground">Proofreader Awaiting Content</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Paste your paragraph or document on the left to reveal typos, punctuation fixes, and
                syntactic flow enhancements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
