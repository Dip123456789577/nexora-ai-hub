import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Sparkles, Send, Loader2, RotateCcw, AlignLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateSummaryFn } from "@/lib/ai/server-functions";
import { ResultPanel } from "@/components/shared/result-panel";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";
import type { SummarizeInput } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/study/summarizer")({
  component: SummarizerPage,
});

function SummarizerPage() {
  const [text, setText] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [format, setFormat] = useState<"bullet-points" | "executive-summary" | "key-takeaways">(
    "executive-summary",
  );
  const [includeDefinitions, setIncludeDefinitions] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | undefined>();
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to summarize.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    try {
      const payload: SummarizeInput = {
        text: text.trim(),
        length,
        format,
        includeDefinitions,
      };

      const res = await generateSummaryFn({ data: payload });

      if (res.success && res.data) {
        setResult(res.data);
        setDurationMs(res.durationMs);
        toast.success("Summary generated successfully!");
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to synthesize summary.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error generating summary.");
    } finally {
      setIsLoading(false);
    }
  };

  const sampleArticle = `Large Language Models (LLMs) are deep learning models trained on vast corpora of text data using self-supervised learning objectives, typically next-token prediction. Architecturally, the dominant paradigm is the Transformer architecture introduced by Vaswani et al. in 2017, which replaces recurrent neural networks (RNNs) with multi-head self-attention mechanisms. Self-attention enables models to compute pairwise dependencies between all tokens in a sequence concurrently in O(N^2) complexity, enabling massive parallelization during GPU cluster training. In recent years, scaling laws demonstrated by Kaplan et al. and Chinchilla optimal compute findings by Hoffmann et al. proved that model performance scales predictably with parameters, dataset size, and compute budget. Post-training methodologies, including Reinforcement Learning from Human Feedback (RLHF) and Direct Preference Optimization (DPO), align generative capabilities with human intent, safety guidelines, and conversational compliance.`;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              AI Document & Concept Summarizer
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              High-density executive synthesis • Bulleted abstractions • Core definitions extraction
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                <AlignLeft className="size-4 text-primary" />
                Source Text to Synthesize
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setText(sampleArticle)}
                className="text-xs text-secondary hover:text-secondary/80 h-7"
              >
                Insert Sample Text
              </Button>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste research papers, long essays, lecture transcripts, or articles here..."
              className="min-h-[220px] resize-y bg-surface-container-lowest font-sans text-sm border-border/60 focus:border-primary"
            />

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Summary Length
                </Label>
                <Select value={length} onValueChange={(v) => setLength(v as typeof length)}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (High Density)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="long">Long (Comprehensive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Format Style</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as typeof format)}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive-summary">Executive Summary</SelectItem>
                    <SelectItem value="bullet-points">Bulleted Key Points</SelectItem>
                    <SelectItem value="key-takeaways">Actionable Takeaways</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSummarize}
                  disabled={isLoading || !text.trim()}
                  className="w-full h-9 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>Synthesize</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Result */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <ResultPanel
              title="Executive Synthesis"
              subtitle={`Format: ${format} • Length: ${length}`}
              content={result}
              isLoading={isLoading}
              onRegenerate={handleSummarize}
              metadata={{
                durationMs,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[340px]">
              <FileText className="size-8 text-muted-foreground mb-3" />
              <h3 className="text-sm font-bold text-foreground">Ready for Text Synthesis</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Paste any article or document on the left to extract key takeaways, structural
                summaries, and essential definitions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
